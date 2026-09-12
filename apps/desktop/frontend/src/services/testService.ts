import { Project } from "@/types/github";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export interface TestSession {
  id: string;
  projectId: string;
  status: "WAITING" | "RUNNING" | "COMPLETED" | "FAILED";
  currentStage: number;
  message?: string;
}

export interface TestEvent {
  id: string;
  timestamp: string;
  stage: number;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

export async function fetchProjectDetails(projectId: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const projects: Project[] = await response.json();
    return projects.find((p) => p.id === projectId) || null;
  } catch (error) {
    console.error("Failed to fetch project details:", error);
    return null;
  }
}

export async function startProjectTest(projectId: string): Promise<TestSession> {
  // This endpoint DOES NOT exist in the backend currently.
  // We will call it to let it naturally fail and return the real 404 error
  // so the UI can gracefully reflect the actual state without lying.
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/test/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to start machine");
  }
}

export async function fetchTestStatus(projectId: string): Promise<TestSession | null> {
  // This endpoint DOES NOT exist.
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/test/status`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}
