import { useRef, useState } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { initiateScan } from "@/lib/api";
const STAGES = ["CREATING DIGITAL TWIN", "MAPPING ATTACK SURFACE", "RED TEAM ENGAGED", "VERIFYING EXPLOITS", "GENERATING PATCHES"];

interface ScanResult {
    score: number;
    duration_s: number;
    patches: number;
    findings: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}

const ScanModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [repo, setRepo] = useState("https://github.com/acme/checkout-service");
    const [phase, setPhase] = useState<"idle" | "running" | "done" | "error">("idle");
    const [idx, setIdx] = useState(0);
    const [result, setResult] = useState<ScanResult | null>(null);
    const timer = useRef<NodeJS.Timeout | null>(null);

    if (!open) return null;

    const start = async () => {
        setPhase("running");
        setIdx(0);
        setResult(null);
        timer.current = setInterval(() => setIdx((i) => Math.min(i + 1, STAGES.length - 1)), 950);
        try {
            const data = await initiateScan(repo);
            setTimeout(() => {
                if (timer.current) clearInterval(timer.current);
                setResult(data);
                setPhase("done");
                toast.success("Scan complete — 2 verified exploits patched");
            }, STAGES.length * 950);
        } catch {
            if (timer.current) clearInterval(timer.current);
            setPhase("error");
            toast.error("Scan request failed");
        }
    };

    return (
        <div data-testid="scan-modal" className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={phase === "running" ? undefined : onClose} />
            <div className="relative w-full max-w-lg bg-panel border border-white/15">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <span className="font-mono text-[11px] tracking-[0.25em] text-lime">SENTINELX // AUTONOMOUS SCAN</span>
                    <button data-testid="scan-close-btn" onClick={onClose} disabled={phase === "running"} className="text-ash hover:text-fog transition-colors disabled:opacity-30">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {phase !== "done" && (
                        <>
                            <div>
                                <label className="font-mono text-[10px] tracking-[0.2em] text-ash block mb-2">TARGET REPOSITORY</label>
                                <input
                                    data-testid="scan-repo-input"
                                    value={repo}
                                    onChange={(e) => setRepo(e.target.value)}
                                    disabled={phase === "running"}
                                    className="w-full bg-black border border-white/15 focus:border-lime outline-none px-4 py-3 font-mono text-sm text-fog transition-colors"
                                />
                            </div>
                            {phase === "running" && (
                                <div data-testid="scan-progress" className="space-y-2 font-mono text-xs">
                                    {STAGES.map((s, i) => (
                                        <div key={s} className={`flex items-center gap-3 ${i < idx ? "text-ash" : i === idx ? "text-lime" : "text-ash/30"}`}>
                                            {i < idx ? <ShieldCheck size={13} /> : i === idx ? <Loader2 size={13} className="animate-spin" /> : <span className="w-[13px] h-[13px] border border-white/15 inline-block" />}
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {phase === "idle" && (
                                <button data-testid="scan-submit-btn" onClick={start} className="w-full bg-lime text-black font-mono text-xs font-bold tracking-[0.2em] py-4 hover:bg-[#cfff4d] transition-colors">
                                    INITIATE AUTONOMOUS SCAN
                                </button>
                            )}
                            {phase === "error" && <p className="font-mono text-xs text-[#FF5F56]">SCAN FAILED — CHECK BACKEND CONNECTION</p>}
                        </>
                    )}

                    {phase === "done" && result && (
                        <div data-testid="scan-result" className="space-y-5">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="font-mono text-[10px] tracking-[0.2em] text-ash mb-1">SECURITY SCORE</p>
                                    <p className="font-display text-5xl font-bold text-lime">{result.score}<span className="text-ash text-xl">/100</span></p>
                                </div>
                                <p className="font-mono text-[10px] text-ash">DURATION {result.duration_s}S · TWIN ISOLATED</p>
                            </div>
                            <div className="grid grid-cols-4 border border-white/10 divide-x divide-white/10 text-center">
                                {[["CRITICAL", result.findings.critical, "text-[#FF5F56]"], ["HIGH", result.findings.high, "text-[#FFB020]"], ["MEDIUM", result.findings.medium, "text-fog"], ["LOW", result.findings.low, "text-ash"]].map(([l, v, c]) => (
                                    <div key={l} className="py-3">
                                        <p className={`font-display text-2xl font-bold ${c}`}>{String(v).padStart(2, "0")}</p>
                                        <p className="font-mono text-[9px] tracking-[0.2em] text-ash mt-1">{l}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="font-mono text-xs text-ash">{result.patches} PATCHES GENERATED AND VALIDATED INSIDE THE DIGITAL TWIN.</p>
                            <button
                                data-testid="scan-report-btn"
                                onClick={() => {
                                    onClose();
                                    document.querySelector("#dashboard")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="w-full border border-lime text-lime font-mono text-xs font-bold tracking-[0.2em] py-4 hover:bg-lime hover:text-black transition-colors"
                            >
                                OPEN SECURITY REPORT →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanModal;
