import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swords, ShieldCheck } from "lucide-react";
import { BATTLE_SCRIPT } from "../../data/siteData";
import { Reveal, Tag, SectionShell, Counter } from "./shared";

const STATS = [
    { label: "ATTACKS SIMULATED", value: 24, testId: "battle-attacks" },
    { label: "BLOCKED", value: 22, testId: "battle-blocked" },
    { label: "VERIFIED", value: 2, testId: "battle-verified" },
    { label: "SECURITY SCORE", value: 94, suffix: "%", testId: "battle-score" },
];

const Battle = () => {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        let i = 0;
        let t = 4120;
        const push = () => {
            const ev = BATTLE_SCRIPT[i % BATTLE_SCRIPT.length];
            t += 7 + (i % 3) * 5;
            const ts = new Date(Date.now()).toTimeString().slice(0, 8);
            setFeed((f) => [{ ...ev, id: `${i}-${ts}`, ts }, ...f].slice(0, 7));
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
                <div data-testid="battle-arena" className="mt-16 border border-white/10 bg-panel">
                    <div className="grid grid-cols-3 border-b border-white/10">
                        <div className="p-5 flex items-center gap-3 border-r border-white/10">
                            <Swords size={16} className="text-[#FF5F56]" />
                            <div>
                                <p className="font-mono text-[10px] tracking-[0.25em] text-[#FF5F56]">RED TEAM</p>
                                <p className="font-mono text-[9px] text-ash mt-0.5">ATTACK</p>
                            </div>
                        </div>
                        <div className="p-5 text-center border-r border-white/10">
                            <p className="font-mono text-[10px] tracking-[0.25em] text-fog flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" /> LIVE BATTLE
                            </p>
                            <p className="font-mono text-[9px] text-ash mt-0.5">TWIN SANDBOX · RUN #4821</p>
                        </div>
                        <div className="p-5 flex items-center justify-end gap-3">
                            <div className="text-right">
                                <p className="font-mono text-[10px] tracking-[0.25em] text-lime">BLUE TEAM</p>
                                <p className="font-mono text-[9px] text-ash mt-0.5">DEFEND</p>
                            </div>
                            <ShieldCheck size={16} className="text-lime" />
                        </div>
                    </div>

                    <div data-testid="battle-feed" className="p-6 md:p-8 min-h-[320px] font-mono text-xs md:text-sm space-y-3">
                        <AnimatePresence initial={false}>
                            {feed.map((ev) => (
                                <motion.div
                                    key={ev.id}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                    className={`flex gap-4 ${ev.side === "blue" ? "justify-end" : ""}`}
                                >
                                    <span className="text-ash/50 text-[10px] pt-1 shrink-0">{ev.ts}</span>
                                    <span
                                        className={`px-3 py-1.5 border max-w-md ${
                                            ev.side === "red"
                                                ? "border-[#FF5F56]/30 text-[#FF8A80] bg-[#FF5F56]/5"
                                                : "border-lime/30 text-lime bg-lime/5"
                                        }`}
                                    >
                                        <span className="text-[9px] tracking-[0.2em] mr-2 opacity-60">{ev.side === "red" ? "ATTACK" : "DEFEND"}</span>
                                        {ev.text}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10 divide-x divide-white/10">
                        {STATS.map((s) => (
                            <div key={s.label} data-testid={s.testId} className="p-5 md:p-6 text-center">
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
