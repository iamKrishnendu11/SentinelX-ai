"use client";

import { useGitHub } from "@/context/GitHubContext";
import { Loader2, Unlink } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function GitHubConnectionCard() {
  const { githubState, isConnecting, connectGitHub, disconnectGitHub, clearError } = useGitHub();

  const handleConnect = async () => {
    if (githubState.status === "error") {
      clearError();
    }
    await connectGitHub();
  };

  return (
    <section className="rounded-xl bg-[#0D0F0D] border border-white/10 p-5 md:p-6 shadow-xl relative overflow-hidden transition-all hover:border-white/15">
      {/* Glow highlight based on state */}
      {githubState.connected ? (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#B7FF00]/5 rounded-full blur-3xl pointer-events-none" />
      ) : githubState.status === "error" ? (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      ) : null}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* GitHub Icon Badge */}
          <div
            className={`w-11 h-11 rounded-xl bg-[#050505] border flex items-center justify-center shrink-0 transition-colors ${
              githubState.connected
                ? "border-[#B7FF00]/40 text-[#B7FF00]"
                : githubState.status === "error"
                ? "border-rose-500/40 text-rose-400"
                : "border-white/10 text-slate-300"
            }`}
          >
            {isConnecting || githubState.status === "connecting" ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#B7FF00]" />
            ) : (
              <GitHubIcon className="w-5 h-5" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-mono font-bold text-slate-100">
                GitHub Connection
              </h3>

              {/* Connection Status Badge */}
              {isConnecting || githubState.status === "connecting" ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Connecting...
                </span>
              ) : githubState.connected ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00] shadow-[0_0_8px_#B7FF00]" />
                  Connected
                </span>
              ) : githubState.status === "error" ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Unable to Connect
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-400 border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  Not Connected
                </span>
              )}
            </div>

            {/* Description or Username */}
            {githubState.connected ? (
              <div className="flex items-center gap-2">
                {githubState.username && (
                  <span className="text-xs font-mono text-[#B7FF00] font-semibold">
                    @{githubState.username}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-sans">
                  — Active GitHub workspace connection ready for importing projects.
                </span>
              </div>
            ) : githubState.status === "error" ? (
              <p className="text-xs text-rose-300/90 font-sans leading-relaxed">
                {githubState.errorMessage || "Unable to connect GitHub. Please try again."}
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Connect one GitHub account to import repositories into your Sentinel-X workspace.
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          {githubState.connected ? (
            <button
              onClick={disconnectGitHub}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-rose-950/40 border border-white/15 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Disconnect GitHub</span>
            </button>
          ) : githubState.status === "error" ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-mono font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#B7FF00] text-[#050505] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all shadow-[0_0_20px_rgba(183,255,0,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect GitHub"}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
