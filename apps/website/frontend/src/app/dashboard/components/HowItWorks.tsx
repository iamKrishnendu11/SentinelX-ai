"use client";

import { useRef } from "react";
import { Laptop, Shield, Cpu, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  const flowSteps = [
    {
      label: "Your Computer",
      detail: "Source code & local env",
      icon: Laptop,
    },
    {
      label: "Sentinel-X App",
      detail: "Isolated desktop client",
      icon: Shield,
    },
    {
      label: "Security Analysis",
      detail: "SAST & local scanners",
      icon: Cpu,
    },
    {
      label: "AI-assisted Security",
      detail: "On-device security models",
      icon: Sparkles,
    },
    {
      label: "Security Results",
      detail: "Actionable remediation",
      icon: CheckCircle2,
    },
  ];

  useGSAP(
    () => {
      if (!containerRef.current) return;
      
      const nodes = containerRef.current.querySelectorAll(".gsap-flow-node");
      const arrows = containerRef.current.querySelectorAll(".gsap-flow-arrow");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });

      tl.fromTo(
        nodes,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.15, ease: "back.out(1.2)" }
      );

      tl.fromTo(
        arrows,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.15, ease: "power2.out" },
        "-=0.5"
      );
    },
    { scope: containerRef }
  );

  return (
    <section className="w-full" ref={containerRef}>
      <div className="rounded-none bg-panel border border-white/10 p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-lime/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-lime uppercase tracking-[0.3em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-blink" />
            <span>Local Privacy First</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-fog uppercase">
            How Sentinel-X Works
          </h2>
          <p className="mt-4 text-sm text-ash leading-relaxed">
            <strong className="text-fog">Your code stays on your machine.</strong> Sentinel-X Desktop performs security analysis locally, leveraging local tools and isolated AI models without exposing IP.
          </p>
        </div>

        {/* Visual Flow Pipeline */}
        <div className="mt-12 pt-10 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  <div className="gsap-flow-node w-full p-5 rounded-none bg-ink border border-white/10 hover:border-lime/40 transition-all flex flex-col items-center group relative overflow-hidden cursor-default">
                    {/* Hover Pulse Effect */}
                    <div className="absolute inset-0 bg-lime/0 group-hover:bg-lime/5 transition-colors pointer-events-none" />
                    
                    <div className="w-12 h-12 rounded-none bg-panel border border-white/10 flex items-center justify-center text-lime mb-4 group-hover:scale-110 group-hover:border-lime/30 transition-all duration-300 shadow-[0_0_15px_rgba(183,255,0,0)] group-hover:shadow-[0_0_15px_rgba(183,255,0,0.15)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xs font-bold text-fog uppercase tracking-tight">
                      {step.label}
                    </h3>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash mt-2">
                      {step.detail}
                    </p>
                  </div>

                  {index < flowSteps.length - 1 && (
                    <div className="gsap-flow-arrow hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-lime/40 group-hover:text-lime transition-colors">
                      <ArrowRight className="w-4 h-4 animate-[flow-x_1.8s_linear_infinite]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
