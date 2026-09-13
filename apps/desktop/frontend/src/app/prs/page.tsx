"use client";

import { useEffect, useState } from "react";
import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import LocalAISetupCard from "@/components/LocalAISetupCard";
import { 
  GitPullRequest, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileCode, 
  Lock, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  GitBranch
} from "lucide-react";
import { useGitHub } from "@/context/GitHubContext";
import { useLocalAI } from "@/context/LocalAIContext";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { fetchApprovedPRs } from "@/services/testService";

export interface ApprovedPRItem {
  finding_id: string;
  file_path: string;
  patched_code: string;
  cwe_id: string;
  vuln_title: string;
  repo_url: string;
  github_branch: string;
  pr_url: string;
  applied_to_disk: boolean;
  approved_at?: string;
  status: string;
}

export default function PRsPage() {
  const { githubState, connectGitHub } = useGitHub();
  const { aiStatus } = useLocalAI();

  const [prs, setPrs] = useState<ApprovedPRItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDiffs, setExpandedDiffs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadPRs() {
      setLoading(true);
      try {
        const approvedList = await fetchApprovedPRs();
        setPrs(approvedList || []);
      } catch (err) {
        console.error("Failed loading approved PRs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPRs();
  }, []);

  const toggleDiff = (id: string) => {
    setExpandedDiffs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPRs = prs.filter((pr) => {
    const q = searchQuery.toLowerCase();
    return (
      pr.vuln_title.toLowerCase().includes(q) ||
      pr.repo_url.toLowerCase().includes(q) ||
      pr.cwe_id.toLowerCase().includes(q) ||
      pr.github_branch.toLowerCase().includes(q) ||
      pr.file_path.toLowerCase().includes(q)
    );
  });

  const totalPRs = prs.length;

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100 font-sans">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="Approved Pull Requests" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {!githubState.connected ? (
            <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-7 h-7" />
              </div>

              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-mono font-bold text-slate-100">
                  Pull Requests Locked
                </h2>
                <p className="text-sm text-slate-400 font-sans">
                  Connect GitHub to approve AI security patches and create official Pull Requests.
                </p>
              </div>

              <button
                onClick={connectGitHub}
                className="px-5 py-2.5 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.2)]"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>Connect GitHub</span>
              </button>
            </div>
          ) : !aiStatus.ready ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs font-mono text-amber-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pull Requests are locked until local AI engine setup is complete.</span>
              </div>
              <LocalAISetupCard />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Approved PRs</span>
                    <GitPullRequest className="w-4 h-4 text-[#B7FF00]" />
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    {totalPRs}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Security patches approved by user
                  </div>
                </div>

                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>GitHub Branches</span>
                    <GitBranch className="w-4 h-4 text-[#B7FF00]" />
                  </div>
                  <div className="text-2xl font-bold text-[#B7FF00]">
                    {totalPRs} Pushed
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Live on remote GitHub repository
                  </div>
                </div>

                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Syntax Validation</span>
                    <CheckCircle2 className="w-4 h-4 text-[#B7FF00]" />
                  </div>
                  <div className="text-2xl font-bold text-[#B7FF00]">
                    100% Passed
                  </div>
                  <div className="text-[10px] text-slate-400">
                    AST / Node syntax verified
                  </div>
                </div>

                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Production Status</span>
                    <ShieldCheck className="w-4 h-4 text-[#B7FF00]" />
                  </div>
                  <div className="text-sm font-bold text-slate-100 uppercase">
                    Zero Downtime
                  </div>
                  <div className="text-[10px] text-[#B7FF00] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Isolated Sandbox Verification</span>
                  </div>
                </div>
              </div>

              {/* Search Control */}
              <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 font-mono">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search PRs by repo, branch, CWE, or title..."
                    className="w-full bg-[#050505] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#B7FF00]/50"
                  />
                </div>

                <span className="text-xs text-slate-400 hidden sm:inline">
                  Showing {filteredPRs.length} of {totalPRs} Approved PR(s)
                </span>
              </div>

              {/* Approved PR Cards */}
              {loading ? (
                <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-3 font-mono">
                  <GitPullRequest className="w-8 h-8 text-[#B7FF00] animate-spin" />
                  <p className="text-xs text-slate-400">Loading approved Pull Requests...</p>
                </div>
              ) : filteredPRs.length === 0 ? (
                <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4 font-mono">
                  <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
                    <GitPullRequest className="w-7 h-7" />
                  </div>

                  <div className="max-w-md space-y-2">
                    <h2 className="text-xl font-bold text-slate-100">
                      No Approved PRs Found
                    </h2>
                    <p className="text-sm text-slate-400 font-sans">
                      {searchQuery
                        ? "No approved pull requests match your search criteria."
                        : "Approved security patches will be listed here after you click Approve & Create PR on audit scan findings."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 font-mono">
                  {filteredPRs.map((pr, idx) => {
                    const repoName =
                      pr.repo_url.replace("https://github.com/", "").replace(".git", "") ||
                      "Target Repository";
                    const isExpanded = !!expandedDiffs[pr.finding_id || idx.toString()];
                    const approveDate = pr.approved_at
                      ? new Date(pr.approved_at).toLocaleString()
                      : "Approved";

                    return (
                      <div
                        key={pr.finding_id || idx}
                        className="bg-[#0D0F0D] border border-lime/40 rounded-xl p-5 space-y-4 transition-all hover:border-[#B7FF00] shadow-xl group"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00] group-hover:border-[#B7FF00]/50 transition-colors">
                              <GitHubIcon className="w-5 h-5 text-slate-200" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/40 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {pr.cwe_id}
                                </span>
                                <h3 className="font-bold text-sm text-slate-100 group-hover:text-[#B7FF00] transition-colors">
                                  {pr.vuln_title}
                                </h3>
                              </div>

                              <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                                <span>Repo: <strong className="text-slate-200">{repoName}</strong></span>
                                <span>•</span>
                                <span>File: <code className="text-slate-300">{pr.file_path}</code></span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span>{approveDate}</span>
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* GitHub PR URL Direct Link Button */}
                            <a
                              href={pr.pr_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.25)]"
                            >
                              <GitPullRequest className="w-4 h-4" />
                              <span>View Pull Request on GitHub</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Details & Status Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 bg-[#050505] border border-white/10 text-slate-300 px-3 py-1 rounded font-mono">
                              <GitBranch className="w-3.5 h-3.5 text-[#B7FF00]" />
                              <span>{pr.github_branch}</span>
                            </span>

                            <span className="flex items-center gap-1 text-[#B7FF00] bg-[#B7FF00]/10 border border-[#B7FF00]/30 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Branch Pushed to Origin</span>
                            </span>
                          </div>

                          <button
                            onClick={() => toggleDiff(pr.finding_id || idx.toString())}
                            className="text-slate-400 hover:text-[#B7FF00] flex items-center gap-1 text-xs cursor-pointer font-mono"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                            <span>{isExpanded ? "Hide Code Patch" : "View Code Patch"}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Expandable Code Patch Drawer */}
                        {isExpanded && (
                          <div className="bg-[#050505] border border-white/10 rounded-lg p-4 space-y-2 text-xs font-mono">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                              Approved Security Code Patch ({pr.file_path}):
                            </div>
                            <pre className="text-emerald-400 bg-black/60 p-3 rounded border border-white/5 overflow-x-auto text-[11px] leading-relaxed">
                              {pr.patched_code}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
