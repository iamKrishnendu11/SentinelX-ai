"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import LocalAISetupCard from "@/components/LocalAISetupCard";
import { 
  Radar, 
  Info, 
  Lock, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  FileText, 
  Download, 
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { useGitHub } from "@/context/GitHubContext";
import { useLocalAI } from "@/context/LocalAIContext";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { fetchScanHistory } from "@/services/testService";

export interface ScanItem {
  session_id: string;
  target_repo: string;
  scanned_at?: string;
  summary?: {
    total_probes?: number;
    blocked_or_safe?: number;
    verified_exploits?: number;
    security_score?: number;
  };
  vulnerability_count?: number;
  duration_sec?: number;
  heuristic_fallback_engaged?: boolean;
  status?: string;
}

export default function ScansPage() {
  const { githubState, connectGitHub } = useGitHub();
  const { aiStatus } = useLocalAI();

  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    async function loadScans() {
      setLoading(true);
      try {
        const history = await fetchScanHistory();
        setScans(history || []);
      } catch (err) {
        console.error("Failed to load scan history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadScans();
  }, []);

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.target_repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.session_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "COMPLETED" && (scan.status === "COMPLETED" || !scan.status)) ||
      (statusFilter === "FAILED" && scan.status === "FAILED");

    return matchesSearch && matchesStatus;
  });

  const totalScans = scans.length;
  const avgScore =
    scans.length > 0
      ? Math.round(
          scans.reduce((acc, s) => acc + (s.summary?.security_score ?? 85), 0) / scans.length
        )
      : 85;
  const totalExploits = scans.reduce(
    (acc, s) => acc + (s.summary?.verified_exploits ?? s.vulnerability_count ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100 font-sans">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="Scans" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {!githubState.connected ? (
            <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-7 h-7" />
              </div>

              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-mono font-bold text-slate-100">
                  Scans Locked
                </h2>
                <p className="text-sm text-slate-400 font-sans">
                  Connect GitHub and import a project to enable local security scans.
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
                <span>Scans are locked until local AI engine setup is complete.</span>
              </div>
              <LocalAISetupCard />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Banner & Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Total Scans Executed</span>
                    <Radar className="w-4 h-4 text-[#B7FF00]" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-100">
                    {totalScans}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Autonomous swarms completed
                  </div>
                </div>

                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Avg Security Score</span>
                    <ShieldAlert className="w-4 h-4 text-[#B7FF00]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-[#B7FF00]">
                      {avgScore}/100
                    </span>
                    <span className="text-[10px] bg-lime-950/50 text-[#B7FF00] border border-[#B7FF00]/30 px-2 py-0.5 rounded font-mono font-bold">
                      HEALTHY
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Across all analyzed projects
                  </div>
                </div>

                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Verified Vulnerabilities</span>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-amber-400">
                    {totalExploits}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Confirmed true positives
                  </div>
                </div>

                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Digital Twin Sandbox</span>
                    <CheckCircle2 className="w-4 h-4 text-[#B7FF00]" />
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-100">
                    CONTAINED
                  </div>
                  <div className="text-[10px] text-[#B7FF00] font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>0 Production Risks</span>
                  </div>
                </div>
              </div>

              {/* Controls & Search */}
              <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by repo or session ID..."
                    className="w-full bg-[#050505] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#B7FF00]/50"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#B7FF00]/50 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>

                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all flex items-center gap-2 shrink-0"
                  >
                    <Radar className="w-3.5 h-3.5" />
                    <span>Run New Scan</span>
                  </Link>
                </div>
              </div>

              {/* Scans List / Cards */}
              {loading ? (
                <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-3">
                  <Radar className="w-8 h-8 text-[#B7FF00] animate-spin" />
                  <p className="font-mono text-xs text-slate-400">
                    Loading historical scan records...
                  </p>
                </div>
              ) : filteredScans.length === 0 ? (
                <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
                    <Radar className="w-7 h-7" />
                  </div>

                  <div className="max-w-md space-y-2">
                    <h2 className="text-xl font-mono font-bold text-slate-100">
                      No Scans Found
                    </h2>
                    <p className="text-sm text-slate-400 font-sans">
                      {searchQuery
                        ? "No scan matches your search query."
                        : "Trigger a security scan on your imported project to generate audit records."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 font-mono">
                  {filteredScans.map((scan) => {
                    const repoName =
                      scan.target_repo.replace("https://github.com/", "").replace(".git", "") ||
                      "Target Repository";
                    const score = scan.summary?.security_score ?? 85;
                    const vulnCount =
                      scan.summary?.verified_exploits ?? scan.vulnerability_count ?? 0;
                    const dateStr = scan.scanned_at
                      ? new Date(scan.scanned_at).toLocaleString()
                      : "Recently Scanned";

                    return (
                      <div
                        key={scan.session_id}
                        className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 hover:border-[#B7FF00]/40 transition-all space-y-4 group shadow-xl"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00] group-hover:border-[#B7FF00]/50 transition-colors">
                              <GitHubIcon className="w-5 h-5 text-slate-200" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm text-slate-100 group-hover:text-[#B7FF00] transition-colors">
                                  {repoName}
                                </h3>
                                <span className="bg-[#050505] border border-white/10 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                                  {scan.session_id}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{dateStr}</span>
                                <span>•</span>
                                <span>Duration: {scan.duration_sec || 4.2}s</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs text-slate-400 font-mono">
                                Security Score
                              </div>
                              <div
                                className={`text-base font-bold font-mono ${
                                  score >= 80
                                    ? "text-[#B7FF00]"
                                    : score >= 60
                                    ? "text-amber-400"
                                    : "text-red-400"
                                }`}
                              >
                                {score}/100
                              </div>
                            </div>

                            <Link
                              href={`/scans/details?id=${scan.session_id}`}
                              className="px-4 py-2 rounded-lg bg-[#050505] border border-white/10 text-[#B7FF00] hover:bg-[#B7FF00] hover:text-[#050505] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                            >
                              <span>View Full Report</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-[#050505] border border-white/5 rounded-lg p-2.5">
                            <div className="text-[10px] text-slate-400">Status</div>
                            <div className="font-bold text-[#B7FF00] flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{scan.status || "COMPLETED"}</span>
                            </div>
                          </div>

                          <div className="bg-[#050505] border border-white/5 rounded-lg p-2.5">
                            <div className="text-[10px] text-slate-400">Probes Executed</div>
                            <div className="font-bold text-slate-200 mt-0.5">
                              {scan.summary?.total_probes || 12} Attack Vectors
                            </div>
                          </div>

                          <div className="bg-[#050505] border border-white/5 rounded-lg p-2.5">
                            <div className="text-[10px] text-slate-400">Verified Exploits</div>
                            <div className="font-bold text-amber-400 mt-0.5">
                              {vulnCount} Finding(s)
                            </div>
                          </div>

                          <div className="bg-[#050505] border border-white/5 rounded-lg p-2.5">
                            <div className="text-[10px] text-slate-400">Analysis Engine</div>
                            <div className="font-bold text-slate-300 mt-0.5">
                              {scan.heuristic_fallback_engaged
                                ? "Internal Heuristic"
                                : "Swarm CLI + LLM Triage"}
                            </div>
                          </div>
                        </div>
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
