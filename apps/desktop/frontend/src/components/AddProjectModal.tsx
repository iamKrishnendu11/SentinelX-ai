"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, FolderPlus, RefreshCw, AlertCircle, Check } from "lucide-react";
import { useGitHub } from "@/context/GitHubContext";
import { GitHubRepository } from "@/types/github";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { PrimaryButton, GhostButton, Tag } from "@/components/shared";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const { githubState, loadRepositories, addProject } = useGitHub();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectingRepoId, setConnectingRepoId] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await loadRepositories();
    if (result.error) {
      setError(result.error);
      setRepos([]);
    } else {
      setRepos(result.repos);
    }
    setLoading(false);
  }, [loadRepositories]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && githubState.connected) {
      loadRepositories().then((result) => {
        if (!isMounted) return;
        if (result.error) {
          setError(result.error);
          setRepos([]);
        } else {
          setRepos(result.repos);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, githubState.connected, loadRepositories]);

  const handleConnectRepo = async (repo: GitHubRepository) => {
    setConnectingRepoId(repo.id);
    const success = await addProject(repo);
    setConnectingRepoId(null);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-panel border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-ink">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-panel border border-lime/30 flex items-center justify-center text-lime shadow-[0_0_15px_rgba(183,255,0,0.1)]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <Tag>GITHUB INTEGRATION</Tag>
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-fog mt-1">
                Add a Project
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 border border-white/10 bg-panel hover:bg-white/5 text-ash hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 bg-panel">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-ash" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH REPOSITORIES..."
              className="w-full bg-ink border border-white/10 pl-12 pr-4 py-3 font-mono text-xs tracking-widest text-fog placeholder-ash focus:border-lime focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Repository List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-ink">
          {loading ? (
            <div className="py-12 text-center flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-lime animate-spin mx-auto" />
              <p className="text-[10px] font-mono tracking-widest text-ash uppercase">Fetching Repositories...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-16 h-16 bg-panel border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">{error}</p>
                <p className="text-sm text-ash font-sans">
                  The backend GitHub repository endpoint (`GET /api/github/repositories`) will return your repositories when configured.
                </p>
              </div>
              <GhostButton onClick={fetchRepos}>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  RETRY CONNECTION
                </div>
              </GhostButton>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <GitHubIcon className="w-10 h-10 text-ash mx-auto" />
              <p className="text-[10px] font-mono tracking-widest text-ash uppercase">
                {search ? "NO REPOSITORIES MATCH SEARCH." : "NO REPOSITORIES FOUND."}
              </p>
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="p-5 bg-panel border border-white/10 hover:border-lime/30 flex items-center justify-between transition-colors group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono font-bold text-fog uppercase">
                      {repo.name}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 border border-white/10 bg-ink text-ash uppercase">
                      {repo.private ? "PRIVATE" : "PUBLIC"}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-ash uppercase">
                      {repo.defaultBranch}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-slate-500 font-sans line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleConnectRepo(repo)}
                  disabled={connectingRepoId === repo.id}
                  className="px-4 py-2 border border-lime/30 text-lime font-mono text-[10px] tracking-widest font-bold uppercase transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:bg-lime hover:text-ink shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{connectingRepoId === repo.id ? "CONNECTING..." : "CONNECT"}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-white/10 bg-ink flex items-center justify-between text-[10px] tracking-widest uppercase font-mono text-ash">
          <span>GITHUB: @{githubState.username || "USER"}</span>
          <button
            onClick={onClose}
            className="text-ash hover:text-fog transition-colors cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
