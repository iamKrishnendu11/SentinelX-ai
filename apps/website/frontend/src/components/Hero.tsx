"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Types
interface HeroProps {
    onScan: () => void;
}

// --------------------------------------------------
// STAGGER TIMING
// --------------------------------------------------
const STAGGER = {
    eyebrow: 0.1,
    headline: 0.3,
    subtext: 0.8,
    cta: 1.0,
    hud: 1.2,
    loop: 1.4,
};

// --------------------------------------------------
// HERO HUD (Right Side)
// --------------------------------------------------
const HeroHUD = () => {
    return (
        <div className="absolute right-0 lg:right-12 xl:right-[6vw] top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 opacity-60 pointer-events-none">
            {/* Scanning Ring */}
            <div className="relative w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t border-lime/50"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border-l border-white/20"
                />
                {/* Center pulse */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 bg-lime rounded-full lime-glow"
                />
                {/* Scan line */}
                <motion.div
                    animate={{ y: [-48, 48, -48] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-full h-[1px] bg-lime/40"
                />
            </div>

            {/* Data Points */}
            <div className="flex flex-col gap-4 font-mono text-[10px] tracking-widest text-[#9CA3AF]">
                <div className="flex items-center justify-between gap-8 border-b border-white/10 pb-2">
                    <span>SENTINELX CORE</span>
                    <span className="flex items-center gap-2 text-[#F5F5F0]">
                        <motion.span
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-lime rounded-full"
                        />
                        ONLINE
                    </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>AI AGENTS</span>
                    <span className="text-[#F5F5F0]">06 ACTIVE</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>DIGITAL TWIN</span>
                    <span className="text-lime">PROTECTED</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>THREAT LEVEL</span>
                    <span className="text-[#F5F5F0]">LOW</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>RISK SCORE</span>
                    <span className="text-lime font-bold">12%</span>
                </div>
            </div>
        </div>
    );
};

// --------------------------------------------------
// COMPACT MOBILE HUD
// --------------------------------------------------
const MobileHUD = () => (
    <div className="md:hidden flex items-center justify-center gap-4 mt-8 font-mono text-[9px] tracking-widest text-[#9CA3AF] opacity-70">
        <span className="flex items-center gap-1.5 text-lime">
            <span className="w-1 h-1 bg-lime rounded-full animate-pulse" />
            CORE ONLINE
        </span>
        <span className="w-px h-3 bg-white/20" />
        <span>06 AGENTS</span>
        <span className="w-px h-3 bg-white/20" />
        <span>RISK 12%</span>
    </div>
);

// --------------------------------------------------
// SECURITY LOOP (Bottom)
// --------------------------------------------------
const STAGES = ["DISCOVER", "SIMULATE", "VERIFY", "HEAL", "PREDICT"];

const SecurityLoop = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
            setActive((prev) => (prev + 1) % STAGES.length);
        }, 2500);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="absolute bottom-8 left-6 md:left-[6vw] md:bottom-12 flex flex-wrap items-center gap-2 md:gap-4 font-mono text-[9px] md:text-[10px] tracking-widest">
            {STAGES.map((s, i) => (
                <div key={s} className="flex items-center gap-2 md:gap-4">
                    <motion.span
                        animate={{
                            color: active === i ? "#B7FF00" : "rgba(156,163,175,0.5)",
                            textShadow: active === i ? "0 0 8px rgba(183,255,0,0.4)" : "none",
                        }}
                        transition={{ duration: 0.6 }}
                    >
                        {s}
                    </motion.span>
                    {i < STAGES.length - 1 && (
                        <span className="text-white/20">→</span>
                    )}
                </div>
            ))}
        </div>
    );
};

// --------------------------------------------------
// MAIN HERO COMPONENT
// --------------------------------------------------
const Hero = ({ onScan }: HeroProps) => {
    const { scrollY } = useScroll();

    // Parallax effects
    const bgY = useTransform(scrollY, [0, 1000], ["0%", "15%"]);
    const contentY = useTransform(scrollY, [0, 1000], ["0%", "-15%"]);
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);

    return (
        <section
            id="top"
            data-testid="hero-section"
            className="relative w-full min-h-[100svh] overflow-hidden bg-[#050505] text-[#F5F5F0]"
        >
            {/* BACKGROUND VIDEO & OVERLAYS */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 w-full h-full">
                {/* 
                  Since the actual video is not local, we use a placeholder src. 
                  The user can replace this with their downloaded Pexels video. 
                */}
                <video
                    src="/hero-background.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Cinematic Overlay */}
                <div className="absolute inset-0 bg-black/65" />

                {/* Subtle Lime Radial Glow & Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.8)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(183,255,0,0.03)_0%,transparent_50%)]" />

                {/* Grain Noise */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.04%22/%3E%3C/svg%3E')]" />
            </motion.div>

            {/* MAIN CONTENT */}
            <motion.div
                style={{ y: contentY, opacity }}
                className="absolute bottom-24 md:bottom-32 left-6 md:left-[6vw] flex flex-col items-start gap-3 z-10"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: STAGGER.headline, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-bold uppercase tracking-[-0.03em] text-[2.5rem] md:text-[4.5rem] text-[#B7FF00] leading-none"
                >
                    SENTINELX AI
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: STAGGER.subtext, ease: [0.16, 1, 0.3, 1] }}
                    className="font-mono text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-[rgba(245,245,240,0.6)]"
                >
                    DON'T JUST DETECT THREATS. PREDICT THEM.
                </motion.p>
            </motion.div>

            {/* RIGHT HUD */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: STAGGER.hud, ease: [0.16, 1, 0.3, 1] }}
            >
                <HeroHUD />
            </motion.div>

            {/* BOTTOM SECURITY LOOP */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: STAGGER.loop, ease: [0.16, 1, 0.3, 1] }}
            >
                <SecurityLoop />
            </motion.div>

            {/* SCROLL INDICATOR */}
            <motion.a
                href="#platform"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: STAGGER.loop + 0.2 }}
                className="absolute bottom-8 right-3 md:right-8 xl:right-12 flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            >
                <span className="font-mono text-[8px] md:text-[9px] tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                    SCROLL TO EXPLORE
                </span>
                <div className="w-px h-12 bg-white/20 relative overflow-hidden">
                    <motion.div
                        className="w-full h-1/2 bg-white/60"
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </motion.a>
        </section>
    );
};

export default Hero;
