from typing import Optional, Any
from pydantic import BaseModel, Field
from schemas.security_audit import VulnerabilityFinding

class RemediationRequest(BaseModel):
    repo_path: str
    auto_apply: bool = True
    create_git_branch: bool = True
    branch_name: Optional[str] = "sentinelx/security-patches"
    github_token: Optional[str] = None
    create_pull_request: bool = False
    findings: list[VulnerabilityFinding] = Field(default_factory=list)

class PatchItem(BaseModel):
    finding_id: str
    file_path: str
    cwe_id: Optional[str] = None
    original_snippet: str
    patched_snippet: str
    git_diff: str
    developer_note: dict[str, str] = Field(default_factory=dict)
    syntax_valid: bool = True
    applied_to_disk: bool = False
    backup_file_path: Optional[str] = None
    error_details: Optional[str] = None
    fallback_used: bool = False

class RemediationReport(BaseModel):
    total_attempted: int = 0
    total_successful: int = 0
    patches: list[PatchItem] = Field(default_factory=list)
    remediation_duration_sec: float = 0.0
