from typing import Optional, Any
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

class SecurityAuditReport(BaseModel):
    repo_url: str
    tech_stack: dict[str, Any] = Field(default_factory=dict)
    total_raw_findings: int = 0
    verified_vulnerabilities: list[VulnerabilityFinding] = Field(default_factory=list)
    scan_duration_sec: float = 0.0
