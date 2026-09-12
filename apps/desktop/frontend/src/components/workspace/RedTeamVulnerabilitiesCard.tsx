"use client";

import { ShieldAlert, AlertTriangle, Code2 } from "lucide-react";

export interface VulnerabilityItem {
  id: string;
  title: string;
  cwe: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  filePath: string;
  line: number;
  snippet: string;
  vector: string;
}

export const SAMPLE_VULNERABILITIES: VulnerabilityItem[] = [
  {
    id: "vuln-01",
    title: "SQL Injection in Repository Audit Query",
    cwe: "CWE-89",
    severity: "CRITICAL",
    filePath: "routers/audit.py",
    line: 42,
    snippet: 'query = f"SELECT * FROM audit_logs WHERE repo_url = \'{repo_url}\'"',
    vector: "EXPLOIT_VERIFIED: Parameter fuzzing payload ' OR 1=1 -- bypassed database sanitization.",
  },
  {
    id: "vuln-02",
    title: "Hardcoded HMAC Secret Key",
    cwe: "CWE-798",
    severity: "HIGH",
    filePath: "services/scanners.py",
    line: 18,
    snippet: 'JWT_SECRET_KEY = "sentinelx_default_jwt_secret_key_minimum_32_bytes"',
    vector: "EXPLOIT_VERIFIED: Hardcoded secret pattern identified in source repository.",
  },
  {
    id: "vuln-03",
    title: "Unsafe Command Execution in Subprocess",
    cwe: "CWE-78",
    severity: "HIGH",
    filePath: "services/blue_team_agents.py",
    line: 88,
    snippet: 'os.system(f"git clone --branch {branch} {repo_url} {temp_dir}")',
    vector: "EXPLOIT_VERIFIED: Unsanitized shell argument execution allowed shell command injection.",
  },
];

export default function RedTeamVulnerabilitiesCard({
  vulnerabilities = SAMPLE_VULNERABILITIES,
}: {
  vulnerabilities?: VulnerabilityItem[];
}) {
  return (
    <div className="border border-red-500/30 bg-[#0D0F0D] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/20 bg-red-950/20">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-[#FF5F56]" />
          <div>
            <h3 className="font-mono text-xs font-bold text-[#FF5F56] uppercase tracking-widest">
              Red Team Vulnerability Findings
            </h3>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              Target Attack Surface Probes & Verified Exploits
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-[#FF5F56]/10 text-[#FF5F56] border border-[#FF5F56]/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
          {vulnerabilities.length} Detected Vulnerabilities
        </span>
      </div>

      <div className="p-6 space-y-4 font-mono text-xs">
        {vulnerabilities.map((vuln) => {
          const isCritical = vuln.severity === "CRITICAL";
          const badgeStyle = isCritical
            ? "bg-red-500/20 text-red-400 border-red-500/40"
            : "bg-amber-500/20 text-amber-400 border-amber-500/40";

          return (
            <div
              key={vuln.id}
              className="border border-white/10 bg-black/60 rounded-lg p-4 space-y-3 hover:border-red-500/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 border rounded text-[9px] font-bold tracking-wider ${badgeStyle}`}>
                    {vuln.severity}
                  </span>
                  <span className="bg-white/10 text-slate-300 px-2 py-0.5 rounded text-[9px]">
                    {vuln.cwe}
                  </span>
                  <h4 className="text-fog font-bold text-sm">{vuln.title}</h4>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0">
                  {vuln.filePath}:{vuln.line}
                </span>
              </div>

              {/* Vulnerable Snippet */}
              <div className="bg-[#050505] border border-white/10 rounded p-3 text-[11px] text-red-300 font-mono overflow-x-auto">
                <div className="flex items-center gap-2 text-slate-500 text-[9px] mb-1.5 border-b border-white/5 pb-1">
                  <Code2 className="w-3 h-3 text-red-400" />
                  <span>Vulnerable Source Snippet</span>
                </div>
                <code>{vuln.snippet}</code>
              </div>

              {/* Vector Details */}
              <div className="flex items-center gap-2 text-[10px] text-red-400/90 bg-red-500/5 border border-red-500/10 px-3 py-1.5 rounded">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#FF5F56]" />
                <span>{vuln.vector}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
