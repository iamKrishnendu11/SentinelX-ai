"use client";

import { useRef, Children, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function GsapPanelStack({ children }: { children: ReactNode }) {
    const container = useRef<HTMLDivElement>(null);
    
    // We expect children to be sections we want to stack.
    const panels = Children.toArray(children);

    useGSAP(() => {
        const DOMPanels = gsap.utils.toArray('.gsap-panel-stack-item');
        
        DOMPanels.forEach((panel: any, i) => {
            // Pin all but the last panel
            if (i !== DOMPanels.length - 1) {
                ScrollTrigger.create({
                    trigger: panel,
                    start: "top top",
                    pin: true,
                    pinSpacing: false, 
                    // This allows the next panel to scroll over this one
                });
            }
            
            // Add a subtle darkening/scaling effect to the pinned panel as the next one covers it
            if (i !== DOMPanels.length - 1) {
                gsap.to(panel, {
                    scale: 0.95,
                    opacity: 0.5,
                    scrollTrigger: {
                        trigger: DOMPanels[i + 1] as Element,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    }
                });
            }
        });
        
    }, { scope: container });

    return (
        <div ref={container} className="relative w-full">
            {panels.map((panel, i) => (
                <div 
                    key={i} 
                    className="gsap-panel-stack-item relative w-full min-h-[100svh] flex flex-col justify-center bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10"
                    style={{ zIndex: i + 1 }}
                >
                    {panel}
                </div>
            ))}
        </div>
    );
}
