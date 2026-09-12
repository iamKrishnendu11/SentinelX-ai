"use client";

import { Play, Square, Loader2, AlertTriangle } from "lucide-react";
import { TestSession } from "@/services/testService";

export default function MachineControl({
  session,
  isStarting,
  error,
  onStart,
}: {
  session: TestSession | null;
  isStarting: boolean;
  error: string | null;
  onStart: () => void;
}) {
  const isRunning = session?.status === "RUNNING";

  return (
    <div className="border border-white/10 bg-[#0D0F0D] rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-sm font-bold text-[#F5F5F0]">Machine Configuration</h2>
          <p className="font-sans text-xs text-slate-400 mt-1">
            Provisions a secure Digital Twin sandbox before attacking.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {error && (
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-400/10 px-3 py-1.5 rounded border border-red-400/20">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[250px]">{error}</span>
            </div>
          )}

          <button
            onClick={onStart}
            disabled={isStarting || isRunning}
            className="px-6 py-2.5 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#cfff4d] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.2)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isStarting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRunning ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>
              {isStarting ? "Starting..." : isRunning ? "Running" : "Start Machine"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
