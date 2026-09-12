"use client";

import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import LocalAISetupCard from "@/components/LocalAISetupCard";
import { ShieldAlert, Info, Lock } from "lucide-react";
import { useGitHub } from "@/context/GitHubContext";
import { useLocalAI } from "@/context/LocalAIContext";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function VulnerabilitiesPage() {
  const { githubState, connectGitHub } = useGitHub();
  const { aiStatus } = useLocalAI();

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="Vulnerabilities" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {!githubState.connected ? (
            <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-7 h-7" />
              </div>

              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-mono font-bold text-slate-100">
                  Vulnerabilities Locked
                </h2>
                <p className="text-sm text-slate-400 font-sans">
                  Connect GitHub and run security scans to review detected vulnerabilities.
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
                <span>Vulnerabilities are locked until local AI engine setup is complete.</span>
              </div>
              <LocalAISetupCard />
            </div>
          ) : (
            <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-mono font-bold text-slate-100">
                  Vulnerabilities
                </h2>
                <p className="text-sm text-slate-400 font-sans">
                  Detected security vulnerabilities and patch recommendations will appear here.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050505] border border-white/10 text-xs font-mono text-slate-400">
                <Info className="w-4 h-4 text-[#B7FF00]" />
                <span>Vulnerability database & triage registry standby</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

