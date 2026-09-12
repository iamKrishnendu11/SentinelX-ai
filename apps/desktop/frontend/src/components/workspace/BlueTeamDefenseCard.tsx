"use client";

import { ShieldCheck, CheckCircle2, GitCommit, FileCode } from "lucide-react";

export interface SecurePatchItem {
  id: string;
  vulnTitle: string;
  filePath: string;
  cwe: string;
  originalSnippet: string;
  patchedCode: string;
  syntaxValid: boolean;
  appliedToDisk: boolean;
  diffSummary: string;
}

export const SAMPLE_PATCHES: SecurePatchItem[] = [
  {
    id: "patch-01",
    vulnTitle: "SQL Injection Remediation",
    filePath: "routers/audit.py",
    cwe: "CWE-89",
    originalSnippet: 'query = f"SELECT * FROM audit_logs WHERE repo_url = \'{repo_url}\'"',
    patchedCode: 'query = "SELECT * FROM audit_logs WHERE repo_url = %s"\ncursor.execute(query, (repo_url,)) # Secure Parameterized Binding',
    syntaxValid: true,
    appliedToDisk: true,
    diffSummary: "Applied parameterized query binding placeholder with tuple argument passing.",
  },
  {
    id: "patch-02",
    vulnTitle: "Hardcoded Secret Removal",
    filePath: "services/scanners.py",
    cwe: "CWE-798",
    originalSnippet: 'JWT_SECRET_KEY = "sentinelx_default_jwt_secret_key_minimum_32_bytes"',
    patchedCode: 'JWT_SECRET_KEY = os.getenv("JWT_SECRET") or secrets.token_hex(32) # Secure Environment Variable Resolution',
    syntaxValid: true,
    appliedToDisk: true,
    diffSummary: "Replaced hardcoded token string with environment variable lookup & CSPRNG fallback.",
  },
  {
    id: "patch-03",
    vulnTitle: "Safe Subprocess Command Execution",
    filePath: "services/blue_team_agents.py",
    cwe: "CWE-78",
    originalSnippet: 'os.system(f"git clone --branch {branch} {repo_url} {temp_dir}")',
    patchedCode: 'subprocess.run(["git", "clone", "--branch", branch, repo_url, temp_dir], check=True) # Safe Array Exec',
    syntaxValid: true,
    appliedToDisk: true,
    diffSummary: "Converted shell string execution to safe array argument subprocess invocation.",
  },
];

export default function BlueTeamDefenseCard({
  patches = SAMPLE_PATCHES,
}: {
  patches?: SecurePatchItem[];
}) {
  return (
    <div className="border border-lime/30 bg-[#0D0F0D] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-lime/20 bg-lime-950/20">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-lime" />
          <div>
            <h3 className="font-mono text-xs font-bold text-lime uppercase tracking-widest">
              AI Blue Team Defense & Generated Patches
            </h3>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              Automated Code Generation & Self-Healing Patch Verification
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-lime/10 text-lime border border-lime/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
          {patches.length} Patches Generated & Verified
        </span>
      </div>

      <div className="p-6 space-y-6 font-mono text-xs">
        {patches.map((patch) => (
          <div
            key={patch.id}
            className="border border-white/10 bg-black/60 rounded-lg p-5 space-y-4 hover:border-lime/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-lime/20 text-lime border border-lime/40 px-2 py-0.5 rounded text-[9px] font-bold">
                  {patch.cwe}
                </span>
                <h4 className="text-fog font-bold text-sm">{patch.vulnTitle}</h4>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-lime">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Syntax Valid</span>
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <GitCommit className="w-3.5 h-3.5 text-lime" />
                  <span>Staged to Git</span>
                </span>
              </div>
            </div>

            <p className="text-ash text-[11px] leading-relaxed">{patch.diffSummary}</p>

            {/* Code Comparison Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              {/* Original Vulnerable Snippet */}
              <div className="bg-red-950/20 border border-red-500/20 rounded p-3 text-red-300">
                <div className="flex items-center gap-2 text-red-400 text-[9px] mb-1.5 border-b border-red-500/10 pb-1">
                  <FileCode className="w-3 h-3" />
                  <span>Before (Vulnerable): {patch.filePath}</span>
                </div>
                <code className="block whitespace-pre-wrap">{patch.originalSnippet}</code>
              </div>

              {/* Generated Secure Patch */}
              <div className="bg-lime-950/20 border border-lime/30 rounded p-3 text-lime">
                <div className="flex items-center gap-2 text-lime text-[9px] mb-1.5 border-b border-lime/10 pb-1">
                  <FileCode className="w-3 h-3" />
                  <span>After (Generated Patch): {patch.filePath}</span>
                </div>
                <code className="block whitespace-pre-wrap">{patch.patchedCode}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
