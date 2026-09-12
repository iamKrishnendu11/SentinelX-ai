"use client";

import { useState, useLayoutEffect, useRef } from "react";
import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import AddProjectModal from "@/components/AddProjectModal";
import { useGitHub } from "@/context/GitHubContext";
import { FolderGit2, Plus, Lock, Trash2, GitBranch, ShieldCheck } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { PrimaryButton, GhostButton, Reveal, Tag } from "@/components/shared";
import Link from "next/link";
import gsap from "gsap";

export default function ProjectsPage() {
  const { githubState, projects, removeProject, connectGitHub } = useGitHub();
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (githubState.connected && projects.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".project-card", {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all"
        });
        
        gsap.from(".page-header", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [githubState.connected, projects.length]);

  return (
    <div className="min-h-screen bg-ink flex text-fog font-sans antialiased">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0" ref={containerRef}>
        <DesktopHeader title="Projects" />

        <main className="flex-1 p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-12">
          {!githubState.connected ? (
            /* STATE 1: Locked when GitHub is NOT connected */
            <Reveal>
              <div className="bg-panel border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 bg-ink border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="max-w-md space-y-2">
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-fog">
                    Projects Locked
                  </h2>
                  <p className="text-sm text-ash font-sans leading-relaxed">
                    Connect GitHub to access your projects. A connected GitHub account is required to import repositories and run local security analysis.
                  </p>
                </div>

                <PrimaryButton onClick={connectGitHub}>
                  <div className="flex items-center gap-2">
                    <GitHubIcon className="w-4 h-4" />
                    CONNECT GITHUB
                  </div>
                </PrimaryButton>
              </div>
            </Reveal>
          ) : (
            /* STATE 2: GitHub Connected - Manage Projects */
            <div className="space-y-10">
              {/* Header Bar */}
              <div className="page-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <Tag>WORKSPACE PROJECTS</Tag>
                  <h2 className="text-4xl font-display font-bold uppercase tracking-tight text-fog mt-4">
                    Repositories <span className="text-lime">Connected</span>
                  </h2>
                  <p className="text-sm text-ash font-sans mt-2">
                    Imported from active GitHub account (@{githubState.username}).
                  </p>
                </div>

                <GhostButton onClick={() => setModalOpen(true)}>
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-lime" />
                    ADD PROJECT
                  </div>
                </GhostButton>
              </div>

              {/* Projects List or Empty State */}
              {projects.length === 0 ? (
                <Reveal>
                  <div className="bg-panel border border-white/10 p-16 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 bg-ink border border-lime/30 flex items-center justify-center text-lime shadow-[0_0_15px_rgba(183,255,0,0.1)]">
                      <FolderGit2 className="w-8 h-8" />
                    </div>

                    <div className="max-w-md space-y-2">
                      <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-fog">
                        No Projects Connected
                      </h3>
                      <p className="text-sm text-ash font-sans">
                        Select a repository from your GitHub account to start securing your code with Sentinel-X.
                      </p>
                    </div>

                    <GhostButton onClick={() => setModalOpen(true)}>
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-lime" />
                        SELECT REPOSITORY
                      </div>
                    </GhostButton>
                  </div>
                </Reveal>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-white/10 border border-white/10">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="project-card bg-panel p-6 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none" />
                      
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-ink border border-white/10 flex items-center justify-center text-lime shrink-0">
                            <FolderGit2 className="w-5 h-5" />
                          </div>
                          <div className="mt-0.5 space-y-1">
                            <h4 className="text-lg font-mono font-bold text-fog uppercase">
                              {project.repositoryName}
                            </h4>
                            <p className="text-xs text-ash font-mono tracking-widest uppercase">
                              {project.owner}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-ink border border-white/10 text-ash shrink-0">
                          {project.private ? "PRIVATE" : "PUBLIC"}
                        </span>
                      </div>

                      <div className="flex-1" />

                      <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-ash p-3 bg-ink border border-white/10">
                          <span className="flex items-center gap-2">
                            <GitBranch className="w-3.5 h-3.5 text-lime" />
                            {project.defaultBranch}
                          </span>

                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            LINKED
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <Link href={`/dashboard/test/${project.id}`} className="flex-1">
                            <PrimaryButton className="w-full justify-center">
                              START TEST
                            </PrimaryButton>
                          </Link>

                          <button
                            onClick={() => removeProject(project.id)}
                            className="p-4 border border-white/10 text-ash hover:text-red-400 hover:border-red-500/30 transition-colors bg-ink shrink-0"
                            title="Remove Project Association"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AddProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
