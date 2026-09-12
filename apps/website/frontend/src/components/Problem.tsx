import { Reveal, Tag, SectionShell } from "./shared";

const ProblemCard = ({ title, children, accent = false, className = "", testId }: any) => (
    <div data-testid={testId} className={`border border-white/10 p-8 flex flex-col ${accent ? "bg-black/90" : "bg-panel"} ${className}`}>
        <h3 className="font-display font-bold uppercase text-2xl text-fog mb-4">{title}</h3>
        <p className="text-ash text-sm leading-relaxed">{children}</p>
    </div>
);

const Problem = () => (
    <SectionShell id="problem" className="bg-ink">
        <Reveal>
            <Tag>THE PROBLEM</Tag>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8 max-w-3xl">
                Cybersecurity is fundamentally <span className="text-ash">broken.</span>
            </h2>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-8 mt-16 items-start">
            <Reveal delay={0.1}>
                <ProblemCard title="Too Slow" testId="prob-1" className="lg:mt-12">
                    Modern development ships code multiple times a day. Traditional penetration testing happens once a year. By the time a vulnerability is found, the attack surface has already changed.
                </ProblemCard>
            </Reveal>
            <Reveal delay={0.2}>
                <ProblemCard title="Too Noisy" testId="prob-2" accent>
                    Security teams are overwhelmed by false positives from static analysis tools. Developers spend more time triaging inaccurate alerts than writing secure code.
                </ProblemCard>
            </Reveal>
            <Reveal delay={0.3}>
                <ProblemCard title="Too Manual" testId="prob-3" className="lg:mt-24">
                    Finding a vulnerability is only half the problem. Writing, testing, and deploying the fix requires human intervention, causing critical delays in remediation.
                </ProblemCard>
            </Reveal>
        </div>
    </SectionShell>
);

export default Problem;
