"use client";

import { useRef } from "react";
import { HardDrive, Cpu, Info, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SystemRequirements() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      
      const reqItems = sectionRef.current.querySelectorAll(".gsap-req-item");
      
      gsap.fromTo(
        reqItems,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section className="w-full" ref={sectionRef}>
      <div className="rounded-none bg-panel border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-fog uppercase">
              System Requirements
            </h2>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] font-mono text-ash">
              Ensure your computer meets the specifications for optimal local analysis.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono text-lime bg-lime/5 border border-lime/20 px-3 py-1.5 rounded-none self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cross-platform support</span>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {/* OS Support */}
          <div className="gsap-req-item p-6 bg-ink hover:bg-[#0A0A0A] transition-colors relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-lime/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-ash" />
              <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-fog">Supported OS</h3>
            </div>
            <ul className="space-y-3 font-mono text-[10px] text-ash tracking-wider">
              <li className="flex items-center gap-2">
                <span className="text-lime">▶</span>
                <span>Windows 10 / 11 (64-bit)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime">▶</span>
                <span>macOS 12+ (Apple Silicon & Intel)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime">▶</span>
                <span>Linux (Ubuntu, Debian, Fedora, Arch)</span>
              </li>
            </ul>
          </div>

          {/* Minimum Specs */}
          <div className="gsap-req-item p-6 bg-ink hover:bg-[#0A0A0A] transition-colors relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-lime/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-4 h-4 text-ash" />
              <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-fog">Minimum Specs</h3>
            </div>
            <ul className="space-y-3 font-mono text-[10px] text-ash tracking-wider">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>RAM:</span>
                <span className="text-fog font-bold">8 GB</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Disk Space:</span>
                <span className="text-fog font-bold">10 GB free</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>Architecture:</span>
                <span className="text-fog font-bold">x86_64 / ARM64</span>
              </li>
            </ul>
          </div>

          {/* Recommended Specs */}
          <div className="gsap-req-item p-6 bg-ink hover:bg-[#0A0A0A] transition-colors relative overflow-hidden group border-l border-lime/30">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-lime scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            <div className="absolute top-0 right-0 px-2 py-1 bg-lime/10 border-b border-l border-lime/30 font-mono text-[9px] text-lime uppercase font-bold tracking-[0.2em]">
              Optimal
            </div>
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-4 h-4 text-lime" />
              <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-lime">Recommended Specs</h3>
            </div>
            <ul className="space-y-3 font-mono text-[10px] text-ash tracking-wider">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>RAM:</span>
                <span className="text-lime font-bold">16 GB+</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Disk Space:</span>
                <span className="text-lime font-bold">20 GB+ free</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>GPU Acceleration:</span>
                <span className="text-lime font-bold">Metal / CUDA / Vulkan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Model Note */}
        <div className="gsap-req-item mt-6 p-4 rounded-none bg-ink border border-white/10 flex items-start gap-3">
          <Info className="w-4 h-4 text-lime shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] tracking-wider text-ash leading-relaxed">
            <strong className="text-fog tracking-[0.2em] uppercase">Note:</strong> AI model hardware requirements may vary depending on the local model selected (e.g., quantized models vs full precision LLMs).
          </p>
        </div>
      </div>
    </section>
  );
}
