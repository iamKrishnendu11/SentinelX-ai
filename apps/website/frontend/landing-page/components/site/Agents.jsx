import { useState } from "react";
import { motion } from "framer-motion";
import { AGENTS } from "../../data/siteData";
import { Reveal, Tag, SectionShell } from "./shared";

const riskColor = (r) => (r === "HIGH" ? "text-[#FF5F56]" : r === "MEDIUM" ? "text-[#FFB020]" : "text-lime");

const AgentCard = ({ a }) => (
    <div className="w-56 border border-lime/30 bg-black/90 backdrop-blur p-4 space-y-2 pointer-events-none">
        <p className="font-display text-sm font-bold text-lime tracking-tight">{a.name}</p>
        <p className="text-ash text-xs">{a.role}</p>
        <div className="font-mono text-[10px] tracking-wider space-y-1 pt-1">
            <p className="text-ash">STATUS: <span className="text-lime">{a.status}</span></p>
            <p className="text-ash">TASK: <span className="text-fog">{a.task}</span></p>
            <p className="text-ash">TARGET: <span className="text-fog">{a.target}</span></p>
            <p className="text-ash">RISK: <span className={riskColor(a.risk)}>{a.risk}</span></p>
        </div>
        <div>
            <div className="flex justify-between font-mono text-[9px] text-ash mb-1">
                <span>CONFIDENCE</span>
                <span className="text-lime">{a.confidence}%</span>
            </div>
            <div className="h-1 bg-white/10">
                <div className="h-full bg-lime" style={{ width: `${a.confidence}%` }} />
            </div>
        </div>
    </div>
);

const Agents = () => {
    const [selected, setSelected] = useState(null);

    return (
        <SectionShell id="agents" className="bg-panel/40">
            <Reveal>
                <Tag>MULTI-AGENT AI</Tag>
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8">
                    One AI <span className="text-ash">isn't enough.</span>
                </h2>
                <p className="text-ash text-base md:text-lg mt-6 max-w-xl">
                    Six specialized agents operate as one autonomous security organism — coordinated by the SentinelX Core.
                </p>
            </Reveal>

            <Reveal delay={0.15}>
                <div data-testid="agent-constellation" className="relative hidden lg:block aspect-[16/10] max-w-4xl mx-auto mt-16">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                        {AGENTS.map((a) => (
                            <motion.line
                                key={a.id}
                                x1="50"
                                y1="50"
                                x2={a.pos.x}
                                y2={a.pos.y}
                                stroke="rgba(183,255,0,0.18)"
                                strokeWidth="0.2"
                                strokeDasharray="1.4 1.2"
                                animate={{ strokeDashoffset: [0, -5.2] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                            />
                        ))}
                    </svg>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                        <motion.div
                            className="w-24 h-24 border border-lime/50 bg-black flex items-center justify-center lime-glow"
                            animate={{ boxShadow: ["0 0 20px rgba(183,255,0,0.15)", "0 0 44px rgba(183,255,0,0.3)", "0 0 20px rgba(183,255,0,0.15)"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <span className="w-3 h-3 bg-lime" />
                        </motion.div>
                        <p className="font-mono text-[10px] tracking-[0.25em] text-fog mt-3">SENTINELX CORE</p>
                    </div>

                    {AGENTS.map((a) => (
                        <div
                            key={a.id}
                            className="absolute z-10"
                            style={{ left: `${a.pos.x}%`, top: `${a.pos.y}%`, transform: "translate(-50%, -50%)" }}
                        >
                            <div className="relative group">
                                <button
                                    data-testid={`agent-node-${a.id}`}
                                    onMouseEnter={() => setSelected(a.id)}
                                    onMouseLeave={() => setSelected(null)}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <span className="w-12 h-12 border border-white/25 group-hover:border-lime bg-panel flex items-center justify-center font-mono text-[10px] tracking-widest text-ash group-hover:text-lime transition-colors">
                                        {a.short}
                                    </span>
                                    <span className="font-mono text-[9px] tracking-[0.2em] text-ash group-hover:text-fog transition-colors whitespace-nowrap">{a.name}</span>
                                </button>
                                {selected === a.id && (
                                    <div data-testid={`agent-detail-${a.id}`} className={`absolute z-20 ${a.pos.x > 60 ? "right-full mr-4" : "left-full ml-4"} ${a.pos.y > 80 ? "bottom-0" : "top-0"}`}>
                                        <AgentCard a={a} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:hidden grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10 mt-12">
                    {AGENTS.map((a) => (
                        <div key={a.id} data-testid={`agent-card-${a.id}`} className="bg-panel p-6">
                            <AgentCard a={a} />
                        </div>
                    ))}
                </div>
            </Reveal>
        </SectionShell>
    );
};

export default Agents;
