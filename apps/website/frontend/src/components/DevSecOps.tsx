import { ArrowDown, ArrowRight, Check, GitPullRequest } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import { DEVOPS_STEPS } from "@/data/siteData";
import { Reveal, Tag, SectionShell, GhostButton } from "./shared";

const DevSecOps = () => (
    <SectionShell id="devsecops" className="bg-panel/40">
        <Reveal>
            <Tag>DEVSECOPS</Tag>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8">
                Security that moves <span className="text-ash">with your code.</span>
            </h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 mt-16 items-start">
            <Reveal>
                <div data-testid="devops-flow" className="border border-white/10 bg-ink p-8">
                    {DEVOPS_STEPS.map((s, i) => {
                        const highlight = s === "SentinelX AI" || s === "AI Patch";
                        return (
                            <div key={s}>
                                <div
                                    className={`flex items-center gap-4 px-5 py-3.5 border ${
                                        highlight ? "border-lime/50 bg-lime/5" : "border-white/10 bg-panel"
                                    }`}
                                >
                                    <span className="font-mono text-[10px] text-ash w-6">{String(i + 1).padStart(2, "0")}</span>
                                    <span className={`font-mono text-xs tracking-wider ${highlight ? "text-lime" : "text-fog"}`}>{s}</span>
                                    {s === "GitHub Actions" && <Github size={14} className="text-ash ml-auto" />}
                                    {s === "Pull Request" && <GitPullRequest size={14} className="text-ash ml-auto" />}
                                </div>
                                {i < DEVOPS_STEPS.length - 1 && (
                                    <div className="pl-9 py-0.5 text-white/20">
                                        <ArrowDown size={13} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Reveal>

            <Reveal delay={0.15}>
                <div data-testid="devops-pr-card" className="border border-white/10 bg-ink">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <GitPullRequest size={16} className="text-lime" />
                        <div>
                            <p className="font-mono text-xs text-fog">SENTINELX AI — Security Patch #128</p>
                            <p className="font-mono text-[10px] text-ash mt-0.5">sentinelx-bot wants to merge 2 commits into main</p>
                        </div>
                        <span className="ml-auto font-mono text-[9px] tracking-[0.2em] text-lime border border-lime/40 px-2 py-1">AUTO-GENERATED</span>
                    </div>
                    <div className="p-6 space-y-3 font-mono text-xs">
                        {["Vulnerability fixed", "Exploit verified in Digital Twin", "Regression tests passed — 148/148"].map((t) => (
                            <p key={t} className="flex items-center gap-3 text-fog">
                                <span className="w-5 h-5 border border-lime/50 bg-lime/10 flex items-center justify-center">
                                    <Check size={12} className="text-lime" />
                                </span>
                                {t}
                            </p>
                        ))}
                        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-ash text-[10px]">api/users.js · +2 -1</span>
                            <span className="bg-lime text-black font-bold text-[10px] tracking-[0.15em] px-3 py-1.5">MERGED</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <GhostButton testId="devops-pipeline-btn" href="#dashboard">
                        VIEW SECURITY PIPELINE <ArrowRight size={14} />
                    </GhostButton>
                </div>
            </Reveal>
        </div>
    </SectionShell>
);

export default DevSecOps;
