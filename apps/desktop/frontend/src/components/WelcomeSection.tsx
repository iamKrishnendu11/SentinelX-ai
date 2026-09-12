"use client";

import { Shield, Play, Plus, Info } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGitHub } from "@/context/GitHubContext";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function WelcomeSection() {
  const { githubState, connectGitHub } = useGitHub();
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (action: string) => {
    setNotice(`${action} functionality will be connected when security engine integrations are initialized.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0D0F0D] via-[#050505] to-[#0D0F0D] border border-white/10 p-6 md:p-8 shadow-xl">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#B7FF00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Connection status pill */}
        {githubState.connected ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/30 text-[#B7FF00] text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Local Security Workspace</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <GitHubIcon className="w-3.5 h-3.5" />
            <span>GitHub Connection Required</span>
          </div>
        )}

        {!githubState.connected ? (
          /* GitHub Not Connected State */
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-display">
              Connect your GitHub account
            </h2>

            <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed max-w-2xl">
              Connect GitHub to add repositories and start securing your code. Your GitHub account is required to add projects to Sentinel-X.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={connectGitHub}
                className="px-6 py-3 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all shadow-[0_0_20px_rgba(183,255,0,0.2)] flex items-center gap-2 cursor-pointer"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>Connect GitHub</span>
              </button>
            </div>
          </>
        ) : (
          /* GitHub Connected State */
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-display">
              Welcome to Sentinel-X
            </h2>

            <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed max-w-2xl">
              Your local security workspace for analyzing, securing, and improving your code.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => showNotice("Project Scan")}
                className="px-5 py-2.5 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold hover:bg-[#cfff4d] transition-all shadow-[0_0_20px_rgba(183,255,0,0.2)] flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Scan a Project</span>
              </button>

              <Link
                href="/projects"
                className="px-5 py-2.5 rounded-lg bg-white/[0.05] border border-white/15 text-slate-200 font-mono text-xs font-semibold hover:bg-white/10 hover:border-white/25 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#B7FF00]" />
                <span>Add Project</span>
              </Link>
            </div>
          </>
        )}

        {/* Action Notice Toast */}
        {notice && (
          <div className="mt-3 p-3 rounded-lg bg-[#050505] border border-[#B7FF00]/40 text-[#B7FF00] text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}
      </div>
    </section>
  );
}
