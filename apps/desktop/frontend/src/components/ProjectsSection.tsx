"use client";

import { FolderKanban, Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" />
          Your Projects
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Workspace Repositories</span>
      </div>

      <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-8 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center text-slate-500">
          <FolderKanban className="w-6 h-6 text-slate-400" />
        </div>

        <div className="max-w-md space-y-1.5">
          <h4 className="text-base font-mono font-bold text-slate-200">
            No projects yet
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Add a local project to start securing your code with Sentinel-X.
          </p>
        </div>

        <Link
          href="/projects"
          className="px-4 py-2 rounded-lg bg-[#B7FF00]/10 hover:bg-[#B7FF00]/20 border border-[#B7FF00]/30 text-[#B7FF00] font-mono text-xs font-semibold transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your First Project</span>
        </Link>
      </div>
    </section>
  );
}
