"use client";

import React, { useState } from "react";
import {
  Bot,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Cpu,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useLocalAI } from "@/context/LocalAIContext";

export default function LocalAISetupCard() {
  const { aiStatus, isChecking, checkEnvironment } = useLocalAI();
  const [copied, setCopied] = useState(false);

  const pullCommand = "ollama pull qwen2.5-coder:7b";

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(pullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (aiStatus.ready) {
    return (
      <div className="rounded-xl bg-[#0D0F0D] border border-emerald-500/30 p-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-mono font-bold text-slate-100">
                  AI Engine Ready
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Operational
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Local Ollama engine and <code className="text-[#B7FF00] font-mono">{aiStatus.qwenModel}</code> model verified. Scans & Vulnerabilities unlocked.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-white/10 shrink-0">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Ollama ✓
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Qwen 2.5 Coder 7B ✓
              </span>
            </div>

            <button
              onClick={() => checkEnvironment()}
              disabled={isChecking}
              className="px-3 py-1.5 rounded-lg bg-[#050505] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Re-verify Local AI Environment"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-[#B7FF00]" : ""}`} />
              <span>{isChecking ? "Checking..." : "Re-check"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#0D0F0D] border border-amber-500/30 p-6 space-y-6 shadow-[0_0_25px_rgba(245,158,11,0.05)]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Bot className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-mono font-bold text-slate-100">
                Local AI Environment Setup Required
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                Scans Locked
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Sentinel-X requires a local AI engine before security scans can run. All code analysis remains strictly offline on your machine.
            </p>
          </div>
        </div>

        <button
          onClick={() => checkEnvironment()}
          disabled={isChecking}
          className="px-4 py-2 rounded-lg bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#cfff4d] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(183,255,0,0.2)] shrink-0 self-start md:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
          <span>{isChecking ? "Checking Environment..." : "Check AI Environment"}</span>
        </button>
      </div>

      {/* Component Status Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Ollama Status */}
        <div className={`p-3.5 rounded-lg border font-mono text-xs ${
          aiStatus.ollamaRunning
            ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-300"
            : aiStatus.ollamaInstalled
            ? "bg-amber-500/5 border-amber-500/30 text-amber-300"
            : "bg-red-500/5 border-red-500/30 text-red-300"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-200">Ollama Engine</span>
            {aiStatus.ollamaRunning ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : aiStatus.ollamaInstalled ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            {aiStatus.ollamaRunning
              ? "Running (http://localhost:11434)"
              : aiStatus.ollamaInstalled
              ? "Installed (Not Running)"
              : "Not Installed"}
          </div>
        </div>

        {/* Model Status */}
        <div className={`p-3.5 rounded-lg border font-mono text-xs ${
          aiStatus.qwenInstalled
            ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-300"
            : "bg-amber-500/5 border-amber-500/30 text-amber-300"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-200">Qwen 2.5 Coder 7B</span>
            {aiStatus.qwenInstalled ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            {aiStatus.qwenInstalled ? "Installed locally" : "Model missing"}
          </div>
        </div>

        {/* Usability / Status */}
        <div className={`p-3.5 rounded-lg border font-mono text-xs ${
          aiStatus.ready
            ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-300"
            : "bg-red-500/5 border-red-500/30 text-red-300"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-200">AI Engine Communication</span>
            {aiStatus.ready ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            {aiStatus.qwenUsable ? "Operational" : "Not Usable"}
          </div>
        </div>
      </div>

      {/* Actionable Setup Instructions based on specific missing piece */}
      <div className="bg-[#050505] border border-white/10 rounded-lg p-4 space-y-3">
        {!aiStatus.ollamaInstalled && !aiStatus.ollamaRunning && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-200">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-xs">
                1
              </span>
              <span>Install Ollama</span>
            </div>
            <p className="text-xs text-slate-400 font-sans pl-8">
              Ollama is required to host open-source security models locally on your device without sending code to the cloud.
            </p>
            <div className="pl-8">
              <a
                href="https://ollama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 font-mono text-xs font-medium transition-all"
              >
                <span>Install Ollama</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#B7FF00]" />
              </a>
            </div>
          </div>
        )}

        {aiStatus.ollamaInstalled && !aiStatus.ollamaRunning && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-amber-400">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Ollama is installed but is not currently running.</span>
            </div>
            <p className="text-xs text-slate-400 font-sans pl-7">
              Please start the Ollama application on your computer or run <code className="text-[#B7FF00] font-mono bg-white/5 px-1.5 py-0.5 rounded">ollama serve</code> in your terminal.
            </p>
          </div>
        )}

        {aiStatus.ollamaRunning && !aiStatus.qwenInstalled && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/40 flex items-center justify-center text-xs">
                2
              </span>
              <span>Install Qwen 2.5 Coder 7B</span>
            </div>
            <p className="text-xs text-slate-400 font-sans pl-8">
              Run the following command in your terminal to pull the specialized code security model into local Ollama:
            </p>
            <div className="pl-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-[#090B09] border border-white/10 rounded-lg px-3.5 py-2 font-mono text-xs text-[#B7FF00] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="select-all">{pullCommand}</span>
              </div>
              <button
                onClick={handleCopyCommand}
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {aiStatus.ollamaRunning && aiStatus.qwenInstalled && !aiStatus.qwenUsable && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-red-400">
              <XCircle className="w-5 h-5" />
              <span>Qwen is installed but Sentinel-X could not communicate with it.</span>
            </div>
            <p className="text-xs text-slate-400 font-sans pl-7">
              The model failed the test prompt execution. Ensure Ollama has enough system memory available and try checking again.
            </p>
          </div>
        )}

        {/* Footer Check Again Trigger */}
        <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#B7FF00]" />
            <span>Strict Privacy: Source code is never transmitted outside localhost.</span>
          </div>

          <button
            onClick={() => checkEnvironment()}
            disabled={isChecking}
            className="text-xs text-[#B7FF00] hover:underline font-mono flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
            <span>Check Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
