import { GitHubConnection, GitHubRepository, Project } from "@/types/github";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

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
      const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,read:user,user:email`;
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

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        repos: [],
        error: data.error || "GitHub account not connected or session expired.",
      };
    }

    return { repos: data.repositories || [] };
  } catch {
    return { repos: [], error: "Connect GitHub to load your repositories." };
  }
}

export async function fetchProjectsApi(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      id: item.id,
      repositoryId: item.githubRepositoryId || item.repositoryId || item.id,
      repositoryName: item.repositoryName || item.name,
      repositoryFullName: item.repositoryFullName || `${item.ownerLogin || item.owner}/${item.repositoryName}`,
      owner: item.ownerLogin || item.owner,
      private: !!item.privateRepository || !!item.private,
      defaultBranch: item.defaultBranch || "main",
      connectedAt: item.connectedAt || new Date().toISOString(),
      description: item.description,
      htmlUrl: item.htmlUrl,
    }));
  } catch {
    return [];
  }
}

export async function createProjectApi(repo: GitHubRepository): Promise<Project | null> {
  try {
    const payload = {
      githubRepositoryId: String(repo.id),
      repositoryName: repo.name,
      repositoryFullName: repo.fullName || `${repo.owner}/${repo.name}`,
      ownerLogin: repo.owner,
      description: repo.description || "",
      privateRepository: !!repo.private,
      defaultBranch: repo.defaultBranch || "main",
      htmlUrl: repo.htmlUrl || "",
      localPath: null,
    };

    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.success && data.project) {
      const item = data.project;
      return {
        id: item.id,
        repositoryId: item.githubRepositoryId || repo.id,
        repositoryName: item.repositoryName || repo.name,
        repositoryFullName: item.repositoryFullName || repo.fullName,
        owner: item.ownerLogin || repo.owner,
        private: item.privateRepository,
        defaultBranch: item.defaultBranch || repo.defaultBranch || "main",
        connectedAt: item.connectedAt || new Date().toISOString(),
        description: item.description,
        htmlUrl: item.htmlUrl,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteProjectApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}
