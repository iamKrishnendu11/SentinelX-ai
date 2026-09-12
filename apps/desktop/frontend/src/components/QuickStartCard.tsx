"use client";

import { FolderPlus, FileSearch, AlertOctagon, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGitHub } from "@/context/GitHubContext";

export default function QuickStartCard() {
  const { githubState, projects, connectGitHub } = useGitHub();
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${githubState.connected ? "bg-[#B7FF00]" : "bg-slate-500"}`} />
          Quick Start
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Getting Started</span>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-[#050505] border border-amber-500/40 text-amber-300 text-xs font-mono">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Add a Project */}
        <div className="group rounded-xl bg-[#0D0F0D] border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between space-y-4 transition-all hover:bg-white/[0.02]">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00] group-hover:border-[#B7FF00]/40 transition-colors">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-mono font-bold text-slate-200 group-hover:text-[#B7FF00] transition-colors">
                Add a Project
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {githubState.connected
                  ? "Import a repository from your connected GitHub account."
                  : "Connect GitHub to import and analyze repositories."}
              </p>
            </div>
          </div>

          <div>
            {githubState.connected ? (
              <Link
                href="/projects"
                className="w-full py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-[#B7FF00]/10 border border-white/10 hover:border-[#B7FF00]/30 text-slate-200 hover:text-[#B7FF00] text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Add Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={connectGitHub}
                className="w-full py-2 px-3 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/30 text-[#B7FF00] text-xs font-mono font-semibold hover:bg-[#B7FF00]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Connect GitHub</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Run a Security Scan */}
        <div className="group rounded-xl bg-[#0D0F0D] border border-white/10 p-5 flex flex-col justify-between space-y-4 opacity-80">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center text-slate-500">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-mono font-bold text-slate-300">
                Run a Security Scan
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Analyze your project for security vulnerabilities.
              </p>
            </div>
          </div>

          <div>
            {githubState.connected && projects.length > 0 ? (
              <Link
                href="/scans"
                className="w-full py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-[#B7FF00]/10 border border-white/10 hover:border-[#B7FF00]/30 text-slate-200 hover:text-[#B7FF00] text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={() =>
                  showNotice(
                    githubState.connected
                      ? "Add a project to start security scans."
                      : "Connect GitHub and add a project to start security scans."
                  )
                }
                className="w-full py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 text-xs font-mono font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unavailable</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Review Vulnerabilities */}
        <div className="group rounded-xl bg-[#0D0F0D] border border-white/10 p-5 flex flex-col justify-between space-y-4 opacity-80">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center text-slate-500">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-mono font-bold text-slate-300">
                Review Vulnerabilities
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Review detected security issues and understand their impact.
              </p>
            </div>
          </div>

          <div>
            {githubState.connected ? (
              <Link
                href="/vulnerabilities"
                className="w-full py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-[#B7FF00]/10 border border-white/10 hover:border-[#B7FF00]/30 text-slate-200 hover:text-[#B7FF00] text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Vulnerabilities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={() => showNotice("Connect GitHub to access security scan results.")}
                className="w-full py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 text-xs font-mono font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unavailable</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
