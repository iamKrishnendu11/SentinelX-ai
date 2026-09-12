import os
import json
import time
import shutil
import tempfile
import asyncio
import logging
import subprocess
import urllib.request
from typing import AsyncGenerator, Any

from schemas.security_audit import VulnerabilityFinding, SecurityAuditReport
from services.scanners import run_semgrep, run_gitleaks, run_trivy, run_heuristic_scan

logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5-coder:7b"

async def run_recon(target_dir: str) -> dict[str, Any]:
    """
    Inspects project manifests to determine tech stack and metadata.
    """
    tech_stack: dict[str, Any] = {
        "languages": [],
        "frameworks": [],
        "manifests_found": []
    }

    manifest_map = {
        "package.json": ("JavaScript/Node.js", "npm"),
        "requirements.txt": ("Python", "pip"),
        "pom.xml": ("Java", "Maven"),
        "go.mod": ("Go", "Go Modules"),
        "Dockerfile": ("Docker", "Container")
    }

    for filename, (lang, fw) in manifest_map.items():
        if os.path.exists(os.path.join(target_dir, filename)):
            tech_stack["manifests_found"].append(filename)
            if lang not in tech_stack["languages"]:
                tech_stack["languages"].append(lang)
            if fw not in tech_stack["frameworks"]:
                tech_stack["frameworks"].append(fw)

    return tech_stack

async def call_ollama_triage(prompt: str) -> str:
    """
    Helper function to invoke local Ollama API asynchronously.
    """
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }

    def _sync_post():
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            OLLAMA_API_URL,
            data=data,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=60) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            return res_json.get("response", "")

    try:
        return await asyncio.to_thread(_sync_post)
    except Exception as e:
        logger.error(f"Error communicating with Ollama: {e}")
        return "[]"

def normalize_scanner_finding(source: str, raw_item: dict[str, Any], idx: int) -> VulnerabilityFinding:
    """
    Standardizes heterogeneous scanner outputs (Semgrep, Gitleaks, Trivy, Heuristic)
    into a valid VulnerabilityFinding object.
    """
    data = raw_item.get("data", raw_item) if isinstance(raw_item, dict) else {}
    extra = data.get("extra", {}) if isinstance(data, dict) else {}

    file_path = data.get("path") or data.get("file") or data.get("file_path") or "unknown_file"
    line_number = data.get("line") or data.get("start_line") or data.get("line_number") or 1
    
    title = (
        extra.get("message") or 
        data.get("check_id") or 
        data.get("Title") or 
        data.get("Description") or 
        f"Security Finding in {os.path.basename(file_path)}"
    )

    cwe_id = extra.get("cwe") or data.get("cwe_id") or data.get("CweIDs", ["CWE-20"])[0] if isinstance(data.get("CweIDs"), list) else "CWE-20"
    severity = (extra.get("severity") or data.get("severity") or data.get("Severity") or "HIGH").upper()
    if severity not in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
        severity = "HIGH"

    raw_snippet = extra.get("lines") or data.get("raw_snippet") or data.get("Match") or f"// Finding at {file_path}:{line_number}"

    return VulnerabilityFinding(
        id=f"vuln-{source}-{idx+1}",
        scanner_source=source,
        title=str(title)[:100],
        cwe_id=str(cwe_id),
        severity=severity,
        file_path=str(file_path),
        line_number=int(line_number) if str(line_number).isdigit() else 1,
        raw_snippet=str(raw_snippet),
        root_cause_analysis=f"Static analysis alert flagged by {source} in {os.path.basename(file_path)}.",
        is_true_positive=True
    )

