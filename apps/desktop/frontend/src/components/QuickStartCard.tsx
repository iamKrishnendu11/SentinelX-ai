"use client";

import { FolderPlus, FileSearch, AlertOctagon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface QuickStartItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  href?: string;
  icon: React.ElementType;
  disabled?: boolean;
}

export default function QuickStartCard() {
  const [notice, setNotice] = useState<string | null>(null);

  const handleAction = (item: QuickStartItem) => {
    if (item.disabled || !item.href) {
      setNotice(`"${item.title}" will be active once local projects and engines are linked.`);
      setTimeout(() => setNotice(null), 3500);
    }
  };

  const cards: QuickStartItem[] = [
    {
      id: "add-project",
      title: "Add a Project",
      icon: FolderPlus,
      description: "Add a local project to your Sentinel-X workspace.",
      buttonText: "Add Project",
      href: "/projects",
    },
    {
      id: "start-scan",
      title: "Run a Security Scan",
      icon: FileSearch,
      description: "Analyze your project for security vulnerabilities.",
      buttonText: "Start Scan",
      disabled: true,
    },
    {
      id: "view-vulns",
      title: "Review Vulnerabilities",
      icon: AlertOctagon,
      description: "Review detected security issues and understand their impact.",
      buttonText: "View Vulnerabilities",
      href: "/vulnerabilities",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" />
          Quick Start
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Getting Started</span>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-[#050505] border border-amber-500/40 text-amber-300 text-xs font-mono">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group rounded-xl bg-[#0D0F0D] border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between space-y-4 transition-all hover:bg-white/[0.02]"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00] group-hover:border-[#B7FF00]/40 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-bold text-slate-200 group-hover:text-[#B7FF00] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div>
                {card.href ? (
                  <Link
                    href={card.href}
                    className="w-full py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-[#B7FF00]/10 border border-white/10 hover:border-[#B7FF00]/30 text-slate-200 hover:text-[#B7FF00] text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleAction(card)}
                    className="w-full py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-slate-500 text-xs font-mono font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <span>{card.buttonText}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      Standby
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
