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
import { PrimaryButton, GhostButton } from "@/components/shared";

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
      <div className="h-full flex flex-col justify-center p-6 md:p-8 bg-panel group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-emerald-500/[0.03] to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-ink border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 mt-0.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                <h3 className="text-[10px] font-mono tracking-[0.25em] uppercase text-fog">
                  AI ENGINE STATUS
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  OPERATIONAL
                </span>
              </div>
              <p className="text-sm text-ash font-sans mt-1">
                Local Ollama engine and <code className="text-lime font-mono">{aiStatus.qwenModel}</code> verified.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                OLLAMA ✓
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                QWEN 7B ✓
              </span>
            </div>

            <button
              onClick={() => checkEnvironment()}
              disabled={isChecking}
              className="p-3 border border-white/10 text-ash hover:text-white hover:border-white/30 transition-colors bg-ink disabled:opacity-50"
              title="Re-verify Environment"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin text-lime" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 md:p-8 bg-panel relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
      <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-amber-500/[0.03] to-transparent pointer-events-none" />
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 relative z-10">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-ink border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Bot className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 mt-0.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
              <h3 className="text-[10px] font-mono tracking-[0.25em] uppercase text-fog">
                AI ENVIRONMENT SETUP
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/40 flex items-center gap-1 tracking-widest">
                <Lock className="w-2.5 h-2.5" />
                SCANS LOCKED
              </span>
            </div>
            <p className="text-sm text-ash font-sans mt-1">
              Sentinel-X requires a local AI engine. Code analysis remains strictly offline.
            </p>
          </div>
        </div>

        <PrimaryButton
          onClick={() => checkEnvironment()}
          disabled={isChecking}
          className="shrink-0"
        >
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "CHECKING..." : "CHECK AI"}
          </div>
        </PrimaryButton>
      </div>

      {/* Component Status Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-6">
        {/* Ollama Status */}
        <div className={`p-4 font-mono text-[10px] tracking-widest uppercase ${
          aiStatus.ollamaRunning
            ? "bg-emerald-500/10 text-emerald-300"
            : aiStatus.ollamaInstalled
            ? "bg-amber-500/10 text-amber-300"
            : "bg-red-500/10 text-red-300"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-fog">OLLAMA ENGINE</span>
            {aiStatus.ollamaRunning ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : aiStatus.ollamaInstalled ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-[9px] text-ash tracking-widest">
            {aiStatus.ollamaRunning
              ? "RUNNING (PORT:11434)"
              : aiStatus.ollamaInstalled
              ? "INSTALLED (NOT RUNNING)"
              : "NOT INSTALLED"}
          </div>
        </div>

        {/* Model Status */}
        <div className={`p-4 font-mono text-[10px] tracking-widest uppercase ${
          aiStatus.qwenInstalled
            ? "bg-emerald-500/10 text-emerald-300"
            : "bg-amber-500/10 text-amber-300"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-fog">QWEN 7B CODER</span>
            {aiStatus.qwenInstalled ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-[9px] text-ash tracking-widest">
            {aiStatus.qwenInstalled ? "INSTALLED LOCALLY" : "MODEL MISSING"}
          </div>
        </div>

        {/* Usability / Status */}
        <div className={`p-4 font-mono text-[10px] tracking-widest uppercase ${
          aiStatus.ready
            ? "bg-emerald-500/10 text-emerald-300"
            : "bg-red-500/10 text-red-300"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-fog">API LINK</span>
            {aiStatus.ready ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-[9px] text-ash tracking-widest">
            {aiStatus.qwenUsable ? "OPERATIONAL" : "NOT USABLE"}
          </div>
        </div>
      </div>

      {/* Actionable Setup Instructions based on specific missing piece */}
      <div className="bg-ink border border-white/10 p-5 mt-6 space-y-4">
        {!aiStatus.ollamaInstalled && !aiStatus.ollamaRunning && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-fog uppercase tracking-widest">
              <span className="w-6 h-6 bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                1
              </span>
              <span>Install Ollama</span>
            </div>
            <p className="text-sm text-ash font-sans pl-9">
              Ollama is required to host open-source security models locally on your device without sending code to the cloud.
            </p>
            <div className="pl-9">
              <GhostButton href="https://ollama.com" testId="btn-install-ollama">
                INSTALL OLLAMA <ExternalLink className="w-3.5 h-3.5 text-lime" />
              </GhostButton>
            </div>
          </div>
        )}

        {aiStatus.ollamaInstalled && !aiStatus.ollamaRunning && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Ollama is installed but not running.</span>
            </div>
            <p className="text-sm text-ash font-sans pl-8">
              Please start the Ollama application on your computer or run <code className="text-lime font-mono bg-white/5 px-2 py-1">ollama serve</code> in your terminal.
            </p>
          </div>
        )}

        {aiStatus.ollamaRunning && !aiStatus.qwenInstalled && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-fog uppercase tracking-widest">
              <span className="w-6 h-6 bg-lime/20 text-lime border border-lime/40 flex items-center justify-center">
                2
              </span>
              <span>Install Qwen 2.5 Coder 7B</span>
            </div>
            <p className="text-sm text-ash font-sans pl-9">
              Run the following command in your terminal to pull the specialized code security model into local Ollama:
            </p>
            <div className="pl-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-panel border border-white/10 px-4 py-3 font-mono text-sm text-lime flex items-center gap-3">
                <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="select-all">{pullCommand}</span>
              </div>
              <button
                onClick={handleCopyCommand}
                className="px-5 py-3 border border-white/10 text-fog font-mono text-[10px] tracking-widest uppercase hover:border-lime hover:text-lime transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-lime" />
                    <span className="text-lime">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-ash" />
                    <span>COPY COMMAND</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {aiStatus.ollamaRunning && aiStatus.qwenInstalled && !aiStatus.qwenUsable && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
              <XCircle className="w-5 h-5" />
              <span>Qwen is installed but communication failed.</span>
            </div>
            <p className="text-sm text-ash font-sans pl-8">
              The model failed the test prompt execution. Ensure Ollama has enough system memory available and try checking again.
            </p>
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="mt-6 flex items-center gap-3 text-[10px] font-mono text-ash uppercase tracking-widest">
        <Cpu className="w-4 h-4 text-lime" />
        <span>Strict Privacy: Source code is never transmitted outside localhost.</span>
      </div>
    </div>
  );
}
