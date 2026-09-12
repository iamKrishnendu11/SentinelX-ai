"use client";

import { Radar, Network, Layers, FileCode, CheckCircle2, Server } from "lucide-react";

export default function AnalyzeDiscoverCard() {
  const discoveredRoutes = [
    { path: "/api/v1/audit/scan", type: "POST", scope: "Security Audit Trigger", risk: "CRITICAL" },
    { path: "/api/v1/remediation/patch", type: "POST", scope: "Blue Team Patching", risk: "HIGH" },
    { path: "/api/v1/audit/stream", type: "GET", scope: "SSE Telemetry Stream", risk: "LOW" },
    { path: "/api/github/callback", type: "POST", scope: "OAuth Token Exchange", risk: "HIGH" },
  ];

  const detectedManifests = [
    { file: "package.json", framework: "Next.js 16 / React 19", ecosystem: "Node.js" },
    { file: "requirements.txt", framework: "FastAPI / Uvicorn", ecosystem: "Python 3.11" },
    { file: "pom.xml", framework: "Spring Boot 3.3.1", ecosystem: "Java 21" },
  ];

  return (
    <div className="border border-white/10 bg-[#0D0F0D] rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Radar className="w-5 h-5 text-lime animate-spin-slow" />
          <div>
            <h3 className="font-mono text-xs font-bold text-fog uppercase tracking-widest">
              Attack Surface Discovery & Reconnaissance
            </h3>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              Automated Codebase Topology & Dependency Mapping
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] bg-lime/10 text-lime border border-lime/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-lime" />
          <span>Surface Mapped</span>
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Messages & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white/10 bg-black/60 p-4 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-wider">
              <Network className="w-3.5 h-3.5 text-lime" />
              <span>Mapped Routes</span>
            </div>
            <p className="text-2xl font-bold text-fog">14 Endpoints</p>
            <p className="text-[10px] text-slate-500">REST APIs & SSE Streams</p>
          </div>

          <div className="border border-white/10 bg-black/60 p-4 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-lime" />
              <span>Manifests Found</span>
            </div>
            <p className="text-2xl font-bold text-fog">3 Ecosystems</p>
            <p className="text-[10px] text-slate-500">Node, Python, Java Maven</p>
          </div>

          <div className="border border-white/10 bg-black/60 p-4 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-lime" />
              <span>Attack Entry Points</span>
            </div>
            <p className="text-2xl font-bold text-lime">3 High Risk</p>
            <p className="text-[10px] text-slate-500">Public Auth & Scan Controllers</p>
          </div>
        </div>

        {/* Discovered Endpoints List */}
        <div className="border border-white/10 bg-black/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">
              Discovered API Route Surface
            </span>
            <span className="text-slate-500 text-[10px]">4 Exposed Entry Points</span>
          </div>

          <div className="space-y-2">
            {discoveredRoutes.map((route, i) => (
              <div key={i} className="flex items-center justify-between bg-black/60 p-2.5 rounded border border-white/5 text-[11px]">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    route.type === "POST" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  }`}>
                    {route.type}
                  </span>
                  <code className="text-fog font-bold">{route.path}</code>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[10px] hidden sm:inline">{route.scope}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    route.risk === "CRITICAL" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {route.risk} RISK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ecosystem Manifests */}
        <div className="border border-white/10 bg-black/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">
              Detected Package Manifests & Frameworks
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {detectedManifests.map((m, idx) => (
              <div key={idx} className="bg-black/60 p-3 rounded border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-lime font-bold">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{m.file}</span>
                </div>
                <p className="text-slate-300 text-[10px]">{m.framework}</p>
                <p className="text-slate-500 text-[9px] uppercase tracking-wider">{m.ecosystem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
