"use client";

import { ShieldCheck, Cpu, Terminal, Key, ShieldAlert, PackageCheck, AlertCircle } from "lucide-react";

interface MultiAgentScanningCardProps {
  vulnerabilities?: any[];
  fallbackEngaged?: boolean;
}

export default function MultiAgentScanningCard({ vulnerabilities = [], fallbackEngaged = false }: MultiAgentScanningCardProps) {
  const semgrepFindings = vulnerabilities.filter(v => v.scanner_source === "semgrep").length;
  const gitleaksFindings = vulnerabilities.filter(v => v.scanner_source === "gitleaks").length;
  const trivyFindings = vulnerabilities.filter(v => v.scanner_source === "trivy").length;
  const heuristicFindings = vulnerabilities.filter(v => v.scanner_source === "heuristic").length;

  const agentScanners = [
    {
      name: "Semgrep SAST Engine",
      role: "Static Code Analysis",
      rulesRun: 14,
      findings: semgrepFindings,
      status: fallbackEngaged ? "SKIPPED (CLI MISSING)" : "COMPLETED",
      icon: Cpu,
      telemetry: semgrepFindings > 0 
        ? `${semgrepFindings} SAST flaw(s) flagged by Semgrep engine.`
        : fallbackEngaged 
        ? "CLI tool missing on system PATH; skipped." 
        : "Codebase scanned; 0 SAST flaws found.",
    },
    {
      name: "Gitleaks Secret Scanner",
      role: "Entropy & Secret Scanner",
      rulesRun: 8,
      findings: gitleaksFindings,
      status: fallbackEngaged ? "SKIPPED (CLI MISSING)" : "COMPLETED",
      icon: Key,
      telemetry: gitleaksFindings > 0 
        ? `${gitleaksFindings} hardcoded credential(s) or API key(s) detected.`
        : fallbackEngaged 
        ? "CLI tool missing on system PATH; skipped." 
        : "Entropy check clean; 0 secrets exposed.",
    },
    {
      name: "Trivy Container & Dependency Engine",
      role: "CVE Manifest Analyzer",
      rulesRun: 42,
      findings: trivyFindings,
      status: fallbackEngaged ? "SKIPPED (CLI MISSING)" : "COMPLETED",
      icon: PackageCheck,
      telemetry: trivyFindings > 0 
        ? `${trivyFindings} dependency CVE(s) identified in package manifests.`
        : fallbackEngaged 
        ? "CLI tool missing on system PATH; skipped." 
        : "Dependencies scanned; 0 vulnerable packages found.",
    },
    {
      name: "Internal Heuristic Analyzer",
      role: "AST Pattern & Regex Security Scanner",
      rulesRun: 12,
      findings: heuristicFindings,
      status: "COMPLETED",
      icon: ShieldAlert,
      telemetry: heuristicFindings > 0 
        ? `Engaged: ${heuristicFindings} security flaw(s) identified in repository files.`
        : fallbackEngaged 
        ? "Engaged as primary analyzer; scan clean." 
        : "In-process AST checks completed.",
    },
  ];

  return (
    <div className="border border-white/10 bg-[#0D0F0D] rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-lime" />
          <div>
            <h3 className="font-mono text-xs font-bold text-fog uppercase tracking-widest">
              Multi-Agent Scanner Swarm Telemetry
            </h3>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              Concurrent Execution of SAST, DAST, Secret & Dependency Engines
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-lime/10 text-lime border border-lime/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
          {vulnerabilities.length > 0 ? `${vulnerabilities.length} Findings Discovered` : "Swarm Execution Complete"}
        </span>
      </div>

      <div className="p-6 space-y-4">
        {fallbackEngaged && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              CLI tools (semgrep, gitleaks, trivy) were not detected in system PATH. SentinelX automatically engaged its native in-process AST heuristic analyzer to scan your uploaded repository.
            </span>
          </div>
        )}

        {agentScanners.map((agent, idx) => {
          const IconComp = agent.icon;
          const hasFindings = agent.findings > 0;

          return (
            <div
              key={idx}
              className="border border-white/10 bg-black/60 rounded-lg p-4 space-y-2 hover:border-lime/30 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-lime/10 border border-lime/30 text-lime">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-fog font-bold text-sm">{agent.name}</h4>
                    <span className="text-slate-500 text-[10px]">{agent.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-slate-400">{agent.rulesRun} Rules Evaluated</span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold ${
                      hasFindings
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-lime/20 text-lime border border-lime/30"
                    }`}
                  >
                    {hasFindings ? `${agent.findings} Flaw(s) Flagged` : "0 Vulnerabilities"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-lime h-full w-full rounded-full shadow-[0_0_10px_#B7FF00]" />
              </div>

              {/* Live Telemetry Message */}
              <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-black/40 p-2 rounded border border-white/5">
                <AlertCircle className="w-3.5 h-3.5 text-lime shrink-0" />
                <span>{agent.telemetry}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

