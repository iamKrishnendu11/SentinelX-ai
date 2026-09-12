import { ArrowRight, Check } from "lucide-react";
import { Reveal, Tag, SectionShell, PrimaryButton } from "./shared";

const COLS = [
    {
        label: "VULNERABILITY",
        title: "SQL Injection",
        testId: "heal-vulnerability",
        body: (
            <div className="space-y-2 font-mono text-xs">
                <p className="text-ash">SEVERITY: <span className="text-[#FF5F56]">CRITICAL</span></p>
                <p className="text-ash">LOCATION: <span className="text-fog">api/users.js:42</span></p>
                <p className="text-ash">EXPLOIT: <span className="text-fog">VERIFIED IN TWIN</span></p>
            </div>
        ),
    },
    {
        label: "AI PATCH",
        title: "Parameterized Query",
        testId: "heal-patch",
        body: (
            <div className="space-y-2 font-mono text-xs">
                <p className="text-ash">SOURCE: <span className="text-lime">GENERATED AUTOMATICALLY</span></p>
                <p className="text-ash">MODEL: <span className="text-fog">patch-agent · llama-3.2</span></p>
                <p className="text-ash">HUMAN REVIEW: <span className="text-fog">OPTIONAL</span></p>
            </div>
        ),
    },
    {
        label: "VALIDATION",
        title: "Exploit Blocked",
        testId: "heal-validation",
        body: (
            <div className="space-y-2 font-mono text-xs">
                <p className="flex items-center gap-2 text-ash"><Check size={12} className="text-lime" /> EXPLOIT REPLAY: BLOCKED</p>
                <p className="flex items-center gap-2 text-ash"><Check size={12} className="text-lime" /> REGRESSION TESTS: 148/148</p>
                <p className="flex items-center gap-2 text-ash"><Check size={12} className="text-lime" /> PERFORMANCE: NO DELTA</p>
            </div>
        ),
    },
];

const DIFF = [
    { t: "-", code: `const query = "SELECT * FROM users WHERE id = '" + req.params.id + "'";`, cls: "diff-del" },
    { t: "+", code: `const query = "SELECT * FROM users WHERE id = $1";`, cls: "diff-add" },
    { t: "+", code: `const result = await db.query(query, [req.params.id]);`, cls: "diff-add" },
    { t: " ", code: `await audit.log(req.user, "profile.view");`, cls: "diff-ctx" },
    { t: " ", code: `return res.json(result.rows[0]);`, cls: "diff-ctx" },
];

const SelfHealing = ({ onScan }) => (
    <SectionShell id="security" className="bg-panel/40">
        <Reveal>
            <Tag>SELF-HEALING PATCHES</Tag>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8">
                Find it. Fix it. <span className="text-lime">Prove it.</span>
            </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-16">
            {COLS.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.15} className="h-full">
                    <div data-testid={c.testId} className="bg-panel p-8 h-full flex flex-col">
                        <p className={`font-mono text-[10px] tracking-[0.25em] ${i === 0 ? "text-[#FF5F56]" : "text-lime"}`}>{c.label}</p>
                        <h3 className="font-display text-2xl font-bold tracking-tight mt-4">{c.title}</h3>
                        <div className="mt-6">{c.body}</div>
                    </div>
                </Reveal>
            ))}
        </div>

        <Reveal delay={0.2}>
            <div data-testid="heal-diff" className="mt-10 border border-white/10 bg-black">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-ash">PATCH #128 — api/users.js</span>
                    <span className="font-mono text-[10px] text-lime">+2 -1</span>
                </div>
                <pre className="p-5 overflow-x-auto font-mono text-xs md:text-sm leading-7">
                    {DIFF.map((l, i) => (
                        <div key={i} className={`px-3 -mx-3 flex gap-4 ${l.cls}`}>
                            <span className="select-none w-4 shrink-0">{l.t}</span>
                            <code>{l.code}</code>
                        </div>
                    ))}
                </pre>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-8">
                <p className="text-ash text-sm max-w-lg">Every patch is tested inside the Digital Twin before being recommended.</p>
                <PrimaryButton testId="heal-generate-patch-btn" onClick={onScan}>
                    GENERATE SECURE PATCH <ArrowRight size={14} />
                </PrimaryButton>
            </div>
        </Reveal>
    </SectionShell>
);

export default SelfHealing;
