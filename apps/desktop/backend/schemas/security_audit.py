from typing import Optional, Any, List
from datetime import datetime
from pydantic import BaseModel, HttpUrl, Field

class ScanRequest(BaseModel):
    repo_url: str
    branch: Optional[str] = "main"

class VulnerabilityFinding(BaseModel):
    id: str
    scanner_source: str
    title: str
    cwe_id: Optional[str] = None
    severity: str
    file_path: str
    line_number: Optional[int] = None
    raw_snippet: str
    root_cause_analysis: str
    is_true_positive: bool = True

class AttackProbeTelemetry(BaseModel):
    probe_id: str
    timestamp: str
    vector: str          # e.g., "IDOR", "SQLi", "COMMAND_INJECTION", "DESERIALIZATION", "XSS", "CORS"
    target_endpoint: str # e.g., "/api/user", "/api/ping", "/api/upload"
    action: str          # e.g., "FUZZ_PARAMETER", "CHECK_HEADER", "VERIFY_INPUT_SANITIZATION"
    status: str          # e.g., "BLOCKED_SCHEMA_VALIDATION", "SAFE", "EXPLOIT_VERIFIED"
    side: str = "red"

class AuditExecutionSnapshot(BaseModel):
    session_id: str
    target_repo: str
    scanned_at: str
    summary: dict = Field(default_factory=lambda: {
        "total_probes": 0,
        "blocked_or_safe": 0,
        "verified_exploits": 0,
        "security_score": 100
    })
    telemetry_timeline: List[AttackProbeTelemetry] = []
    verified_vulnerabilities: List[VulnerabilityFinding] = []
    heuristic_fallback_engaged: bool = False

class SecurityAuditReport(BaseModel):
    repo_url: str
    tech_stack: dict[str, Any] = Field(default_factory=dict)
    total_raw_findings: int = 0
    verified_vulnerabilities: list[VulnerabilityFinding] = Field(default_factory=list)
    heuristic_fallback_engaged: bool = False
    scan_duration_sec: float = 0.0
