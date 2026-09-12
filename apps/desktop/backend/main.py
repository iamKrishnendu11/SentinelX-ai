import os
import sys
import asyncio

# On Windows, enforce ProactorEventLoopPolicy for subprocess support
if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from routers.audit import router as audit_router
from routers.remediation import router as remediation_router

app = FastAPI(
    title="SentinelX Desktop Backend API",
    description="Automated Security Audit, Triage, and Blue Team Remediation Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit_router)
app.include_router(remediation_router)

@app.get("/", response_class=FileResponse)
def serve_testing_page():
    html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "pages", "index.html"))
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return FileResponse(os.path.abspath(os.path.join(os.path.dirname(__file__), "index.html")))

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SentinelX Desktop Backend"}
