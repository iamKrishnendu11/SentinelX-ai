"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Download, Monitor, Command, Terminal, Shield } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import DownloadSection from "./components/DownloadSection";
import SetupSteps from "./components/SetupSteps";
import SystemRequirements from "./components/SystemRequirements";
import HowItWorks from "./components/HowItWorks";
import HelpSection from "./components/HelpSection";
import DashboardFooter from "./components/DashboardFooter";
import CursorGrid from "@/components/CursorComp";
import ParticleText from "@/components/ParticleText";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface DashboardClientProps {
  user: {
    email: string;
    name?: string;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const svgsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Create a master timeline for page load
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Background fades in
      tl.fromTo(
        backgroundRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5 }
      );

      // 2. Hero elements stagger in
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll(".gsap-hero-element");
        tl.fromTo(
          heroElements,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          "-=1.0" // overlap with background animation
        );
      }

      // 3. Floating SVGs in background
      if (svgsRef.current) {
        const icons = svgsRef.current.querySelectorAll(".gsap-floating-icon");
        
        // Initial entrance on load
        tl.fromTo(
          icons,
          { opacity: 0, scale: 0, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "back.out(1.2)" },
          "-=0.5"
        );

        // Parallax effect on scroll instead of infinite floating
        gsap.to(icons, {
          y: -150, // Move up as user scrolls down
          rotation: "random(-15, 15)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5
          }
        });
      }
    },
    { scope: containerRef }
  );

  const scrollToDownload = () => {
    const el = document.getElementById("download");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-ink text-fog flex flex-col font-sans relative overflow-x-hidden"
    >
      {/* Background Interactive Layer */}
      <div 
        ref={backgroundRef}
        className="fixed inset-0 z-0 opacity-0"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(183,255,0,0.08)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none" />
        <CursorGrid color="#B7FF00" gridOpacity={0.03} maxOpacity={0.5} radius={250} />
      </div>

      {/* Top Header */}
      <DashboardHeader user={user} />

      {/* Main Content */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-6 py-12 md:py-24 space-y-24 md:space-y-32 relative z-10">
        
        {/* Welcome Hero */}
        <section ref={heroRef} className="text-center max-w-4xl mx-auto pt-4 md:pt-8 relative">
          <div className="gsap-hero-element inline-flex items-center gap-2 px-3 py-1 rounded-none border border-white/10 bg-panel text-[10px] font-mono text-lime mb-2 tracking-[0.2em] uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Authenticated Workspace</span>
          </div>

          <div className="gsap-hero-element w-full flex justify-center mb-2">
            <div className="w-[120%] -ml-[10%] h-[120px] sm:h-[160px] md:h-[200px] relative z-20">
              <ParticleText
                text="Welcome to Sentinel-X"
                particleSize={3}
                density={4}
                color="#f5f5f0"
                highlightColor="#b7ff00"
                trigger="hover"
                fontSize="clamp(3rem, 9vw, 6rem)"
                fontFamily="Outfit, sans-serif"
                fontWeight={700}
                className="min-h-0"
              />
            </div>
          </div>

          <p className="gsap-hero-element mt-6 text-base md:text-lg text-ash font-sans max-w-xl mx-auto leading-relaxed">
            Your local AI-powered security engineering workspace. Initialize the environment to begin autonomous analysis.
          </p>

          <div className="gsap-hero-element mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToDownload}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-lime text-ink font-mono text-xs font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-none transition-all hover:bg-[#cfff4d] lime-glow cursor-pointer overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[flow-x_1.8s_linear_infinite]" />
              <Download className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Download Desktop</span>
            </button>
          </div>

          <div className="gsap-hero-element mt-8 flex items-center justify-center gap-4 text-[10px] font-mono text-ash tracking-[0.2em] uppercase">
            <div className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" /> Windows</div>
            <span className="text-white/10">/</span>
            <div className="flex items-center gap-1.5"><Command className="w-3.5 h-3.5" /> macOS</div>
            <span className="text-white/10">/</span>
            <div className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Linux</div>
          </div>
        </section>

        {/* Download Section (Primary Focus) */}
        <DownloadSection id="download" />

        {/* Get Started Steps */}
        <SetupSteps />

        {/* System Requirements */}
        <SystemRequirements />

        {/* How Sentinel-X Works */}
        <HowItWorks />

        {/* Need Help? */}
        <HelpSection />

      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
