import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { AGENTS } from "@/data/siteData";
import { Reveal, Tag, SectionShell } from "./shared";

const riskColor = (r: string) => (r === "HIGH" ? "text-[#FF5F56]" : r === "MEDIUM" ? "text-[#FFB020]" : "text-lime");

// Cybernetic text scramble effect for hover
const ScrambleText = ({ text, isHovered }: { text: string, isHovered: boolean }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

    useEffect(() => {
        if (!isHovered) {
            setDisplay(text);
            return;
        }
        let iter = 0;
        const interval = setInterval(() => {
            setDisplay(t => t.split("").map((letter, index) => {
                if (index < iter) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));
            if (iter >= text.length) clearInterval(interval);
            iter += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [isHovered, text]);

    return <span>{display}</span>;
};

const AgentCard = ({ a }: any) => (
    <div className="w-56 border-l-2 border-lime bg-black/90 backdrop-blur-md p-4 space-y-3 shadow-[10px_0_30px_rgba(183,255,0,0.1)]">
        <div>
            <p className="font-display text-xs tracking-widest text-lime/50 uppercase mb-1">Agent Details</p>
            <p className="font-display text-base font-bold text-white tracking-tight uppercase">{a.name}</p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-lime/50 to-transparent" />
        <div className="font-mono text-[10px] tracking-wider space-y-2">
            <div className="flex justify-between">
                <span className="text-ash">STATUS:</span> <span className="text-lime">{a.status}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-ash">ROLE:</span> <span className="text-fog truncate ml-2">{a.role}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-ash">TARGET:</span> <span className="text-fog">{a.target}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-ash">RISK:</span> <span className={riskColor(a.risk)}>{a.risk}</span>
            </div>
        </div>
        <div className="pt-2">
            <div className="flex justify-between font-mono text-[9px] text-ash mb-1">
                <span>SYSTEM CONFIDENCE</span>
                <span className="text-lime animate-pulse">{a.confidence}%</span>
            </div>
            <div className="h-1 bg-white/10 overflow-hidden">
                <div className="h-full bg-lime relative" style={{ width: `${a.confidence}%` }}>
                    <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite]" />
                </div>
            </div>
        </div>
    </div>
);

const Agents = () => {
    const [selected, setSelected] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pulsesRef = useRef<(SVGPathElement | null)[]>([]);
    const bgLinesRef = useRef<(SVGPathElement | null)[]>([]);
    const coreRef = useRef<HTMLDivElement>(null);
    const nodesGroupRef = useRef<HTMLDivElement>(null);

    // Parallax mouse effect
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || !coreRef.current || !nodesGroupRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Move Core slightly
        gsap.to(coreRef.current, { x: x * 20, y: y * 20, duration: 1, ease: "power2.out" });

        // Move Outer Nodes in opposite direction for depth
        gsap.to(nodesGroupRef.current, { x: x * -15, y: y * -15, duration: 1.5, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
        if (!coreRef.current || !nodesGroupRef.current) return;
        gsap.to([coreRef.current, nodesGroupRef.current], { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
    };

    useEffect(() => {
        // Continuous data packet pulses shooting to nodes
        pulsesRef.current.forEach((pulse, i) => {
            if (!pulse) return;
            const length = pulse.getTotalLength();
            gsap.set(pulse, { strokeDasharray: `8 ${length}`, strokeDashoffset: length });

            gsap.to(pulse, {
                strokeDashoffset: 0,
                duration: 1.5 + Math.random() * 2,
                repeat: -1,
                ease: "power1.inOut",
                delay: Math.random() * 2
            });
        });

        // Background lines subtle drawing animation
        bgLinesRef.current.forEach((line) => {
            if (!line) return;
            const length = line.getTotalLength();
            gsap.fromTo(line,
                { strokeDasharray: length, strokeDashoffset: length },
                { strokeDashoffset: 0, duration: 2, ease: "power3.inOut" }
            );
        });
    }, []);

    // Helper for highly organic cubic bezier curves (S-Curve)
    const generateSCurve = (x: number, y: number) => {
        const dx = x - 50;
        const dy = y - 50;
        const controlOffset = 25; // How intense the S-curve is

        // Use horizontal dominant tangents for a "tech tree" look
        const cx1 = 50 + (Math.abs(dx) > Math.abs(dy) ? controlOffset * Math.sign(dx) : 0);
        const cy1 = 50 + (Math.abs(dy) > Math.abs(dx) ? controlOffset * Math.sign(dy) : 0);

        const cx2 = x - (Math.abs(dx) > Math.abs(dy) ? controlOffset * Math.sign(dx) : 0);
        const cy2 = y - (Math.abs(dy) > Math.abs(dx) ? controlOffset * Math.sign(dy) : 0);

        return `M 50 50 C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    };

    // Pure SVG Hexagon shape points
    const hexPoints = "50,2 98,26 98,74 50,98 2,74 2,26";

    return (
        <SectionShell id="agents" className="bg-[#020202] overflow-hidden">
            <Reveal>
                <Tag>AUTONOMOUS SWARM</Tag>
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8">
                    One AI <span className="text-ash">isn't enough.</span>
                </h2>
                <p className="text-ash text-base md:text-lg mt-6 max-w-xl">
                    Six specialized agents operate as one hive-mind security organism — calculating, attacking, and healing in parallel.
                </p>
            </Reveal>

            <Reveal delay={0.15}>
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    data-testid="agent-constellation"
                    className="relative hidden lg:block aspect-[16/10] max-w-5xl mx-auto mt-20 perspective-1000"
                >

                    {/* SVG Connections & Data Streams */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        {/* High-tech core spinning rings */}
                        <g className="origin-center animate-[spin_20s_linear_infinite]">
                            <circle cx="50" cy="50" r="4" fill="none" stroke="#B7FF00" strokeWidth="0.1" strokeDasharray="1 1" opacity="0.6" />
                            <circle cx="50" cy="50" r="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.05" strokeDasharray="3 2" />
                            <circle cx="50" cy="50" r="8" fill="none" stroke="#B7FF00" strokeWidth="0.02" opacity="0.3" />
                        </g>

                        {AGENTS.map((a, i) => {
                            const isHovered = selected === a.id;
                            const curve = generateSCurve(a.pos.x, a.pos.y);
                            return (
                                <g key={`path-${a.id}`}>
                                    {/* Base Circuit Wire */}
                                    <path
                                        ref={el => { bgLinesRef.current[i] = el; }}
                                        d={curve}
                                        fill="none"
                                        stroke={isHovered ? "rgba(183,255,0,0.5)" : "rgba(255,255,255,0.08)"}
                                        strokeWidth={isHovered ? "0.4" : "0.1"}
                                        style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                                    />

                                    {/* High-speed Traveling Data Pulse */}
                                    <path
                                        ref={el => { pulsesRef.current[i] = el; }}
                                        d={curve}
                                        fill="none"
                                        stroke="#B7FF00"
                                        strokeWidth={isHovered ? "0.8" : "0.2"}
                                        style={{ filter: "drop-shadow(0 0 3px #B7FF00)" }}
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Central Cybernetic Core */}
                    <div ref={coreRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none drop-shadow-[0_0_30px_rgba(183,255,0,0.4)]">
                        <div className="relative w-36 h-36 flex items-center justify-center">

                            {/* Slowly Rotating Outer Hexagon */}
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]">
                                <polygon points={hexPoints} fill="rgba(183,255,0,0.05)" stroke="#B7FF00" strokeWidth="0.5" className="opacity-50" />
                                <polygon points={hexPoints} fill="none" stroke="#B7FF00" strokeWidth="2" strokeDasharray="10 20" />
                            </svg>

                            {/* Inner Static / Glitching Core Layer */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,255,0,0.2)_0%,transparent_60%)]" />

                            {/* Fast Counter-Rotating Inner Hexagon */}
                            <svg viewBox="0 0 100 100" className="absolute w-16 h-16 animate-[spin_8s_linear_infinite_reverse]">
                                <polygon points={hexPoints} fill="none" stroke="#B7FF00" strokeWidth="3" opacity="0.8" />
                            </svg>

                            {/* Center glowing dot */}
                            <div className="w-5 h-5 bg-lime rounded-full shadow-[0_0_20px_#B7FF00] animate-pulse" />
                        </div>
                        <p className="font-mono text-xs tracking-[0.3em] text-white mt-6 font-bold drop-shadow-[0_0_8px_#B7FF00]">SENTINELX CORE</p>
                    </div>

                    {/* Outer Agent Nodes Group (moves together on mouse) */}
                    <div ref={nodesGroupRef} className="absolute inset-0 pointer-events-none">
                        {AGENTS.map((a) => {
                            const isHovered = selected === a.id;
                            return (
                                <div
                                    key={a.id}
                                    className="absolute z-10 pointer-events-auto"
                                    style={{ left: `${a.pos.x}%`, top: `${a.pos.y}%`, transform: "translate(-50%, -50%)" }}
                                >
                                    <div className="relative group flex flex-col items-center">
                                        <button
                                            data-testid={`agent-node-${a.id}`}
                                            onMouseEnter={() => setSelected(a.id)}
                                            onMouseLeave={() => setSelected(null)}
                                            className="relative flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-110"
                                        >
                                            {/* Hexagon Node */}
                                            <div className="relative w-20 h-20 flex items-center justify-center transition-all duration-300 group-hover:drop-shadow-[0_0_15px_#B7FF00]">
                                                {/* SVG Hexagon Shape */}
                                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-0 transition-transform duration-300">
                                                    <polygon
                                                        points={hexPoints}
                                                        fill={isHovered ? "#B7FF00" : "rgba(10,10,10,0.9)"}
                                                        stroke={isHovered ? "#B7FF00" : "rgba(255,255,255,0.4)"}
                                                        strokeWidth={isHovered ? "2" : "1"}
                                                        className="transition-all duration-300"
                                                    />
                                                </svg>

                                                <span className={`relative z-10 font-mono text-sm font-bold tracking-widest transition-colors duration-300 ${isHovered ? 'text-black' : 'text-white/80'}`}>
                                                    {isHovered ? 'RUN' : a.short}
                                                </span>
                                            </div>

                                            {/* Scrambled Name Tag */}
                                            <div className={`font-mono text-[9px] tracking-[0.2em] whitespace-nowrap px-2 py-1 bg-black/60 backdrop-blur-md rounded border transition-colors duration-300 ${isHovered ? "text-lime border-lime/40 drop-shadow-[0_0_5px_rgba(183,255,0,0.5)]" : "text-ash border-transparent"
                                                }`}>
                                                <ScrambleText text={a.name} isHovered={isHovered} />
                                            </div>
                                        </button>

                                        {/* Cinematic Holographic Detail Card */}
                                        {isHovered && (
                                            <div
                                                data-testid={`agent-detail-${a.id}`}
                                                className={`absolute z-20 pointer-events-none ${a.pos.x > 50 ? "right-full mr-8" : "left-full ml-8"} ${a.pos.y > 50 ? "bottom-0" : "top-0"}`}
                                            >
                                                <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                                                    <AgentCard a={a} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Fallback */}
                <div className="lg:hidden grid sm:grid-cols-2 gap-4 mt-12 px-4">
                    {AGENTS.map((a) => (
                        <div key={a.id} data-testid={`agent-card-${a.id}`}>
                            <AgentCard a={a} />
                        </div>
                    ))}
                </div>
            </Reveal>
        </SectionShell>
    );
};

export default Agents;
