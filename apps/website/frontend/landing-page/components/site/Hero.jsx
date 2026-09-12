import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SecurityCore from "./SecurityCore";
import { Tag, PrimaryButton, GhostButton } from "./shared";

const META = ["AI-POWERED", "DIGITAL TWIN", "MULTI-AGENT", "SELF-HEALING"];

const Hero = ({ onScan }) => (
    <section id="top" data-testid="hero-section" className="relative bg-grid overflow-hidden">
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-lime/[0.04] blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-36 pb-24 md:pt-44 md:pb-32 grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <Tag>AUTONOMOUS APPLICATION SECURITY</Tag>
                </motion.div>
                <motion.h1
                    data-testid="hero-headline"
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="font-display font-bold uppercase tracking-tight leading-[0.95] text-5xl md:text-6xl lg:text-7xl mt-8"
                >
                    Your code.
                    <br />
                    Our AI.
                    <br />
                    <span className="text-lime text-glow">Zero blind spots.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.22 }}
                    className="text-ash text-base md:text-lg mt-8 max-w-md leading-relaxed"
                >
                    SentinelX AI continuously attacks, analyzes and hardens your application before real attackers do.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.34 }}
                    className="flex flex-wrap gap-4 mt-10"
                >
                    <PrimaryButton testId="hero-scan-btn" onClick={onScan}>
                        SCAN YOUR PROJECT <ArrowRight size={14} />
                    </PrimaryButton>
                    <GhostButton testId="hero-explore-btn" href="#platform">
                        EXPLORE THE ENGINE
                    </GhostButton>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="flex flex-wrap gap-x-6 gap-y-2 mt-12 font-mono text-[10px] tracking-[0.25em] text-ash"
                >
                    {META.map((m, i) => (
                        <span key={m} data-testid={`hero-meta-${i}`} className="flex items-center gap-6">
                            {m}
                            {i < META.length - 1 && <span className="text-lime/50 hidden sm:inline">+</span>}
                        </span>
                    ))}
                </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.2 }}>
                <SecurityCore />
            </motion.div>
        </div>
    </section>
);

export default Hero;
