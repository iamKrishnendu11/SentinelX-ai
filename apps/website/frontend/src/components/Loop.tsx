"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { LOOP_STAGES } from "@/data/siteData";
import { Reveal, Tag, SectionShell } from "./shared";

const Loop = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const active = LOOP_STAGES[activeIndex];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Map 0 -> 1 progress to 0 -> 5 index
        const stagesCount = LOOP_STAGES.length;
        // latest goes from 0 to 1 over the duration of the 600vh container.
        const rawIndex = Math.floor(latest * stagesCount);
        const nextIndex = Math.min(stagesCount - 1, Math.max(0, rawIndex));
        if (nextIndex !== activeIndex) {
            setActiveIndex(nextIndex);
        }
    });

    return (
        <div ref={containerRef} id="platform" className="relative bg-panel/40" style={{ height: "350vh" }}>
            <div className="sticky top-0 w-full h-screen flex flex-col justify-center overflow-hidden">
                <SectionShell className="!py-0 relative">
                    <Reveal>
                        <Tag>THE SENTINELX APPROACH</Tag>
                        <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8 max-w-4xl">
                            We built security <br />
                            <span className="text-ash">as an</span> autonomous loop.
                        </h2>
                    </Reveal>

                    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 mt-16 max-h-[60vh] lg:max-h-none overflow-y-auto lg:overflow-visible no-scrollbar">
                        <Reveal className="space-y-0">
                            {LOOP_STAGES.map((s, i) => (
                                <div key={s.id}>
                                    <button
                                        data-testid={`loop-stage-${s.id}`}
                                        onClick={() => {
                                            // Manual click can scroll the window to the exact section
                                            const container = containerRef.current;
                                            if (container) {
                                                const totalScroll = container.scrollHeight - window.innerHeight;
                                                const targetY = container.offsetTop + (i / (LOOP_STAGES.length - 1)) * totalScroll;
                                                window.scrollTo({ top: targetY, behavior: "smooth" });
                                                setActiveIndex(i);
                                            }
                                        }}
                                        className={`w-full text-left flex items-baseline gap-6 px-5 py-4 border-l-2 transition-colors ${
                                            activeIndex === i
                                                ? "border-lime bg-lime/5 text-lime"
                                                : "border-white/10 text-ash hover:text-fog hover:border-white/30"
                                        }`}
                                    >
                                        <span className="font-mono text-[10px] tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">{s.name}</span>
                                    </button>
                                    {i < LOOP_STAGES.length - 1 && (
                                        <div className="pl-[42px] py-1 text-white/20">
                                            <ArrowDown size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Reveal>

                        <Reveal delay={0.15}>
                            <div data-testid="loop-info-panel" className="border border-white/10 bg-ink p-8 md:p-12 min-h-[340px] flex flex-col relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={active.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -16 }}
                                        transition={{ duration: 0.35 }}
                                        className="flex flex-col h-full"
                                    >
                                        <p className="font-mono text-[10px] tracking-[0.3em] text-lime">STAGE // {active.name}</p>
                                        <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight mt-6">{active.name}</h3>
                                        <p className="text-ash text-base md:text-lg leading-relaxed mt-6 max-w-lg">{active.desc}</p>
                                        <div className="mt-auto pt-10 grid sm:grid-cols-3 gap-px bg-white/10 border border-white/10">
                                            {active.meta.map((m) => (
                                                <div key={m} className="bg-panel px-4 py-3 font-mono text-[10px] tracking-wider text-ash">
                                                    {m}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Reveal>
                    </div>
                </SectionShell>
            </div>
        </div>
    );
};

export default Loop;
