"use client";

import { ShieldAlert, Terminal } from "lucide-react";

export default function SecurityOverview() {
  return (
    <section className="h-full flex flex-col p-6 md:p-8 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-ash flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-lime" />
          SECURITY OVERVIEW
        </h3>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          INSIGHTS & HEALTH
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
        <div className="w-16 h-16 bg-ink border border-white/10 flex items-center justify-center text-slate-500 shadow-xl group-hover:border-lime/20 group-hover:text-lime transition-colors">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="max-w-xs space-y-2">
          <h4 className="text-xl font-display font-bold uppercase tracking-tight text-fog">
            No security data yet
          </h4>
          <p className="text-sm text-ash leading-relaxed">
            Run your first scan to see vulnerabilities, security findings, and project health here.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-3 bg-ink border border-white/10 text-[10px] font-mono tracking-widest text-slate-400 mt-2">
          <Terminal className="w-4 h-4 text-lime" />
          <span className="uppercase">ENGINE AWAITING SCAN</span>
        </div>
      </div>
    </section>
  );
}
