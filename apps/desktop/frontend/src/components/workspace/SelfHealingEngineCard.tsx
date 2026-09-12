"use client";

import { Wrench, Sparkles, Binary, CheckCircle2, Cpu } from "lucide-react";

export default function SelfHealingEngineCard() {
  const healingLogs = [
    {
      stage: "AST Synthesizer",
      target: "routers/audit.py",
      message: "Refactored dynamic SQL string interpolation into parameterized SQL query binding tuples (%s).",
      status: "AST_PARSED",
    },
    {
      stage: "Environment Resolver",
      target: "services/scanners.py",
      message: "Replaced hardcoded HMAC key string literal with OS environment variable lookup (os.getenv).",
      status: "SECRET_REMOVED",
    },
    {
      stage: "Subprocess Guardrail",
      target: "services/blue_team_agents.py",
      message: "Replaced os.system shell execution with array argument subprocess.run invocation.",
      status: "SHELL_NEUTRALIZED",
    },
    {
      stage: "Syntactic Integrity",
      target: "Modified Source Files",
      message: "Verified 100% generated secure patches conform strictly to target language AST rules.",
      status: "VALIDATED",
    },
  ];

  return (
    <div className="border border-lime/30 bg-[#0D0F0D] rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between px-6 py-4 border-b border-lime/20 bg-lime-950/20">
        <div className="flex items-center gap-3">
          <Wrench className="w-5 h-5 text-lime" />
          <div>
            <h3 className="font-mono text-xs font-bold text-lime uppercase tracking-widest">
              Autonomous Self-Healing Engine Execution
            </h3>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              AST Code Patch Generation & Algorithmic Guardrail Synthesis
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-lime/10 text-lime border border-lime/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-lime" />
          <span>Self-Healing Complete</span>
        </span>
      </div>

      <div className="p-6 space-y-4">
        {healingLogs.map((log, idx) => (
          <div
            key={idx}
            className="border border-white/10 bg-black/60 rounded-lg p-4 space-y-2 hover:border-lime/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-lime/20 border border-lime/40 text-lime flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <h4 className="text-fog font-bold text-sm">{log.stage}</h4>
              </div>
              <span className="bg-lime/20 text-lime border border-lime/40 px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider">
                {log.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Cpu className="w-3 h-3 text-lime shrink-0" />
              <span className="text-slate-300 font-bold">File Target:</span>
              <span className="text-lime">{log.target}</span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
