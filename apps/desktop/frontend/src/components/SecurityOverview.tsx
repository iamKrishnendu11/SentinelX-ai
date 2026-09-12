"use client";

import { ShieldAlert, Terminal } from "lucide-react";

export default function SecurityOverview() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" />
          Security Overview
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Scan Insights & Health</span>
      </div>

      <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-8 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center text-slate-500">
          <ShieldAlert className="w-6 h-6 text-slate-400" />
        </div>

        <div className="max-w-md space-y-1.5">
          <h4 className="text-base font-mono font-bold text-slate-200">
            No security data yet
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Run your first scan to see vulnerabilities, security findings, and project health here.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#050505] border border-white/10 text-[11px] font-mono text-slate-500">
          <Terminal className="w-3.5 h-3.5 text-[#B7FF00]" />
          <span>Local Engine awaiting scan initiation</span>
        </div>
      </div>
    </section>
  );
}
