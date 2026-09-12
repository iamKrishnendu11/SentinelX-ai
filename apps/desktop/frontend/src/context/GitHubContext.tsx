"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GitHubConnection, Project, GitHubRepository } from "@/types/github";
import {
  fetchGitHubStatus,
  initiateGitHubOAuth,
  disconnectGitHubConnection,
  fetchGitHubRepositories,
} from "@/services/githubApi";

interface GitHubContextType {
  githubState: GitHubConnection;
  projects: Project[];
  isConnecting: boolean;
  connectGitHub: () => Promise<void>;
  disconnectGitHub: () => Promise<void>;
  setGitHubConnectionState: (state: GitHubConnection) => void;
  loadRepositories: () => Promise<{ repos: GitHubRepository[]; error?: string }>;
  addProject: (repo: GitHubRepository) => Promise<boolean>;
  removeProject: (projectId: string) => void;
  logout: () => void;
  clearError: () => void;
}

const initialGitHubState: GitHubConnection = {
  connected: false,
  username: null,
  avatarUrl: null,
  status: "disconnected",
  errorMessage: null,
};

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: React.ReactNode }) {
  const [githubState, setGithubState] = useState<GitHubConnection>(initialGitHubState);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check initial GitHub status on mount
  useEffect(() => {
    async function checkStatus() {
      const status = await fetchGitHubStatus();
      setGithubState(status);
    }
    checkStatus();
  }, []);

  const connectGitHub = useCallback(async () => {
    setIsConnecting(true);
    setGithubState((prev) => ({ ...prev, status: "connecting", errorMessage: null }));

    try {
      const result = await initiateGitHubOAuth();
      if (result.redirect && result.url) {
        window.location.href = result.url;
      } else {
        setGithubState({
          connected: false,
          username: null,
          avatarUrl: null,
          status: "error",
          errorMessage: result.error || "Unable to connect GitHub. Please try again.",
        });
      }
    } catch {
      setGithubState({
        connected: false,
        username: null,
        avatarUrl: null,
        status: "error",
        errorMessage: "An unexpected error occurred while connecting to GitHub.",
      });
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectGitHub = useCallback(async () => {
    await disconnectGitHubConnection();
    // Reset GitHub connection state
    setGithubState({
      connected: false,
      username: null,
      avatarUrl: null,
      status: "disconnected",
      errorMessage: null,
    });
    // Clear project associations from session
    setProjects([]);
  }, []);

  const setGitHubConnectionState = useCallback((newState: GitHubConnection) => {
    setGithubState(newState);
  }, []);

  const loadRepositories = useCallback(async () => {
    if (!githubState.connected) {
      return { repos: [], error: "Connect GitHub to load your repositories." };
    }
    return await fetchGitHubRepositories();
  }, [githubState.connected]);

  const addProject = useCallback(
    async (repo: GitHubRepository): Promise<boolean> => {
      if (!githubState.connected) {
        return false;
      }
      const newProject: Project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        repositoryId: repo.id,
        repositoryName: repo.name,
        owner: repo.owner,
        private: repo.private,
        defaultBranch: repo.defaultBranch || "main",
        connectedAt: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, newProject]);
      return true;
    },
    [githubState.connected]
  );

  const removeProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const logout = useCallback(() => {
    // 1. Clear active GitHub connection state
    setGithubState(initialGitHubState);
    // 2. Clear connected project associations from current Sentinel-X session
    setProjects([]);
    // 3. Remove OAuth temporary state
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("github_oauth_state");
    }
  }, []);

  const clearError = useCallback(() => {
    setGithubState((prev) => ({
      ...prev,
      status: prev.connected ? "connected" : "disconnected",
      errorMessage: null,
    }));
  }, []);

  return (
    <GitHubContext.Provider
      value={{
        githubState,
        projects,
        isConnecting,
        connectGitHub,
        disconnectGitHub,
        setGitHubConnectionState,
        loadRepositories,
        addProject,
        removeProject,
        logout,
        clearError,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
}
