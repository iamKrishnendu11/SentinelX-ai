import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from schemas.security_audit import ScanRequest, SecurityAuditReport
from services.triage_agents import execute_audit_pipeline, run_recon, run_triage
from services.scanners import run_semgrep, run_gitleaks, run_trivy

router = APIRouter(prefix="/api/v1/audit", tags=["Security Audit"])

@router.post("/scan", response_model=SecurityAuditReport)
async def trigger_security_audit(request: ScanRequest):
    """
    Triggers the full security audit pipeline and returns the final report.
    """
    report_data = None
    async for event in execute_audit_pipeline(str(request.repo_url), request.branch or "main"):
        if event.get("event") == "REPORT_READY":
            report_data = event.get("data")

    if not report_data:
        raise HTTPException(status_code=500, detail="Audit pipeline failed to generate report.")

    return SecurityAuditReport(**report_data)

@router.get("/scan/stream")
async def stream_security_audit(repo_url: str, branch: str = "main"):
    """
    SSE endpoint broadcasting real-time security audit execution milestones.
    """
    async def event_generator():
        async for event in execute_audit_pipeline(repo_url, branch):
            event_type = event.get("event", "message")
            data_str = json.dumps(event)
            yield f"event: {event_type}\ndata: {data_str}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
