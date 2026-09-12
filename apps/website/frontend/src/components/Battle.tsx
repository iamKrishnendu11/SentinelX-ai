import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swords, ShieldCheck } from "lucide-react";
import { BATTLE_SCRIPT } from "@/data/siteData";
import { Reveal, Tag, SectionShell, Counter } from "./shared";

const STATS = [
    { label: "ATTACKS SIMULATED", value: 24, testId: "battle-attacks" },
    { label: "BLOCKED", value: 22, testId: "battle-blocked" },
    { label: "VERIFIED", value: 2, testId: "battle-verified" },
    { label: "SECURITY SCORE", value: 94, suffix: "%", testId: "battle-score" },
];

const LaserEffects = ({ feed }: { feed: any[] }) => {
    const [shots, setShots] = useState<any[]>([]);

    useEffect(() => {
        if (!feed.length) return;
        const latest = feed[0];
        setShots((s) => [...s, latest].slice(-5));
    }, [feed]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {shots.map((shot) => {
                const isRed = shot.side === "red";
                const color = isRed ? "#FF5F56" : "#B7FF00";

                return (
                    <motion.div
                        key={shot.id}
                        initial={{ left: isRed ? "-20%" : "120%" }}
                        animate={{ left: isRed ? "120%" : "-20%" }}
                        transition={{ duration: 0.45, ease: "linear" }}
                        className="absolute top-1/2 -translate-y-1/2 w-[300px]"
                    >
                        <svg width="300" height="60" viewBox="0 0 300 60" className={`overflow-visible ${isRed ? "" : "-scale-x-100"}`}>
                            {/* Bolt Trail Core & Glow */}
                            <path d="M 0 30 L 260 30" stroke={color} strokeWidth="6" style={{ filter: "blur(4px)" }} />
                            <path d="M 100 30 L 280 30" stroke="#fff" strokeWidth="2" />
                            {/* Crossbow Head */}
                            <path d="M 250 15 L 300 30 L 250 45 Z" fill="#fff" style={{ filter: `drop-shadow(0 0 15px ${color})` }} />
                            {/* Energy Arcs */}
                            <path d="M 230 0 L 280 30 L 230 60" stroke={color} strokeWidth="3" fill="none" style={{ filter: "blur(2px)" }} />
                            <path d="M 260 10 L 290 30 L 260 50" stroke="#fff" strokeWidth="2" fill="none" />
                        </svg>
                    </motion.div>
                );
            })}
        </div>
    );
};

const Battle = () => {
    const [feed, setFeed] = useState<any[]>([]);

    useEffect(() => {
        let i = 0;
        let t = 4120;
        const push = () => {
            const ev = BATTLE_SCRIPT[i % BATTLE_SCRIPT.length];
            t += 7 + (i % 3) * 5;
            const ts = new Date(Date.now()).toTimeString().slice(0, 8);
            setFeed((f: any[]) => [{ ...ev, id: `${i}-${ts}`, ts }, ...f].slice(0, 7));
            i += 1;
        };
        push();
        const timer = setInterval(push, 1900);
        return () => clearInterval(timer);
    }, []);

    return (
        <SectionShell id="battle" className="bg-ink">
            <Reveal>
                <Tag>ADVERSARIAL SIMULATION</Tag>
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8">
                    Let AI <span className="text-lime">attack AI.</span>
                </h2>
            </Reveal>

            <Reveal delay={0.15}>
                <div data-testid="battle-arena" className="relative mt-16 border border-white/10 bg-panel overflow-hidden">
                    <LaserEffects feed={feed} />
                    
                    <div className="relative z-10 grid grid-cols-3 border-b border-white/10 bg-black/40">
                        <div className="p-5 flex items-center gap-3 border-r border-white/10">
                            <Swords size={16} className="text-[#FF5F56]" />
                            <div>
                                <p className="font-mono text-[10px] tracking-[0.25em] text-[#FF5F56]">RED TEAM</p>
                                <p className="font-mono text-[9px] text-ash mt-0.5">ATTACK</p>
                            </div>
                        </div>
                        <div className="p-5 text-center border-r border-white/10 flex flex-col items-center justify-center">
                            <p className="font-mono text-[10px] tracking-[0.25em] text-fog flex items-center justify-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" /> LIVE BATTLE
                            </p>
                        </div>
                        <div className="p-5 flex items-center justify-end gap-3">
                            <div className="text-right">
                                <p className="font-mono text-[10px] tracking-[0.25em] text-lime">BLUE TEAM</p>
                                <p className="font-mono text-[9px] text-ash mt-0.5">DEFEND</p>
                            </div>
                            <ShieldCheck size={16} className="text-lime" />
                        </div>
                    </div>

                    <div 
                        data-testid="battle-feed" 
                        className="relative p-6 md:p-8 h-[380px] font-mono text-xs md:text-sm space-y-3 overflow-hidden"
                        style={{ maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)" }}
                    >
                        <AnimatePresence initial={false}>
                            {feed.map((ev) => (
                                <motion.div
                                    key={ev.id}
                                    initial={{ opacity: 0, x: ev.side === "red" ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className={`relative z-10 flex gap-4 ${ev.side === "blue" ? "justify-end" : ""}`}
                                >
                                    <span className="text-ash/50 text-[10px] pt-1 shrink-0">{ev.ts}</span>
                                    <span
                                        className={`px-3 py-1.5 border max-w-md backdrop-blur-md ${ev.side === "red"
                                                ? "border-[#FF5F56]/30 text-[#FF8A80] bg-[#FF5F56]/10"
                                                : "border-lime/30 text-lime bg-lime/10"
                                            }`}
                                    >
                                        <span className="text-[9px] tracking-[0.2em] mr-2 opacity-60">{ev.side === "red" ? "ATTACK" : "DEFEND"}</span>
                                        {ev.text}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-white/10 divide-x divide-white/10 bg-panel">
                        {STATS.map((s) => (
                            <div key={s.label} data-testid={s.testId} className="p-5 md:p-6 text-center bg-black/20">
                                <p className={`font-display text-3xl md:text-4xl font-bold ${s.label === "SECURITY SCORE" ? "text-lime" : "text-fog"}`}>
                                    <Counter to={s.value} suffix={s.suffix || ""} />
                                </p>
                                <p className="font-mono text-[9px] tracking-[0.2em] text-ash mt-2">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
        </SectionShell>
    );
};

export default Battle;
