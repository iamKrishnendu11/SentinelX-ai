"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function DashboardFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { 
            y: 100,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom-=10%",
              end: "bottom bottom",
              scrub: 1 // smooth scrubbing effect tied to scroll
            }
          }
        );
      }
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className="w-full text-fog pt-16 pb-8 md:pb-12 px-6 mt-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center relative z-10">
        {/* Bottom Massive Typography */}
        <div className="w-full relative flex flex-col items-center overflow-hidden">
          <h1 
            ref={textRef} 
            className="font-display font-bold tracking-tighter text-[16vw] lg:text-[18vw] leading-[0.75] text-fog w-full text-center mb-4 cursor-default"
          >
            SentinelX<span className="text-lime">.</span>
          </h1>
          
          {/* Footer Meta Links (No hover animations) */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between mt-8 md:mt-12 font-mono text-[9px] md:text-[10px] tracking-widest text-white/40 uppercase gap-6 md:gap-4">
            <span>© {new Date().getFullYear()} Sentinel-X Security. All rights reserved.</span>
            <div className="flex gap-6 md:gap-8">
              <span className="cursor-default">Terms and Conditions</span>
              <span className="cursor-default">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
