import os
import re
import shutil
import asyncio
import json
import logging
import subprocess
from typing import Any

logger = logging.getLogger(__name__)

def _get_fresh_path() -> str:
    """Read the live system PATH from the Windows registry (or current env on other OS)."""
    if os.name == "nt":
        try:
            import winreg
            machine_path = ""
            user_path = ""
            try:
                with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\CurrentControlSet\Control\Session Manager\Environment") as key:
                    machine_path, _ = winreg.QueryValueEx(key, "Path")
            except Exception:
                pass
            try:
                with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Environment") as key:
                    user_path, _ = winreg.QueryValueEx(key, "Path")
            except Exception:
                pass
            return machine_path + ";" + user_path
        except Exception:
            pass
    return os.environ.get("PATH", "")

def _exec_cmd(cmd: list[str], cwd: str) -> tuple[int, str]:
    try:
        # Refresh PATH from registry so tools installed after this process started are found
        fresh_path = _get_fresh_path()
        executable = shutil.which(cmd[0], path=fresh_path)
        if not executable:
            logger.info(f"CLI tool '{cmd[0]}' not installed in system PATH. Skipping {cmd[0]} scan.")
            return -1, ""
        env = os.environ.copy()
        env["PATH"] = fresh_path
        use_shell = (os.name == "nt")
        res = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, errors="ignore", shell=use_shell, env=env)
        return res.returncode, res.stdout
    except Exception as e:
        logger.warning(f"CLI command execution error ({cmd[0]}): {e}")
        return -1, ""

async def run_semgrep(target_dir: str) -> list[dict[str, Any]]:
    """
    Executes semgrep scan --json --quiet asynchronously on target_dir.
    """
    code, stdout = await asyncio.to_thread(_exec_cmd, ["semgrep", "scan", "--json", "--quiet", target_dir], target_dir)
    if stdout:
        try:
            data = json.loads(stdout)
            return data.get("results", []) if isinstance(data, dict) else []
        except Exception:
            pass
    return []

async def run_gitleaks(target_dir: str) -> list[dict[str, Any]]:
    """
    Executes gitleaks detect --source=. --report-format=json --no-git asynchronously on target_dir.
    """
    code, stdout = await asyncio.to_thread(_exec_cmd, ["gitleaks", "detect", "--source=.", "--report-format=json", "--no-git"], target_dir)
    if stdout:
        try:
            data = json.loads(stdout)
            return data if isinstance(data, list) else []
        except Exception:
            pass
    return []

async def run_trivy(target_dir: str) -> list[dict[str, Any]]:
    """
    Executes trivy fs --format json . asynchronously on target_dir.
    """
    code, stdout = await asyncio.to_thread(_exec_cmd, ["trivy", "fs", "--format", "json", "."], target_dir)
    if stdout:
        try:
            data = json.loads(stdout)
            results = []
            if isinstance(data, dict) and "Results" in data:
                for target_res in data["Results"]:
                    vulnerabilities = target_res.get("Vulnerabilities", [])
                    results.extend(vulnerabilities)
            return results
        except Exception:
            pass
    return []

def run_heuristic_scan(target_dir: str) -> list[dict[str, Any]]:
    """
    Fallback in-process static analyzer for detecting common security flaws
    when external CLI tools (Semgrep/Gitleaks/Trivy) are not installed locally.
    """
    findings = []
    
    rules = [
        {
            "id": "heuristic-sql-injection",
            "title": "Possible SQL Injection",
            "cwe": "CWE-89",
            "severity": "CRITICAL",
            "pattern": r"(select|insert|update|delete)\s+.*?\+.*?|f[\"'].*?(select|insert|update|delete)|query\(\s*[\"'].*?\$",
            "flags": re.IGNORECASE
        },
        {
            "id": "heuristic-hardcoded-secret",
            "title": "Hardcoded API Key / Password Secret",
            "cwe": "CWE-798",
            "severity": "HIGH",
            "pattern": r"(api[_-]?key|password|secret[_-]?key|jwt[_-]?secret|private[_-]?key)\s*=\s*[\"'][A-Za-z0-9_\-]{8,}[\"']",
            "flags": re.IGNORECASE
        },
        {
            "id": "heuristic-command-injection",
            "title": "Unsafe Command Execution",
            "cwe": "CWE-78",
            "severity": "HIGH",
            "pattern": r"(os\.system|subprocess\.Popen|eval|exec|child_process\.exec)\(.*?f?[\"']",
            "flags": re.IGNORECASE
        },
        {
            "id": "heuristic-path-traversal",
            "title": "Potential Path Traversal",
            "cwe": "CWE-22",
            "severity": "HIGH",
            "pattern": r"open\([^)]*req\.|sendFile\([^)]*req\.|os\.path\.join\([^)]*params",
            "flags": re.IGNORECASE
        },
        {
            "id": "heuristic-xss-html-injection",
            "title": "Cross-Site Scripting (XSS) / Unsafe HTML Render",
            "cwe": "CWE-79",
            "severity": "MEDIUM",
            "pattern": r"dangerouslySetInnerHTML|innerHTML\s*=|document\.write\(|v-html",
            "flags": re.IGNORECASE
        },
        {
            "id": "heuristic-insecure-cors",
            "title": "Permissive Wildcard CORS Policy",
            "cwe": "CWE-942",
            "severity": "MEDIUM",
            "pattern": r"Access-Control-Allow-Origin.*?[\"']\*[\"']|cors\(\s*\{\s*origin\s*:\s*[\"']\*[\"']",
            "flags": re.IGNORECASE
        },
        {
            "id": "heuristic-weak-crypto",
            "title": "Weak Cryptographic Hash / Algorithm",
            "cwe": "CWE-327",
            "severity": "LOW",
            "pattern": r"createHash\([\"'](md5|sha1)[\"']\)|hashlib\.(md5|sha1)\(",
            "flags": re.IGNORECASE
        }
    ]

    for root, dirs, files in os.walk(target_dir):
        if ".git" in dirs: dirs.remove(".git")
        if "node_modules" in dirs: dirs.remove("node_modules")
        if "target" in dirs: dirs.remove("target")
        if "__pycache__" in dirs: dirs.remove("__pycache__")
        if ".next" in dirs: dirs.remove(".next")

        for file in files:
            if not file.endswith((".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".php", ".go", ".sql", ".json", ".html", ".env")):
                continue
            
            filepath = os.path.join(root, file)
            relpath = os.path.relpath(filepath, target_dir)

            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
                    for idx, line in enumerate(lines, 1):
                        for rule in rules:
                            if re.search(rule["pattern"], line, rule["flags"]):
                                snippet_start = max(0, idx - 3)
                                snippet_end = min(len(lines), idx + 3)
                                snippet = "".join(lines[snippet_start:snippet_end])
                                findings.append({
                                    "check_id": rule["id"],
                                    "path": relpath,
                                    "line": idx,
                                    "extra": {
                                        "message": rule["title"],
                                        "severity": rule["severity"],
                                        "cwe": rule["cwe"],
                                        "lines": snippet
                                    }
                                })
            except Exception as e:
                logger.debug(f"Could not read {filepath} for heuristic scan: {e}")

    return findings

