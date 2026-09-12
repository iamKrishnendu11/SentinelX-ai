"use client";

import { ShieldCheck, Laptop } from "lucide-react";

export default function LocalFirstCard() {
  return (
    <section className="rounded-xl bg-[#0D0F0D] border border-[#B7FF00]/30 p-5 md:p-6 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#B7FF00]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#050505] border border-[#B7FF00]/40 flex items-center justify-center text-[#B7FF00] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-mono font-bold text-slate-100">
              Your code stays local
            </h4>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/30 flex items-center gap-1">
              <Laptop className="w-3 h-3" />
              100% Privacy
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Sentinel-X is designed to perform security analysis locally on your machine. Your source code does not need to be uploaded to the Sentinel-X cloud.
          </p>
        </div>
      </div>
    </section>
  );
}
