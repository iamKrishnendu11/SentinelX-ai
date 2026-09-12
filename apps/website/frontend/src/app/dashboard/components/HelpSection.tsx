"use client";

import Link from "next/link";
import { HelpCircle, ArrowRight, BookOpen } from "lucide-react";

export default function HelpSection() {
  return (
    <section className="w-full">
      <div className="rounded-none bg-panel border border-white/10 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-lime scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-12 h-12 rounded-none bg-ink border border-white/10 flex items-center justify-center text-lime shrink-0 group-hover:border-lime/30 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(183,255,0,0)] group-hover:shadow-[0_0_15px_rgba(183,255,0,0.15)]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-fog uppercase tracking-tight">
              Need Help?
            </h2>
            <p className="mt-2 text-xs font-mono text-ash tracking-wider">
              Follow the setup guide to securely initialize Sentinel-X on your system.
            </p>
          </div>
        </div>

        <Link
          href="/docs/setup"
          className="relative z-10 inline-flex items-center gap-3 bg-ink border border-white/10 text-fog font-mono text-[10px] font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-none transition-all hover:text-lime hover:border-lime/50 cursor-pointer whitespace-nowrap overflow-hidden group/btn"
        >
          <span className="absolute inset-0 w-full h-full bg-lime/10 -translate-x-full group-hover/btn:animate-[flow-x_1.8s_linear_infinite]" />
          <BookOpen className="w-4 h-4 relative z-10" />
          <span className="relative z-10">View Setup Guide</span>
          <ArrowRight className="w-4 h-4 relative z-10" />
        </Link>
      </div>
    </section>
  );
}
