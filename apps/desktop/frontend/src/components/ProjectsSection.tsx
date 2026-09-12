"use client";

import { FolderKanban, Plus, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useGitHub } from "@/context/GitHubContext";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function ProjectsSection() {
  const { githubState, projects, connectGitHub } = useGitHub();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${githubState.connected ? "bg-[#B7FF00]" : "bg-amber-500"}`} />
          Your Projects
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          {githubState.connected ? `${projects.length} Connected` : "Locked"}
        </span>
      </div>

      {!githubState.connected ? (
        /* State 1: Locked when GitHub is NOT connected */
        <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>

          <div className="max-w-md space-y-1.5">
            <h4 className="text-base font-mono font-bold text-slate-200">
              Projects Locked
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Connect GitHub to access your projects and start local security analysis.
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
      ) : projects.length === 0 ? (
        /* State 2: GitHub Connected but No Projects Added Yet */
        <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
            <FolderKanban className="w-6 h-6" />
          </div>

          <div className="max-w-md space-y-1.5">
            <h4 className="text-base font-mono font-bold text-slate-200">
              No projects added yet
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Import a repository from your connected GitHub account (@{githubState.username}).
            </p>
          </div>

          <Link
            href="/projects"
            className="px-4 py-2 rounded-lg bg-[#B7FF00]/10 hover:bg-[#B7FF00]/20 border border-[#B7FF00]/30 text-[#B7FF00] font-mono text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        </div>
      ) : (
        /* State 3: Active Connected Projects List */
        <div className="rounded-xl bg-[#0D0F0D] border border-white/10 divide-y divide-white/5 overflow-hidden">
          {projects.map((project) => (
            <div key={project.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-mono font-bold text-slate-200 flex items-center gap-2">
                    <span>{project.repositoryName}</span>
                    <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                      {project.private ? "Private" : "Public"}
                    </span>
                  </h5>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {project.owner} / {project.defaultBranch}
                  </p>
                </div>
              </div>

              <Link
                href="/projects"
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#B7FF00] transition-colors"
                title="View Project Details"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
