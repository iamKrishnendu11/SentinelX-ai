import { GitHubConnection, GitHubRepository } from "@/types/github";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchGitHubStatus(): Promise<GitHubConnection> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/github/status`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 503) {
        return {
          connected: false,
          username: null,
          avatarUrl: null,
          status: "disconnected",
        };
      }
      throw new Error(`Failed to check status: HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      connected: !!data.connected,
      username: data.username || null,
      avatarUrl: data.avatarUrl || null,
      status: data.connected ? "connected" : "disconnected",
    };
  } catch {
    // Backend API status check failed or not reachable
    return {
      connected: false,
      username: null,
      avatarUrl: null,
      status: "disconnected",
    };
  }
}

export async function initiateGitHubOAuth(): Promise<{ url?: string; redirect: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/github/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return { url: data.url, redirect: true };
      }
    }

    // Direct OAuth flow using public Client ID if backend redirect URL endpoint is not configured
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (clientId) {
      const state = typeof window !== "undefined" ? crypto.randomUUID() : "";
      if (typeof window !== "undefined") {
        sessionStorage.setItem("github_oauth_state", state);
      }
      const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
      return { url: oauthUrl, redirect: true };
    }

    return {
      redirect: false,
      error: "GitHub OAuth integration is not configured on the server yet. Please set NEXT_PUBLIC_GITHUB_CLIENT_ID or configure backend OAuth.",
    };
  } catch {
    return {
      redirect: false,
      error: "Unable to reach backend server to initiate GitHub OAuth.",
    };
  }
}

export async function exchangeOAuthCode(code: string, state: string): Promise<GitHubConnection> {
  try {
    const savedState = typeof window !== "undefined" ? sessionStorage.getItem("github_oauth_state") : null;
    if (savedState && savedState !== state) {
      return {
        connected: false,
        username: null,
        avatarUrl: null,
        status: "error",
        errorMessage: "CSRF state validation failed during OAuth callback.",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/github/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        connected: false,
        username: null,
        avatarUrl: null,
        status: "error",
        errorMessage: data.message || "Failed to exchange GitHub authorization code.",
      };
    }

    return {
      connected: true,
      username: data.username || null,
      avatarUrl: data.avatarUrl || null,
      status: "connected",
    };
  } catch {
    return {
      connected: false,
      username: null,
      avatarUrl: null,
      status: "error",
      errorMessage: "Could not connect to backend to complete GitHub authorization.",
    };
  }
}

export async function disconnectGitHubConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/github/disconnect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchGitHubRepositories(): Promise<{ repos: GitHubRepository[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/github/repositories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { repos: [], error: "GitHub account not connected or session expired." };
      }
      return { repos: [], error: "GitHub API is not configured on the backend server yet." };
    }

    const data = await response.json();
    return { repos: data.repositories || [] };
  } catch {
    return { repos: [], error: "Connect GitHub to load your repositories." };
  }
}