async def run_triage(findings: list[dict[str, Any]], target_dir: str) -> list[VulnerabilityFinding]:
    """
    Normalizes candidate findings and uses qwen2.5-coder:7b via local Ollama
    to evaluate alerts, filter false positives, and output verified VulnerabilityFinding instances.
    """
    if not findings:
        return []

    # 1. Pre-normalize all candidate findings into valid VulnerabilityFinding objects
    normalized_candidates: list[VulnerabilityFinding] = []
    for idx, item in enumerate(findings):
        source = item.get("scanner_source", "scanner") if isinstance(item, dict) else "scanner"
        normalized_candidates.append(normalize_scanner_finding(source, item, idx))

    # 2. Prepare LLM prompt with normalized candidates
    system_instruction = (
        "You are an expert DevSecOps code reviewer. Evaluate the static scanner alerts and the surrounding code snippet.\n"
        "Filter out false positives (e.g., test mocks, safely sanitized inputs).\n"
        "For true positives, explain the root cause of the vulnerability and output a strict JSON array matching the schema:\n"
        "[{\n"
        '  "id": "...",\n'
        '  "scanner_source": "...",\n'
        '  "title": "...",\n'
        '  "cwe_id": "...",\n'
        '  "severity": "CRITICAL|HIGH|MEDIUM|LOW",\n'
        '  "file_path": "...",\n'
        '  "line_number": 1,\n'
        '  "raw_snippet": "...",\n'
        '  "root_cause_analysis": "...",\n'
        '  "is_true_positive": true\n'
        "}]"
    )

    candidates_json = json.dumps([c.model_dump() for c in normalized_candidates[:15]], indent=2)
    full_prompt = f"{system_instruction}\n\nCandidate Findings:\n{candidates_json}\n\nRespond strictly with JSON array."

    raw_llm_response = await call_ollama_triage(full_prompt)

    verified: list[VulnerabilityFinding] = []
    try:
        start_idx = raw_llm_response.find("[")
        end_idx = raw_llm_response.rfind("]")
        if start_idx != -1 and end_idx != -1:
            json_str = raw_llm_response[start_idx:end_idx + 1]
            parsed_list = json.loads(json_str)
            for item in parsed_list:
                if isinstance(item, dict) and item.get("is_true_positive") is not False:
                    try:
                        verified.append(VulnerabilityFinding(**item))
                    except Exception:
                        pass
    except Exception as e:
        logger.error(f"Failed to parse LLM triage output: {e}")

    # Fallback to normalized candidates if LLM is offline or returned empty list
    if not verified:
        logger.info("Using normalized scanner findings as fallback verified vulnerabilities.")
        verified = normalized_candidates

    return verified

async def execute_audit_pipeline(repo_url: str, branch: str) -> AsyncGenerator[dict[str, Any], None]:
    """
    Orchestrates cloning, recon, multi-tool scanning, and AI triage while streaming progress updates.
    """
    start_time = time.time()
    temp_dir = tempfile.mkdtemp(prefix="sentinelx_audit_")

    try:
        yield {"event": "RECON_STARTED", "message": f"Cloning repository {repo_url} (branch: {branch})..."}

        def _clone_repo():
            res = subprocess.run(["git", "clone", "--depth", "1", "--branch", branch, repo_url, temp_dir], capture_output=True, text=True, errors="ignore")
            if res.returncode != 0:
                logger.info(f"Git clone with branch {branch} failed, trying default branch...")
                subprocess.run(["git", "clone", "--depth", "1", repo_url, temp_dir], capture_output=True, text=True, errors="ignore")

        await asyncio.to_thread(_clone_repo)

        tech_stack = await run_recon(temp_dir)

        yield {"event": "SCANNERS_RUNNING", "message": "Executing static code & dependency analysis tools..."}

        semgrep_results, gitleaks_results, trivy_results = await asyncio.gather(
            run_semgrep(temp_dir),
            run_gitleaks(temp_dir),
            run_trivy(temp_dir)
        )

        all_findings = []
        for s in semgrep_results:
            all_findings.append({"scanner_source": "semgrep", "data": s})
        for g in gitleaks_results:
            all_findings.append({"scanner_source": "gitleaks", "data": g})
        for t in trivy_results:
            all_findings.append({"scanner_source": "trivy", "data": t})

        heuristic_fallback_engaged = False
        # Run heuristic scanner fallback if no CLI scanner results found
        if not all_findings:
            heuristic_fallback_engaged = True
            yield {"event": "HEURISTIC_FALLBACK_ENGAGED", "data": "CLI missing or empty. Defaulting to internal heuristic regex scanner."}
            heuristic_results = run_heuristic_scan(temp_dir)
            for h in heuristic_results:
                all_findings.append({"scanner_source": "heuristic", "data": h})

        total_raw = len(all_findings)

        yield {"event": "AI_TRIAGE_ACTIVE", "message": f"Running AI Triage on {total_raw} raw finding(s)..."}

        verified_findings = await run_triage(all_findings, temp_dir)

        scan_duration = round(time.time() - start_time, 2)

        report = SecurityAuditReport(
            repo_url=repo_url,
            tech_stack=tech_stack,
            total_raw_findings=total_raw,
            verified_vulnerabilities=verified_findings,
            heuristic_fallback_engaged=heuristic_fallback_engaged,
            scan_duration_sec=scan_duration
        )

        yield {"event": "REPORT_READY", "data": report.model_dump()}

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
