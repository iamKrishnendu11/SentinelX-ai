"use client";

import { useRef } from "react";
import { Download, LogIn, Sliders, ShieldCheck, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SetupSteps() {
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: "Download Desktop",
      description: "Download and install the Sentinel-X application on your host.",
      icon: Download,
    },
    {
      number: "02",
      title: "Authenticate",
      description: "Open Sentinel-X and sign in with your enterprise credentials.",
      icon: LogIn,
    },
    {
      number: "03",
      title: "Initialize Twin",
      description: "Configure local environment parameters for safe sandboxing.",
      icon: Sliders,
    },
    {
      number: "04",
      title: "Begin Analysis",
      description: "Launch the autonomous swarm to begin analyzing vulnerabilities.",
      icon: ShieldCheck,
    },
  ];

  useGSAP(
    () => {
      if (!containerRef.current) return;
      
      const stepCards = containerRef.current.querySelectorAll(".gsap-step-card");
      
      gsap.fromTo(
        stepCards,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section className="w-full" ref={containerRef}>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-blink" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-lime uppercase">
              Initialization Protocol
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-fog uppercase">
            System Setup
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="gsap-step-card relative p-8 bg-panel hover:bg-[#0A0A0A] transition-colors flex flex-col justify-between group overflow-hidden"
            >
              <div className="absolute inset-0 border border-lime/0 group-hover:border-lime/20 transition-colors pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[10px] font-bold text-lime bg-lime/10 border border-lime/20 px-2.5 py-1 tracking-widest uppercase">
                    Step {step.number}
                  </span>
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-ash bg-ink group-hover:text-lime group-hover:border-lime/40 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-fog uppercase tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-ash leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden xl:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center bg-ink border border-white/10 text-ash group-hover:text-lime group-hover:border-lime/30 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
