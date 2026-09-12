"use client";

import { useGitHub } from "@/context/GitHubContext";
import { Loader2, Unlink } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { PrimaryButton, GhostButton } from "@/components/shared";

export default function GitHubConnectionCard() {
  const { githubState, isConnecting, connectGitHub, disconnectGitHub, clearError } = useGitHub();

  const handleConnect = async () => {
    if (githubState.status === "error") {
      clearError();
    }
    await connectGitHub();
  };

  return (
    <section className="h-full flex flex-col justify-center p-6 md:p-8 relative overflow-hidden transition-colors hover:bg-white/[0.02]">
      {/* Glow highlight based on state */}
      {githubState.connected ? (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-lime/5 rounded-full blur-3xl pointer-events-none" />
      ) : githubState.status === "error" ? (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      ) : null}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          {/* GitHub Icon Badge */}
          <div
            className={`w-12 h-12 bg-ink border flex items-center justify-center shrink-0 transition-colors ${
              githubState.connected
                ? "border-lime/40 text-lime"
                : githubState.status === "error"
                ? "border-red-500/40 text-red-400"
                : "border-white/10 text-ash"
            }`}
          >
            {isConnecting || githubState.status === "connecting" ? (
              <Loader2 className="w-5 h-5 animate-spin text-lime" />
            ) : (
              <GitHubIcon className="w-5 h-5" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-1.5 mt-0.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
              <h3 className="text-[10px] font-mono tracking-[0.25em] uppercase text-fog">
                GITHUB CONNECTION
              </h3>

              {/* Connection Status Badge */}
              {isConnecting || githubState.status === "connecting" ? (
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 tracking-widest">
                  <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
                  CONNECTING
                </span>
              ) : githubState.connected ? (
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-lime/10 text-lime border border-lime/30 flex items-center gap-1.5 tracking-widest">
                  <span className="w-1.5 h-1.5 bg-lime shadow-[0_0_8px_#B7FF00]" />
                  CONNECTED
                </span>
              ) : githubState.status === "error" ? (
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5 tracking-widest">
                  <span className="w-1.5 h-1.5 bg-red-400" />
                  ERROR
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-white/5 text-ash border border-white/10 flex items-center gap-1.5 tracking-widest">
                  <span className="w-1.5 h-1.5 bg-slate-500" />
                  OFFLINE
                </span>
              )}
            </div>

            {/* Description or Username */}
            {githubState.connected ? (
              <div className="flex items-center gap-2">
                {githubState.username && (
                  <span className="text-sm font-mono text-lime font-bold">
                    @{githubState.username}
                  </span>
                )}
                <span className="text-sm text-ash font-sans">
                  — Active workspace link.
                </span>
              </div>
            ) : githubState.status === "error" ? (
              <p className="text-sm text-red-400/80 font-sans leading-relaxed">
                {githubState.errorMessage || "Unable to connect GitHub."}
              </p>
            ) : (
              <p className="text-sm text-ash font-sans leading-relaxed">
                Connect your account to import repositories.
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          {githubState.connected ? (
            <button
              onClick={disconnectGitHub}
              className="w-full sm:w-auto px-4 py-2 bg-transparent hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-ash hover:text-red-400 text-[10px] tracking-widest uppercase font-mono font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>DISCONNECT</span>
            </button>
          ) : githubState.status === "error" ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full sm:w-auto px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-[10px] tracking-widest font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>RETRY</span>
            </button>
          ) : (
            <PrimaryButton onClick={handleConnect} disabled={isConnecting}>
              <div className="flex items-center gap-2">
                <GitHubIcon className="w-4 h-4" />
                {isConnecting ? "CONNECTING..." : "CONNECT GITHUB"}
              </div>
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  );
}
