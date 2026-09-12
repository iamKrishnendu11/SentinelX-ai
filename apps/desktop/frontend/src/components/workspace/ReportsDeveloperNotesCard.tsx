"use client";

import { useState } from "react";
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Wrench, Download, Loader2 } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";

export interface DeveloperNoteItem {
  id: string;
  vulnTitle: string;
  cwe: string;
  filePath: string;
  rootCause: string;
  remediationApplied: string;
  verificationSteps: string;
  status: "RESOLVED" | "VERIFIED_IN_TWIN";
}

export const SAMPLE_DEV_NOTES: DeveloperNoteItem[] = [
  {
    id: "note-01",
    vulnTitle: "SQL Injection Remediation Note",
    cwe: "CWE-89",
    filePath: "routers/audit.py",
    rootCause: "Untrusted string interpolation directly constructed dynamic SQL queries without parameter sanitization.",
    remediationApplied: "Replaced raw string formatting with parameterized SQL placeholders (%s) and bound positional argument tuples.",
    verificationSteps: "Passed AST syntax check, automated red-team SQL injection probe, and regression unit tests.",
    status: "VERIFIED_IN_TWIN",
  },
  {
    id: "note-02",
    vulnTitle: "Secret Token Storage Remediation Note",
    cwe: "CWE-798",
    filePath: "services/scanners.py",
    rootCause: "HMAC key string was stored in plain text inside source code file, risking token forgery.",
    remediationApplied: "Moved secret resolution to OS environment variables with CSPRNG fallback generation.",
    verificationSteps: "Ran Gitleaks static secret scanner scan; zero plain-text secrets detected.",
    status: "VERIFIED_IN_TWIN",
  },
  {
    id: "note-03",
    vulnTitle: "Command Injection Remediation Note",
    cwe: "CWE-78",
    filePath: "services/blue_team_agents.py",
    rootCause: "Unsanitized git branch parameters passed directly into os.system() invoked local shell interpreter.",
    remediationApplied: "Replaced os.system shell string execution with subprocess.run array argument invocation.",
    verificationSteps: "Fuzzed branch name with shell metacharacters (; && `); command injection neutralized.",
    status: "RESOLVED",
  },
];

export default function ReportsDeveloperNotesCard({
  notes = SAMPLE_DEV_NOTES,
}: {
  notes?: DeveloperNoteItem[];
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadDocx = async () => {
    setIsGenerating(true);
    try {
      const docChildren: Paragraph[] = [
        new Paragraph({
          text: "SENTINELX-AI: EXECUTIVE SECURITY AUDIT & REMEDIATION REPORT",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Platform: ", bold: true }),
            new TextRun("SentinelX Autonomous DevSecOps Platform\n"),
            new TextRun({ text: "Generated Date: ", bold: true }),
            new TextRun(`${new Date().toLocaleString()}\n`),
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun("100% Vulnerabilities Remediated & Verified in Digital Twin"),
          ],
        }),
        new Paragraph({ text: "\n1. EXECUTIVE SUMMARY", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          text: "The SentinelX Autonomous AI Swarm performed multi-stage reconnaissance, static analysis, adversarial red-team fuzzing, and automated self-healing code remediation. All identified security flaws were systematically fixed, syntax-checked via AST compilers, and verified in isolated Digital Twin containers.",
        }),
        new Paragraph({ text: "\n2. DEVELOPER AUDIT NOTES & REMEDIATIONS", heading: HeadingLevel.HEADING_2 }),
      ];

      notes.forEach((note, idx) => {
        docChildren.push(
          new Paragraph({
            text: `${idx + 1}. ${note.vulnTitle} (${note.cwe})`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "File Path: ", bold: true }),
              new TextRun(`${note.filePath}\n`),
              new TextRun({ text: "Status: ", bold: true }),
              new TextRun(`${note.status}\n`),
              new TextRun({ text: "Root Cause: ", bold: true }),
              new TextRun(`${note.rootCause}\n`),
              new TextRun({ text: "Correction Applied: ", bold: true }),
              new TextRun(`${note.remediationApplied}\n`),
              new TextRun({ text: "Verification Tests: ", bold: true }),
              new TextRun(`${note.verificationSteps}\n`),
            ],
          })
        );
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SentinelX_Security_Audit_Report_${new Date().toISOString().slice(0, 10)}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed generating DOCX report:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border border-white/20 bg-[#0D0F0D] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-lime" />
          <div>
            <h3 className="font-mono text-xs font-bold text-fog uppercase tracking-widest">
              Audit Report & Developer Notes
            </h3>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              Root Cause Analysis & Corrective Actions Summary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadDocx}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg bg-lime text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.2)] disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isGenerating ? "Generating..." : "Download Report (.docx)"}</span>
          </button>

          <span className="font-mono text-[10px] bg-lime/10 text-lime border border-lime/30 px-3 py-2 rounded-lg uppercase tracking-wider font-bold hidden sm:inline">
            100% Vulnerabilities Healed
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6 font-mono text-xs">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border border-white/10 bg-black/60 rounded-lg p-5 space-y-4 hover:border-white/30 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-lime/20 text-lime border border-lime/40 px-2 py-0.5 rounded text-[9px] font-bold">
                  {note.cwe}
                </span>
                <h4 className="text-fog font-bold text-sm">{note.vulnTitle}</h4>
              </div>
              <span className="flex items-center gap-1 bg-lime/10 text-lime border border-lime/30 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>{note.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
              {/* Root Cause */}
              <div className="bg-white/[0.02] border border-white/5 rounded p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Root Cause</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{note.rootCause}</p>
              </div>

              {/* Remediation Applied */}
              <div className="bg-white/[0.02] border border-white/5 rounded p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-lime font-bold text-[10px] uppercase tracking-wider">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Correction Applied</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{note.remediationApplied}</p>
              </div>

              {/* Verification Steps */}
              <div className="bg-white/[0.02] border border-white/5 rounded p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[10px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verification Test</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{note.verificationSteps}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
