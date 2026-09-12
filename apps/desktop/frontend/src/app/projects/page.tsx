"use client";

import { useState } from "react";
import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import AddProjectModal from "@/components/AddProjectModal";
import { useGitHub } from "@/context/GitHubContext";
import { FolderGit2, Plus, Lock, Trash2, GitBranch, ShieldCheck } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function ProjectsPage() {
  const { githubState, projects, removeProject, connectGitHub } = useGitHub();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="Projects" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {!githubState.connected ? (
            /* STATE 1: Locked when GitHub is NOT connected */
            <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-8 h-8" />
              </div>

              <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-mono font-bold text-slate-100">
                  Projects Locked
                </h2>
                <p className="text-sm text-slate-400 font-sans leading-relaxed">
                  Connect GitHub to access your projects. A connected GitHub account is required to import repositories and run local security analysis.
                </p>
              </div>

              <button
                onClick={connectGitHub}
                className="px-6 py-3 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(183,255,0,0.2)]"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>Connect GitHub</span>
              </button>
            </div>
          ) : (
            /* STATE 2: GitHub Connected - Manage Projects */
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-mono font-bold text-slate-100 flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-[#B7FF00]" />
                    <span>Workspace Projects</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Repositories imported from connected GitHub account (@{githubState.username}).
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.2)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects List or Empty State */}
              {projects.length === 0 ? (
                <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
                    <FolderGit2 className="w-7 h-7" />
                  </div>

                  <div className="max-w-md space-y-2">
                    <h3 className="text-lg font-mono font-bold text-slate-200">
                      No Projects Connected
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      Select a repository from your GitHub account to start securing your code with Sentinel-X.
                    </p>
                  </div>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#B7FF00]/10 hover:bg-[#B7FF00]/20 border border-[#B7FF00]/30 text-[#B7FF00] font-mono text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Select GitHub Repository</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl bg-[#0D0F0D] border border-white/10 hover:border-white/20 p-5 space-y-4 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
                            <FolderGit2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-mono font-bold text-slate-100">
                              {project.repositoryName}
                            </h4>
                            <p className="text-xs text-slate-500 font-mono">
                              {project.owner}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                          {project.private ? "Private" : "Public"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5 text-[#B7FF00]" />
                          {project.defaultBranch}
                        </span>

                        <span className="flex items-center gap-1 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Connected
                        </span>

                        <button
                          onClick={() => removeProject(project.id)}
                          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Remove Project Association"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Project Selection Modal */}
      <AddProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
