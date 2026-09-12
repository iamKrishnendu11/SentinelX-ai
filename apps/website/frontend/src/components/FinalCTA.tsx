import { ArrowRight } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import { Reveal, PrimaryButton, GhostButton } from "./shared";

const FinalCTA = ({ onScan }: any) => (
    <section data-testid="final-cta" className="relative border-t border-white/10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-lime/[0.06] blur-[140px] rounded-full pointer-events-none" />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 py-28 md:py-40 text-center">
            <Reveal>
                <p className="font-mono text-[11px] tracking-[0.3em] text-lime">DON'T JUST DETECT THREATS — PREDICT, FIGHT, HEAL</p>
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl sm:text-5xl md:text-7xl mt-8">
                    The next attack <br />
                    should find <br />
                    <span className="text-lime text-glow">a stronger wall.</span>
                </h2>
                <p className="text-ash text-base md:text-lg mt-8 max-w-xl mx-auto">
                    SentinelX AI continuously discovers, verifies, fixes and predicts application security threats.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-12">
                    <PrimaryButton testId="final-scan-btn" onClick={onScan}>
                        START SECURITY SCAN <ArrowRight size={14} />
                    </PrimaryButton>
                    <GhostButton testId="final-github-btn" href="https://github.com">
                        <Github size={14} /> VIEW GITHUB
                    </GhostButton>
                </div>
            </Reveal>
        </div>
    </section>
);

export default FinalCTA;
