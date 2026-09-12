"use client";

import { FolderKanban, Plus, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useGitHub } from "@/context/GitHubContext";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { PrimaryButton, GhostButton } from "@/components/shared";

export default function ProjectsSection() {
  const { githubState, projects, connectGitHub } = useGitHub();

  return (
    <section className="h-full flex flex-col p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-ash flex items-center gap-2">
          <span className={`w-1.5 h-1.5 ${githubState.connected ? "bg-lime shadow-[0_0_8px_rgba(183,255,0,0.5)]" : "bg-amber-500"}`} />
          YOUR WORKSPACE
        </h3>
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          {githubState.connected ? `${projects.length} PROJECTS` : "LOCKED"}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {!githubState.connected ? (
          /* State 1: Locked when GitHub is NOT connected */
          <div className="text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-ink border border-white/10 flex items-center justify-center text-amber-500/50">
              <Lock className="w-6 h-6" />
            </div>

            <div className="max-w-sm space-y-2">
              <h4 className="text-xl font-display font-bold uppercase tracking-tight text-fog">
                Workspace Locked
              </h4>
              <p className="text-sm text-ash leading-relaxed">
                Connect GitHub to access your projects and start local security analysis.
              </p>
            </div>

            <PrimaryButton testId="btn-connect-projects" onClick={connectGitHub}>
              <div className="flex items-center gap-2">
                <GitHubIcon className="w-4 h-4" />
                CONNECT GITHUB
              </div>
            </PrimaryButton>
          </div>
        ) : projects.length === 0 ? (
          /* State 2: GitHub Connected but No Projects Added Yet */
          <div className="text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-ink border border-lime/30 flex items-center justify-center text-lime shadow-[0_0_15px_rgba(183,255,0,0.1)]">
              <FolderKanban className="w-6 h-6" />
            </div>

            <div className="max-w-sm space-y-2">
              <h4 className="text-xl font-display font-bold uppercase tracking-tight text-fog">
                No active projects
              </h4>
              <p className="text-sm text-ash leading-relaxed">
                Import a repository from your connected GitHub account (@{githubState.username}).
              </p>
            </div>

            <Link href="/projects">
              <GhostButton testId="btn-add-project-first">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-lime" />
                  ADD PROJECT
                </div>
              </GhostButton>
            </Link>
          </div>
        ) : (
          /* State 3: Active Connected Projects List */
          <div className="flex flex-col gap-px bg-white/10 border border-white/10">
            {projects.map((project) => (
              <div key={project.id} className="bg-ink p-5 flex items-center justify-between hover:bg-panel transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-panel border border-white/10 flex items-center justify-center text-ash group-hover:text-lime group-hover:border-lime/30 transition-colors">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-mono font-bold text-fog flex items-center gap-3 uppercase">
                      <span>{project.repositoryName}</span>
                      <span className="text-[9px] tracking-widest px-2 py-0.5 bg-panel border border-white/10 text-ash">
                        {project.private ? "PRIVATE" : "PUBLIC"}
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">
                      {project.owner} / <span className="text-lime/70">{project.defaultBranch}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/test/${project.id}`}>
                    <PrimaryButton testId={`btn-start-${project.id}`}>
                      START TEST
                    </PrimaryButton>
                  </Link>
                  <Link
                    href={`/projects/${project.id}`}
                    className="p-3 border border-white/10 text-ash hover:text-lime hover:border-lime/30 transition-colors bg-panel"
                    title="View Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
