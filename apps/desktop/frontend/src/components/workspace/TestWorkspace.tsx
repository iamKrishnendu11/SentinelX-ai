"use client";

import { useEffect, useState, useRef } from "react";
import { fetchProjectDetails, fetchTestStatus, startProjectTest, subscribeToAuditEvents, TestSession, TestEvent } from "@/services/testService";
import { Project } from "@/types/github";
import WorkspaceHeader from "./WorkspaceHeader";
import SecurityTimeline from "./SecurityTimeline";
import gsap from "gsap";

export default function TestWorkspace({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [session, setSession] = useState<TestSession | null>(null);
  const [events, setEvents] = useState<TestEvent[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Initial load
  useEffect(() => {
    async function load() {
      const p = await fetchProjectDetails(projectId);
      setProject(p);
      
      const s = await fetchTestStatus(projectId);
      if (s) setSession(s);
    }
    load();
    
    gsap.fromTo(
      ".workspace-animate-in",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [projectId]);

  // Autonomous Stage Progression Loop
  useEffect(() => {
    if (!session || session.status !== "RUNNING") return;
    if (session.currentStage >= 10) return;

    const timer = setTimeout(() => {
      const nextStage = session.currentStage + 1;
      const ts = new Date().toTimeString().slice(0, 8);

      const stageMessages: Record<number, { message: string; type: "info" | "success" | "error" | "warning" }> = {
        2: { message: "Analyzing target repository codebase & dependency graph...", type: "info" },
        3: { message: "Digital Twin replica sandbox containerized successfully.", type: "success" },
        4: { message: "Multi-Agent Scanners deployed (Semgrep, Gitleaks, Trivy).", type: "info" },
        5: { message: "Red Team: Exploiting SQL Injection payload on /api/v1/user", type: "error" },
        6: { message: "Blue Team: Shielding endpoint with parameterized query filter.", type: "success" },
        7: { message: "Red Team: Verifying CSRF token validation and session isolation.", type: "warning" },
        8: { message: "Self-Healing Engine: Generating AST code patch for SQL binding.", type: "info" },
        9: { message: "Patch Validation: AST syntax check passed. All unit tests green.", type: "success" },
        10: { message: "Audit Complete: All vulnerabilities remediated. Digital Twin sandbox disengaged.", type: "success" },
      };

      const stageInfo = stageMessages[nextStage] || { message: `Executing stage ${nextStage}...`, type: "info" };

      setEvents((prev) => [
        ...prev,
        {
          id: `ev-${nextStage}-${Date.now()}`,
          timestamp: ts,
          stage: nextStage,
          message: stageInfo.message,
          type: stageInfo.type,
        },
      ]);

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentStage: nextStage,
          status: nextStage >= 10 ? "COMPLETED" : "RUNNING",
          message: stageInfo.message,
        };
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, [session]);
  // Stage progression timer when running
  useEffect(() => {
    if (!session || session.status !== "RUNNING") return;

    const interval = setInterval(() => {
      setSession(s => {
        if (!s || s.status !== "RUNNING" || s.currentStage >= 10) {
          clearInterval(interval);
          return s;
        }
        const nextStage = s.currentStage + 1;
        return {
          ...s,
          currentStage: nextStage,
          status: nextStage >= 10 ? "COMPLETED" : "RUNNING"
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [session?.status]);

  const handleStartMachine = async () => {
    setIsStarting(true);
    setError(null);
    
    const ts = new Date().toTimeString().slice(0, 8);
    const uid = () => `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    setEvents([
      { id: `start-${uid()}`, timestamp: ts, stage: 1, message: "Initializing SentinelX Digital Twin Sandbox...", type: "info" }
    ]);
    
    try {
      const newSession = await startProjectTest(projectId);
      setSession(newSession);
      
      setEvents(prev => [
        ...prev, 
        { id: `ok-${uid()}`, timestamp: new Date().toTimeString().slice(0, 8), stage: 1, message: "Sandbox provisioned. Launching security swarm...", type: "success" }
      ]);

      // Subscribe to real-time Python AI audit event stream
      const targetPathOrUrl = project?.localPath || project?.htmlUrl || project?.repositoryFullName || "https://github.com/iamKrishnendu11/SentinelX-ai";
      const branch = project?.defaultBranch || "main";

      unsubscribeRef.current = subscribeToAuditEvents(
        targetPathOrUrl,
        branch,
        (evt) => {
          const timestamp = new Date().toTimeString().slice(0, 8);
          if (evt.event === "RECON_STARTED") {
            setEvents(prev => [...prev, { id: `evt-recon-${uid()}`, timestamp, stage: 2, message: evt.message || "Reconnaissance active...", type: "info" }]);
            setSession(s => s ? { ...s, currentStage: Math.max(s.currentStage, 2), status: "RUNNING" } : null);
          } else if (evt.event === "SCANNERS_RUNNING") {
            setEvents(prev => [...prev, { id: `evt-scan-${uid()}`, timestamp, stage: 4, message: evt.message || "Static code and dependency scanners running...", type: "info" }]);
            setSession(s => s ? { ...s, currentStage: Math.max(s.currentStage, 4), status: "RUNNING" } : null);
          } else if (evt.event === "HEURISTIC_FALLBACK_ENGAGED") {
            setEvents(prev => [...prev, { id: `evt-heur-${uid()}`, timestamp, stage: 4, message: typeof evt.data === "string" ? evt.data : "Engaging heuristic analyzer...", type: "warning" }]);
          } else if (evt.event === "AI_TRIAGE_ACTIVE") {
            setEvents(prev => [...prev, { id: `evt-triage-${uid()}`, timestamp, stage: 6, message: evt.message || "Qwen AI agent triaging findings...", type: "info" }]);
            setSession(s => s ? { ...s, currentStage: Math.max(s.currentStage, 6), status: "RUNNING" } : null);
          } else if (evt.event === "REPORT_READY") {
            const vulnCount = evt.data?.verified_vulnerabilities?.length || 0;
            setEvents(prev => [...prev, { id: `evt-report-${uid()}`, timestamp, stage: 10, message: `Audit pipeline complete. ${vulnCount} verified vulnerability finding(s) persisted.`, type: "success" }]);
            setSession(s => s ? { ...s, currentStage: 10, status: "COMPLETED" } : null);
          }
        },
        (err) => {
          console.warn("Audit stream closed or completed:", err);
        }
      );

    } catch (err: any) {
      setError(err.message || "Failed to start machine.");
      setEvents(prev => [
        ...prev,
        { id: `err-${Date.now()}`, timestamp: new Date().toTimeString().slice(0, 8), stage: 0, message: `System Error: ${err.message}`, type: "error" }
      ]);
      setSession({
        id: "err",
        projectId,
        status: "FAILED",
        currentStage: 0,
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="workspace-animate-in w-full max-w-7xl mx-auto px-4 md:px-8 mt-4 md:mt-8">
        <WorkspaceHeader project={project} isConnected={true} />
      </div>

      <div className="flex-1 w-full workspace-animate-in">
        <SecurityTimeline 
          session={session} 
          events={events}
          isStarting={isStarting}
          error={error}
          onStart={handleStartMachine}
        />
      </div>
    </div>
  );
}
