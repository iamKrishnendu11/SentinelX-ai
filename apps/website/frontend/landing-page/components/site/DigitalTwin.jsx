import { motion } from "framer-motion";
import { Globe, Database, KeyRound, Boxes, Server, Radar, ArrowRight } from "lucide-react";
import { Reveal, Tag, SectionShell } from "./shared";

const REAL_NODES = [
    { icon: Globe, label: "Web App" },
    { icon: Server, label: "API Gateway" },
    { icon: Database, label: "Postgres" },
    { icon: KeyRound, label: "Auth Service" },
];

const TWIN_NODES = [
    { icon: Globe, label: "APIs" },
    { icon: Database, label: "Database" },
    { icon: KeyRound, label: "Authentication" },
    { icon: Boxes, label: "Dependencies" },
    { icon: Server, label: "Services" },
    { icon: Radar, label: "Attack Surface" },
];

const NodeChip = ({ icon: Icon, label, twin }) => (
    <div className={`flex items-center gap-3 border px-4 py-3 ${twin ? "border-lime/25 bg-black/40" : "border-white/12 bg-panel"}`}>
        <Icon size={15} className={twin ? "text-lime" : "text-ash"} />
        <span className="font-mono text-[11px] tracking-wider text-fog">{label}</span>
    </div>
);

const DigitalTwin = () => (
    <SectionShell id="how-it-works" className="bg-ink">
        <Reveal>
            <Tag>DIGITAL TWIN SECURITY</Tag>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mt-8">
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl">
                    Attack the twin. <br />
                    <span className="text-lime">Not production.</span>
                </h2>
                <p className="text-ash text-base md:text-lg max-w-md leading-relaxed">
                    SentinelX creates an isolated Digital Twin of your application where AI agents can safely simulate attacks without affecting your live environment.
                </p>
            </div>
        </Reveal>

        <Reveal delay={0.15}>
            <div className="relative grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-stretch mt-16">
                <div data-testid="twin-real-app" className="border border-white/10 bg-panel p-8">
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-mono text-[11px] tracking-[0.25em] text-fog">REAL APPLICATION</span>
                        <span className="flex items-center gap-2 font-mono text-[10px] text-ash">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" /> LIVE
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {REAL_NODES.map((n) => (
                            <NodeChip key={n.label} {...n} />
                        ))}
                    </div>
                    <p className="font-mono text-[10px] text-ash mt-8 tracking-wider">TRAFFIC: 4.2K REQ/MIN · USERS UNAFFECTED</p>
                </div>

                <div className="flex lg:flex-col items-center justify-center gap-3">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-ash hidden lg:block">STATE SYNC</span>
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-2 h-2 bg-lime hidden lg:block"
                            animate={{ opacity: [0.15, 1, 0.15], y: [0, 6, 0] }}
                            transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
                        />
                    ))}
                    <ArrowRight size={20} className="text-lime lg:rotate-0 rotate-0 animate-flow-x lg:animate-none" />
                </div>

                <div data-testid="twin-environment" className="relative border border-dashed border-lime/40 bg-[#0A0D08] p-8 overflow-hidden">
                    <span
                        data-testid="twin-isolated-badge"
                        className="absolute top-4 right-4 font-mono text-[9px] tracking-[0.25em] text-lime border border-lime/40 px-2.5 py-1.5 bg-black/50"
                    >
                        ISOLATED ENVIRONMENT
                    </span>
                    <div className="mb-8">
                        <span className="font-mono text-[11px] tracking-[0.25em] text-lime">DIGITAL TWIN</span>
                        <p className="font-mono text-[10px] text-ash mt-2">SANDBOX REPLICA · NO PRODUCTION ACCESS</p>
                    </div>
                    <div className="relative grid grid-cols-2 gap-3">
                        {[0, 1].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute -left-8 w-6 h-[2px] bg-[#FF5F56]"
                                style={{ top: `${22 + i * 40}%` }}
                                animate={{ x: [0, 30], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.6, delay: i * 0.7, repeat: Infinity, ease: "easeIn" }}
                            />
                        ))}
                        {TWIN_NODES.map((n) => (
                            <NodeChip key={n.label} {...n} twin />
                        ))}
                    </div>
                    <p className="font-mono text-[10px] text-ash mt-8 tracking-wider">
                        <span className="text-[#FF5F56]">ATTACK VECTORS: 3 ACTIVE</span> · CONTAINED IN TWIN
                    </p>
                </div>
            </div>
        </Reveal>
    </SectionShell>
);

export default DigitalTwin;
