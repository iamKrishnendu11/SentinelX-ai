"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, FolderPlus, RefreshCw, AlertCircle, Check } from "lucide-react";
import { useGitHub } from "@/context/GitHubContext";
import { GitHubRepository } from "@/types/github";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0D0F0D] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#050505] border border-[#B7FF00]/30 flex items-center justify-center text-[#B7FF00]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-mono font-bold text-slate-100">
                Add a Project
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Select a repository from your connected GitHub account (@{githubState.username}).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 bg-[#050505]/40">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-[#B7FF00] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Repository List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#B7FF00] animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Fetching GitHub repositories...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <p className="text-xs font-mono font-bold text-slate-300">{error}</p>
                <p className="text-[11px] text-slate-500 font-sans">
                  The backend GitHub repository endpoint (`GET /api/github/repositories`) will return your repositories when configured.
                </p>
              </div>
              <button
                onClick={fetchRepos}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <GitHubIcon className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-mono text-slate-400">
                {search ? "No repositories match your search." : "No repositories found on this GitHub account."}
              </p>
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-white/20 flex items-center justify-between transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-slate-200">
                      {repo.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                      {repo.private ? "Private" : "Public"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {repo.defaultBranch}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-slate-400 font-sans line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleConnectRepo(repo)}
                  disabled={connectingRepoId === repo.id}
                  className="px-3.5 py-1.5 rounded-lg bg-[#B7FF00]/10 hover:bg-[#B7FF00]/20 border border-[#B7FF00]/30 text-[#B7FF00] font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{connectingRepoId === repo.id ? "Connecting..." : "Connect Project"}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#050505]/60 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Connected GitHub: @{githubState.username || "user"}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
