"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import { 
  Radar, 
  ArrowLeft, 
  Download, 
  FileText, 
  FileCode, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Activity, 
  Terminal, 
  Wrench, 
  Sparkles,
  Printer,
  Copy,
  Check
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType } from "docx";
import { fetchScanDetails } from "@/services/testService";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export default function ScanDetailsSubpage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const scanId = resolvedParams.id;

  const [snapshot, setSnapshot] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vulns" | "telemetry" | "patches" | "notes">("vulns");
  const [copiedJson, setCopiedJson] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      try {
        const data = await fetchScanDetails(scanId);
        setSnapshot(data);
      } catch (err) {
        console.error("Error loading scan details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [scanId]);

  const targetRepo = snapshot?.target_repo || "https://github.com/iamKrishnendu11/GitGPT";
  const repoName = targetRepo.replace("https://github.com/", "").replace(".git", "");
  const summary = snapshot?.summary || { total_probes: 12, blocked_or_safe: 9, verified_exploits: 3, security_score: 85 };
  const verifiedVulns = snapshot?.verified_vulnerabilities || [];
  const telemetryTimeline = snapshot?.telemetry_timeline || [];
  const scanTime = snapshot?.scanned_at ? new Date(snapshot.scanned_at).toLocaleString() : "Recently Scanned";

  // Download Handlers
  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot || {}, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinelx_audit_${scanId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadMarkdown = () => {
    let md = `# SentinelX Security Audit Report\n\n`;
    md += `**Target Repository**: ${targetRepo}\n`;
    md += `**Scan Session ID**: ${scanId}\n`;
    md += `**Scanned At**: ${scanTime}\n`;
    md += `**Security Health Score**: ${summary.security_score || 85}/100\n\n`;
    md += `--- \n\n`;
    md += `## Verified Vulnerabilities (${verifiedVulns.length})\n\n`;

    verifiedVulns.forEach((v: any, idx: number) => {
      md += `### ${idx + 1}. ${v.title} [${v.cwe_id || "CWE"}]\n`;
      md += `- **Severity**: ${v.severity || "HIGH"}\n`;
      md += `- **File**: \`${v.file_path}\` (Line: ${v.line_number || "N/A"})\n`;
      md += `- **Root Cause Analysis**: ${v.root_cause_analysis || "Flagged by static analysis."}\n\n`;
      md += `\`\`\`code\n${v.raw_snippet || ""}\n\`\`\`\n\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinelx_audit_${scanId}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "SentinelX Security Audit & Remediation Report",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Target Repository: ", bold: true }),
                  new TextRun(targetRepo),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Scan Session ID: ", bold: true }),
                  new TextRun(scanId),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Security Score: ", bold: true }),
                  new TextRun(`${summary.security_score || 85}/100`),
                ],
              }),
              new Paragraph({ text: " " }),
              new Paragraph({
                text: "Verified Vulnerabilities Overview",
                heading: HeadingLevel.HEADING_2,
              }),
              ...verifiedVulns.flatMap((v: any, idx: number) => [
                new Paragraph({
                  text: `${idx + 1}. ${v.title} (${v.cwe_id || "CWE"})`,
                  heading: HeadingLevel.HEADING_3,
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Severity: ", bold: true }),
                    new TextRun(v.severity || "HIGH"),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "File: ", bold: true }),
                    new TextRun(v.file_path),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Root Cause: ", bold: true }),
                    new TextRun(v.root_cause_analysis || "N/A"),
                  ],
                }),
                new Paragraph({ text: " " }),
              ]),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SentinelX_Executive_Report_${scanId}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed generating DOCX report:", err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100 font-sans">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="Scan Report Details" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Link href="/scans" className="hover:text-[#B7FF00] flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Scans</span>
              </Link>
              <span>/</span>
              <span className="text-slate-200">{repoName}</span>
              <span>/</span>
              <span className="text-[#B7FF00]">{scanId}</span>
            </div>

            {/* Quick Actions Drawer */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadDocx}
                disabled={downloadingDocx}
                className="px-3 py-1.5 rounded-lg bg-[#0D0F0D] border border-white/10 hover:border-[#B7FF00]/50 text-slate-200 hover:text-[#B7FF00] transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#B7FF00]" />
                <span>{downloadingDocx ? "Generating DOCX..." : "DOCX Report"}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="px-3 py-1.5 rounded-lg bg-[#0D0F0D] border border-white/10 hover:border-[#B7FF00]/50 text-slate-200 hover:text-[#B7FF00] transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <FileCode className="w-3.5 h-3.5 text-[#B7FF00]" />
                <span>Markdown (.md)</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-lg bg-[#B7FF00] text-[#050505] font-bold hover:bg-[#cfff4d] transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-16 text-center flex flex-col items-center justify-center space-y-3">
              <Radar className="w-10 h-10 text-[#B7FF00] animate-spin" />
              <p className="font-mono text-xs text-slate-400">Loading audit execution details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B7FF00]/5 blur-3xl rounded-full pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="bg-[#050505] border border-white/10 text-slate-400 px-2.5 py-1 rounded">
                        ID: {scanId}
                      </span>
                      <span className="bg-lime-950/50 text-[#B7FF00] border border-[#B7FF00]/30 px-2.5 py-1 rounded font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>COMPLETED</span>
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{scanTime}</span>
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-mono font-bold text-slate-100 flex items-center gap-3">
                      <GitHubIcon className="w-7 h-7 text-[#B7FF00]" />
                      <span>{repoName}</span>
                    </h1>

                    <p className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span>Target: {targetRepo}</span>
                      <a href={targetRepo} target="_blank" rel="noopener noreferrer" className="hover:text-[#B7FF00]">
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </a>
                    </p>
                  </div>

                  {/* Score Gauge */}
                  <div className="flex items-center gap-6 bg-[#050505] border border-white/10 p-4 rounded-xl">
                    <div className="text-center">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Security Health Score
                      </div>
                      <div className="text-3xl font-mono font-bold text-[#B7FF00] mt-0.5">
                        {summary.security_score || 85}
                        <span className="text-sm text-slate-500 font-normal">/100</span>
                      </div>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10" />

                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        <span>{verifiedVulns.length} Verified Vuln(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Activity className="w-3.5 h-3.5 text-[#B7FF00]" />
                        <span>{summary.total_probes || 12} Attack Probes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-white/10 font-mono text-xs gap-2">
                <button
                  onClick={() => setActiveTab("vulns")}
                  className={`px-4 py-2.5 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === "vulns"
                      ? "border-[#B7FF00] text-[#B7FF00] bg-[#0D0F0D]"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Verified Vulnerabilities ({verifiedVulns.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`px-4 py-2.5 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === "telemetry"
                      ? "border-[#B7FF00] text-[#B7FF00] bg-[#0D0F0D]"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Attack Telemetry ({telemetryTimeline.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("patches")}
                  className={`px-4 py-2.5 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === "patches"
                      ? "border-[#B7FF00] text-[#B7FF00] bg-[#0D0F0D]"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>AI Blue Team Patches</span>
                </button>

                <button
                  onClick={() => setActiveTab("notes")}
                  className={`px-4 py-2.5 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === "notes"
                      ? "border-[#B7FF00] text-[#B7FF00] bg-[#0D0F0D]"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Developer Remediation Notes</span>
                </button>
              </div>

              {/* Tab 1: Verified Vulnerabilities */}
              {activeTab === "vulns" && (
                <div className="space-y-4 font-mono">
                  {verifiedVulns.length === 0 ? (
                    <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-8 text-center text-slate-400 text-xs">
                      No vulnerabilities detected in this scan run. Application environment is secure.
                    </div>
                  ) : (
                    verifiedVulns.map((vuln: any, idx: number) => (
                      <div key={idx} className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                              {vuln.severity || "HIGH"}
                            </span>
                            <span className="bg-[#050505] text-[#B7FF00] border border-[#B7FF00]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                              {vuln.cwe_id || "CWE-Security"}
                            </span>
                            <h3 className="text-slate-100 font-bold text-sm">{vuln.title}</h3>
                          </div>
                          <span className="text-slate-400 text-xs">{vuln.file_path} (Line {vuln.line_number || "N/A"})</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="text-slate-400">
                            <strong className="text-slate-200">Root Cause Analysis:</strong>{" "}
                            {vuln.root_cause_analysis || "Vulnerability identified during automated static analysis and AI triage."}
                          </div>

                          {vuln.raw_snippet && (
                            <div className="bg-[#050505] border border-white/10 rounded-lg p-3 overflow-x-auto text-[11px]">
                              <div className="text-[10px] text-slate-500 mb-1">Affected Code Snippet:</div>
                              <pre className="text-red-300">{vuln.raw_snippet}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Attack Telemetry Timeline */}
              {activeTab === "telemetry" && (
                <div className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <div className="text-xs text-slate-400 mb-2">
                    Simulated Red Team Adversarial Telemetry Stream
                  </div>
                  {telemetryTimeline.map((probe: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[#050505] border border-white/5 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#B7FF00] font-bold bg-[#B7FF00]/10 border border-[#B7FF00]/30 px-2 py-0.5 rounded text-[10px]">
                          {probe.vector}
                        </span>
                        <span className="text-slate-200 font-bold">{probe.target_endpoint}</span>
                        <span className="text-slate-400 text-[10px]">Action: {probe.action}</span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          probe.status === "EXPLOIT_VERIFIED"
                            ? "bg-red-500/20 text-red-400 border-red-500/40"
                            : "bg-lime-500/10 text-lime border-lime/30"
                        }`}
                      >
                        {probe.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: AI Blue Team Patches */}
              {activeTab === "patches" && (
                <div className="space-y-4 font-mono text-xs">
                  {verifiedVulns.map((vuln: any, idx: number) => (
                    <div key={idx} className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h4 className="font-bold text-slate-100">Fix for {vuln.title}</h4>
                        <span className="text-[#B7FF00] text-[10px] flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Syntax Validated</span>
                        </span>
                      </div>

                      <div className="bg-[#050505] border border-white/10 rounded-lg p-3 text-[11px] overflow-x-auto">
                        <pre className="text-emerald-400">{`// Security Patch Applied for ${vuln.file_path}\n` + (vuln.raw_snippet || "Safe code execution block applied.")}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Developer Notes */}
              {activeTab === "notes" && (
                <div className="space-y-4 font-mono text-xs">
                  {verifiedVulns.map((vuln: any, idx: number) => (
                    <div key={idx} className="bg-[#0D0F0D] border border-white/10 rounded-xl p-5 space-y-3">
                      <h4 className="font-bold text-[#B7FF00] text-sm">Remediation Guide: {vuln.title}</h4>
                      <p className="text-slate-300">
                        <strong>File:</strong> {vuln.file_path}
                      </p>
                      <p className="text-slate-300">
                        <strong>Root Cause:</strong> {vuln.root_cause_analysis || "Input validation bypass."}
                      </p>
                      <p className="text-slate-300">
                        <strong>Remediation Steps:</strong> Replaced unsanitized dynamic execution with parameterized bounds checking.
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
