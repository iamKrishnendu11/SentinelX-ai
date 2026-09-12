"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function AuthTransitionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayPath, setDisplayPath] = useState(pathname);
  const [oldChildren, setOldChildren] = useState<ReactNode | null>(null);
  const [currentChildren, setCurrentChildren] = useState<ReactNode>(children);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (pathname !== displayPath) {
      if (isAnimating.current) {
        gsap.killTweensOf(".auth-card-transition-item");
      }
      
      if (shouldReduceMotion) {
         setCurrentChildren(children);
         setDisplayPath(pathname);
         setOldChildren(null);
         return;
      }
      
      isAnimating.current = true;
      setOldChildren(currentChildren);
      setCurrentChildren(children);
      setDisplayPath(pathname);
    } else {
      setCurrentChildren(children);
    }
  }, [pathname, children, displayPath, currentChildren, shouldReduceMotion]);

  useGSAP(() => {
    if (oldChildren && containerRef.current && !shouldReduceMotion) {
      const oldEl = containerRef.current.querySelector(".auth-card-old") as HTMLElement;
      const newEl = containerRef.current.querySelector(".auth-card-new") as HTMLElement;

      if (oldEl && newEl) {
        const tl = gsap.timeline({
          onComplete: () => {
            setOldChildren(null);
            isAnimating.current = false;
            gsap.set(newEl, { clearProps: "all" });
          }
        });

        // Phase 1: Outgoing card shrinks to become very small and moves lower-right
        tl.to(oldEl, {
          scale: 0.25,
          x: 80,
          y: 80,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut"
        }, 0);

        // Phase 2: Incoming card starts from that exact same small size and position
        tl.fromTo(newEl, {
          scale: 0.25,
          x: 80,
          y: 80,
          opacity: 0,
        }, {
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out"
        }, 0.4);
      }
    }
  }, { dependencies: [oldChildren, shouldReduceMotion], scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto grid place-items-center min-h-[600px]">
      {/* Old Card */}
      {oldChildren && (
        <div className="auth-card-old auth-card-transition-item col-start-1 row-start-1 w-full z-0 pointer-events-none origin-bottom-right">
          {oldChildren}
        </div>
      )}
      
      {/* New Card */}
      <div className={`auth-card-new auth-card-transition-item col-start-1 row-start-1 w-full ${oldChildren ? 'z-10' : 'z-auto'} origin-bottom-right`}>
        {currentChildren}
      </div>
    </div>
  );
}
