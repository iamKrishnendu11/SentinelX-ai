import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { LOOP_STAGES } from "../../data/siteData";
import { Reveal, Tag, SectionShell } from "./shared";

const Loop = () => {
    const [active, setActive] = useState(LOOP_STAGES[2]);

    return (
        <SectionShell id="platform" className="bg-panel/40">
            <Reveal>
                <Tag>THE SENTINELX APPROACH</Tag>
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8 max-w-4xl">
                    We built security <br />
                    <span className="text-ash">as an</span> autonomous loop.
                </h2>
            </Reveal>

            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 mt-16">
                <Reveal className="space-y-0">
                    {LOOP_STAGES.map((s, i) => (
                        <div key={s.id}>
                            <button
                                data-testid={`loop-stage-${s.id}`}
                                onClick={() => setActive(s)}
                                className={`w-full text-left flex items-baseline gap-6 px-5 py-4 border-l-2 transition-colors ${
                                    active.id === s.id
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
                    <div data-testid="loop-info-panel" className="lg:sticky lg:top-28 border border-white/10 bg-ink p-8 md:p-12 min-h-[340px] flex flex-col">
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
    );
};

export default Loop;
