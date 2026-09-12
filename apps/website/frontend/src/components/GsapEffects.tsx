"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function GsapEffects() {
    const container = useRef(null);

    useGSAP(() => {
        // Create parallax moving vertical lines
        const lines = gsap.utils.toArray('.gsap-line');
        
        lines.forEach((line: any, i) => {
            gsap.to(line, {
                yPercent: 150 + (i * 20), // Move it down based on scroll
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5 + (i * 0.2), // Different scrub rates for parallax
                }
            });
        });

        // Add some floating geometric shapes in the background with parallax
        const shapes = gsap.utils.toArray('.gsap-shape');
        shapes.forEach((shape: any, i) => {
            gsap.to(shape, {
                y: (i + 1) * 400,
                x: i % 2 === 0 ? 200 : -200,
                rotation: i % 2 === 0 ? 360 : -360,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });
        });

        // Horizontal Parallax Lines
        const hLines = gsap.utils.toArray('.gsap-line-x');
        hLines.forEach((hline: any, i) => {
            gsap.to(hline, {
                xPercent: i % 2 === 0 ? 150 + (i * 20) : -(150 + (i * 20)),
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.8 + (i * 0.2),
                }
            });
        });
    }, { scope: container });

    return (
        <div ref={container} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden mix-blend-screen opacity-20">
            {/* Vertical Parallax Lines */}
            <div className="gsap-line absolute top-[-50vh] left-[10%] w-[1px] h-[300vh] bg-gradient-to-b from-transparent via-[#B7FF00] to-transparent opacity-40" />
            <div className="gsap-line absolute top-[-100vh] left-[50%] w-[1px] h-[250vh] bg-gradient-to-b from-transparent via-white to-transparent opacity-20" />
            <div className="gsap-line absolute top-[-150vh] left-[85%] w-[1px] h-[350vh] bg-gradient-to-b from-transparent via-[#B7FF00] to-transparent opacity-40" />

            {/* Horizontal Parallax Lines */}
            <div className="gsap-line-x absolute left-[-50vw] top-[20%] h-[1px] w-[300vw] bg-gradient-to-r from-transparent via-white to-transparent opacity-10" />
            <div className="gsap-line-x absolute left-[-100vw] top-[55%] h-[1px] w-[250vw] bg-gradient-to-r from-transparent via-[#B7FF00] to-transparent opacity-20" />
            <div className="gsap-line-x absolute left-[-50vw] top-[80%] h-[1px] w-[350vw] bg-gradient-to-r from-transparent via-white to-transparent opacity-10" />

            {/* Floating Shapes */}
            <div className="gsap-shape absolute top-[20%] left-[15%] w-[300px] h-[300px] border border-[#B7FF00]/10 rounded-full mix-blend-overlay blur-[80px]" />
            <div className="gsap-shape absolute top-[60%] right-[20%] w-[400px] h-[400px] border border-white/5 bg-[#B7FF00]/5 rounded-full mix-blend-overlay blur-[100px]" />
        </div>
    );
}
