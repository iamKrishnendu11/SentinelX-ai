"use client";

import { Project } from "@/types/github";
import { Server, GitBranch, ShieldAlert, ArrowLeft } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import Link from "next/link";

export default function WorkspaceHeader({
  project,
  isConnected,
}: {
  project: Project | null;
  isConnected: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-8">
      <div className="flex items-center gap-6">
        <Link 
          href="/dashboard"
          className="p-3 border border-white/20 hover:border-lime hover:text-lime text-fog transition-colors shrink-0"
          title="Exit Workspace"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="space-y-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-fog uppercase leading-none">
            Test <span className="text-ash">Workspace</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-lime">
            SentinelX AI Core Active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {project ? (
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-panel border border-white/10 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <GitHubIcon className="w-4 h-4 text-slate-300" />
              <a href={project.htmlUrl} target="_blank" rel="noreferrer" className="hover:text-lime transition-colors truncate max-w-[200px]">
                {project.repositoryFullName}
              </a>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-slate-300" />
              <span className="truncate max-w-[150px]">{project.defaultBranch}</span>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center px-4 py-2 bg-panel border border-white/10 font-mono text-xs text-slate-500">
            Loading context...
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3 bg-panel border border-white/10">
          <Server className="w-4 h-4 text-ash" />
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
            <span className={isConnected ? "text-lime" : "text-red-500"}>
              {isConnected ? "ONLINE" : "OFFLINE"}
            </span>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-lime shadow-[0_0_8px_rgba(183,255,0,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
