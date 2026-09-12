"use client";

import { ShieldCheck, CheckCircle2, FileCheck2, Cpu, GitBranch, Binary } from "lucide-react";

export interface ValidationStep {
  id: string;
  stepNumber: number;
  title: string;
  toolUsed: string;
  status: "PASSED" | "VERIFIED" | "ZERO_REGRESSIONS";
  resultDetails: string;
  executionTime: string;
}

export const SAMPLE_VALIDATION_STEPS: ValidationStep[] = [
  {
    id: "val-01",
    stepNumber: 1,
    title: "AST Compiler & Syntax Validation",
    toolUsed: "Python AST / Node --check / Java javac",
    status: "PASSED",
    resultDetails: "Parsed AST tree for all patched files. 0 syntax errors, 0 indentation errors.",
    executionTime: "0.4s",
  },
  {
    id: "val-02",
    stepNumber: 2,
    title: "Static Security Engine Re-Scan",
    toolUsed: "Semgrep + Gitleaks + Trivy Swarm",
    status: "PASSED",
    resultDetails: "Re-scanned codebase post-remediation. Zero security alerts or secret leaks flagged.",
    executionTime: "1.2s",
  },
  {
    id: "val-03",
    stepNumber: 3,
    title: "Automated Regression Unit & Integration Tests",
    toolUsed: "pytest & Maven Surefire Test Suite",
    status: "ZERO_REGRESSIONS",
    resultDetails: "Executed full test suite across backend services. 100% tests passed with clean status.",
    executionTime: "2.8s",
  },
  {
    id: "val-04",
    stepNumber: 4,
    title: "API Contract & Schema Compatibility Check",
    toolUsed: "Pydantic & OpenAPI Contract Validator",
    status: "VERIFIED",
    resultDetails: "Verified API request/response schemas; backward compatibility preserved for all routes.",
    executionTime: "0.3s",
  },
  {
    id: "val-05",
    stepNumber: 5,
    title: "Git Branch & Atomic Commit Verification",
    toolUsed: "Git Subsystem",
    status: "PASSED",
    resultDetails: "Created isolated branch `sentinelx/security-patches` with clean atomic security fix commits.",
    executionTime: "0.2s",
  },
];

export default function PatchValidationCard({
  steps = SAMPLE_VALIDATION_STEPS,
}: {
  steps?: ValidationStep[];
}) {
  return (
    <div className="border border-lime/30 bg-[#0D0F0D] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-lime/20 bg-lime-950/20">
        <div className="flex items-center gap-3">
          <FileCheck2 className="w-5 h-5 text-lime" />
          <div>
            <h3 className="font-mono text-xs font-bold text-lime uppercase tracking-widest">
              Patch Validation Pipeline
            </h3>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              Multi-Stage Syntax, Regression & Security Re-Scan Verification
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-lime/10 text-lime border border-lime/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
          All {steps.length} Validation Steps Passed
        </span>
      </div>

      <div className="p-6 space-y-4 font-mono text-xs">
        {steps.map((step) => (
          <div
            key={step.id}
            className="border border-white/10 bg-black/60 rounded-lg p-4 space-y-2 hover:border-lime/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-lime/20 border border-lime/40 text-lime flex items-center justify-center text-[10px] font-bold">
                  {step.stepNumber}
                </span>
                <h4 className="text-fog font-bold text-sm">{step.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px]">{step.executionTime}</span>
                <span className="bg-lime/15 text-lime border border-lime/30 px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-lime" />
                  <span>{step.status}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Binary className="w-3 h-3 text-lime shrink-0" />
              <span className="text-slate-300 font-bold">Tool / Engine:</span>
              <span className="text-lime">{step.toolUsed}</span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
              {step.resultDetails}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
