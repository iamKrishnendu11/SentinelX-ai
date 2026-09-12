"use client";

import { useRef } from "react";
import { Download, Monitor, Command, Terminal, Sparkles, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface DownloadSectionProps {
  id?: string;
}

export default function DownloadSection({ id = "download" }: DownloadSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const downloadConfig = {
    windows: process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL || "",
    macos: process.env.NEXT_PUBLIC_MACOS_DOWNLOAD_URL || "",
    linux: process.env.NEXT_PUBLIC_LINUX_DOWNLOAD_URL || "",
  };

  const platforms = [
    {
      id: "windows",
      name: "Windows",
      icon: Monitor,
      subtitle: "Windows 10 / 11 (64-bit)",
      url: downloadConfig.windows,
      note: "Installer (.msi / .exe)",
    },
    {
      id: "macos",
      name: "macOS",
      icon: Command,
      subtitle: "macOS 12+ (Apple Silicon & Intel)",
      url: downloadConfig.macos,
      note: "Universal Binary (.dmg)",
    },
    {
      id: "linux",
      name: "Linux",
      icon: Terminal,
      subtitle: "Ubuntu, Debian, Fedora, Arch",
      url: downloadConfig.linux,
      note: "Package (.deb / .AppImage)",
    },
  ];

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      
      const cards = sectionRef.current.querySelectorAll(".gsap-os-card");
      
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
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
    <section id={id} className="w-full scroll-mt-24" ref={sectionRef}>
      {/* Primary Download Focus Card */}
      <div className="relative rounded-none bg-panel border border-white/10 p-8 sm:p-12 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime/[0.06] rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-lime/30 text-lime font-mono text-[10px] uppercase tracking-[0.3em] mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Local Security Workspace</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-fog uppercase">
            Download Sentinel-X
          </h2>
          
          <p className="mt-6 text-sm sm:text-base text-ash max-w-xl mx-auto leading-relaxed">
            Run Sentinel-X locally and keep your development environment and source code strictly under your control.
          </p>

          {/* OS Options Grid (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-12 text-left">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const hasUrl = Boolean(platform.url && platform.url.trim().length > 0);

              return (
                <div
                  key={platform.id}
                  className="gsap-os-card flex flex-col justify-between p-6 sm:p-8 bg-panel hover:bg-[#0A0A0A] transition-colors group relative"
                >
                  {/* Subtle active state line */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-lime scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-none border border-white/10 bg-ink flex items-center justify-center text-ash group-hover:border-lime/40 group-hover:text-lime transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[9px] uppercase text-ash tracking-[0.2em]">
                        {platform.note}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-fog uppercase tracking-tight">
                      {platform.name}
                    </h3>
                    <p className="font-mono text-[10px] text-ash mt-2 mb-8 tracking-wider">
                      {platform.subtitle}
                    </p>
                  </div>

                  <div>
                    {hasUrl ? (
                      <a
                        href={platform.url}
                        download
                        className="w-full inline-flex items-center justify-center gap-2 bg-lime text-ink font-mono text-[10px] font-bold uppercase tracking-[0.2em] py-3.5 px-4 rounded-none hover:bg-[#cfff4d] transition-all cursor-pointer lime-glow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-ink border border-white/10 py-3.5 px-4 rounded-none font-mono text-[10px] text-ash tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-ash" />
                          Coming soon
                        </span>
                        <span className="text-[9px] uppercase px-2 py-0.5 border border-white/10 text-ash tracking-[0.2em]">
                          In Progress
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-[10px] font-mono text-ash tracking-wider uppercase">
            Need automated deployment scripts or enterprise distribution? Check out our setup documentation below.
          </p>
        </div>
      </div>
    </section>
  );
}
