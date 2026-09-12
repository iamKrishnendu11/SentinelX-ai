"use client";

import { useEffect, useState } from "react";
import { fetchProjectDetails, fetchTestStatus, startProjectTest, TestSession, TestEvent } from "@/services/testService";
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
  }, [projectId]);

  const handleStartMachine = async () => {
    setIsStarting(true);
    setError(null);
    
    const ts = new Date().toTimeString().slice(0, 8);
    setEvents([{ id: `start-${Date.now()}`, timestamp: ts, stage: 0, message: "Initializing SentinelX environment...", type: "info" }]);
    
    try {
      const newSession = await startProjectTest(projectId);
      setSession(newSession);
      
      setEvents(prev => [
        ...prev, 
        { id: `ok-${Date.now()}`, timestamp: new Date().toTimeString().slice(0, 8), stage: 0, message: "Environment established successfully.", type: "success" }
      ]);
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
