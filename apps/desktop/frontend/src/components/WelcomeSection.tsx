"use client";

import { Play, Plus, Info } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGitHub } from "@/context/GitHubContext";
import { PrimaryButton, GhostButton, Reveal, Tag } from "@/components/shared";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function WelcomeSection() {
  const { githubState, connectGitHub } = useGitHub();
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (action: string) => {
    setNotice(`${action} functionality will be connected when security engine integrations are initialized.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <section className="relative w-full">
      <Reveal>
        <Tag>{githubState.connected ? "LOCAL SECURITY WORKSPACE" : "AUTHENTICATION REQUIRED"}</Tag>
        <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-6">
          {githubState.connected ? "Welcome to" : "Connect your"}{" "}
          <span className="text-lime">{githubState.connected ? "Sentinel-X" : "GitHub account"}</span>
        </h2>
        <p className="text-ash text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
          {githubState.connected 
            ? "Your autonomous DevSecOps workspace for analyzing, securing, and predicting application vulnerabilities without risking production." 
            : "Connect GitHub to import repositories and start local autonomous security analysis. Your GitHub account is required to access the swarm."}
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {!githubState.connected ? (
            <PrimaryButton testId="btn-connect" onClick={connectGitHub}>
              <div className="flex items-center gap-2">
                <GitHubIcon className="w-4 h-4" />
                CONNECT GITHUB
              </div>
            </PrimaryButton>
          ) : (
            <>
              <PrimaryButton testId="btn-scan" onClick={() => showNotice("Project Scan")}>
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  SCAN PROJECT
                </div>
              </PrimaryButton>

              <Link href="/projects" className="inline-block">
                <GhostButton testId="btn-add">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-lime" />
                    ADD PROJECT
                  </div>
                </GhostButton>
              </Link>
            </>
          )}
        </div>

        {notice && (
          <div className="mt-6 p-4 bg-panel border border-lime/40 text-lime text-xs font-mono tracking-widest uppercase flex items-center gap-3 w-fit animate-fadeIn">
            <Info className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </Reveal>
    </section>
  );
}
