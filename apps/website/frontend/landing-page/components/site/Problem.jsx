import { motion } from "framer-motion";

const NODE_ANGLES = [0, 60, 120, 180, 240, 300];
const ATTACKS = [
    { angle: 205, delay: 0 },
    { angle: 320, delay: 1.1 },
    { angle: 90, delay: 2.2 },
    { angle: 155, delay: 3.1 },
];

const rad = (a) => (a * Math.PI) / 180;
const pt = (r, a) => ({ x: 200 + r * Math.cos(rad(a)), y: 200 + r * Math.sin(rad(a)) });

const StatusChip = ({ label, value, accent, className, testId }) => (
    <div
        data-testid={testId}
        className={`absolute font-mono text-[10px] tracking-[0.15em] border border-white/10 bg-black/60 backdrop-blur px-3 py-2 whitespace-nowrap ${className}`}
    >
        <span className="text-ash">{label}: </span>
        <span className={accent ? "text-lime" : "text-fog"}>{value}</span>
    </div>
);

const SecurityCore = () => (
    <div data-testid="security-core" className="relative aspect-square w-full max-w-[520px] mx-auto">
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <radialGradient id="coreGlow">
                    <stop offset="0%" stopColor="#B7FF00" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#B7FF00" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#B7FF00" stopOpacity="0" />
                </radialGradient>
            </defs>

            <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255,255,255,0.05)" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.05)" />

            <motion.g style={{ originX: "0.5", originY: "0.5" }} animate={{ rotate: 360 }} transition={{ duration: 70, ease: "linear", repeat: Infinity }}>
                <circle cx="200" cy="200" r="182" fill="none" stroke="rgba(255,255,255,0.14)" strokeDasharray="2 10" />
                {NODE_ANGLES.map((a) => {
                    const p = pt(182, a);
                    return <rect key={a} x={p.x - 3} y={p.y - 3} width="6" height="6" fill="#050505" stroke="rgba(255,255,255,0.45)" />;
                })}
            </motion.g>

            <motion.g style={{ originX: "0.5", originY: "0.5" }} animate={{ rotate: -360 }} transition={{ duration: 46, ease: "linear", repeat: Infinity }}>
                <circle cx="200" cy="200" r="126" fill="none" stroke="rgba(255,255,255,0.1)" />
                {NODE_ANGLES.map((a) => {
                    const p = pt(126, a);
                    return (
                        <g key={a}>
                            <line x1="200" y1="200" x2={p.x} y2={p.y} stroke="rgba(183,255,0,0.12)" />
                            <circle cx={p.x} cy={p.y} r="5" fill="#0D0F0D" stroke="#B7FF00" strokeWidth="1.2" />
                            <circle cx={p.x} cy={p.y} r="1.8" fill="#B7FF00" />
                        </g>
                    );
                })}
            </motion.g>

            <motion.g style={{ originX: "0.5", originY: "0.5" }} animate={{ rotate: 360 }} transition={{ duration: 26, ease: "linear", repeat: Infinity }}>
                <circle cx="200" cy="200" r="82" fill="none" stroke="rgba(183,255,0,0.4)" strokeDasharray="26 14" />
            </motion.g>
            <circle cx="200" cy="200" r="64" fill="none" stroke="rgba(183,255,0,0.18)" />

            {ATTACKS.map(({ angle, delay }) => {
                const from = pt(196, angle);
                const to = pt(88, angle);
                return (
                    <g key={angle}>
                        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(255,95,86,0.18)" strokeDasharray="3 5" />
                        <motion.circle
                            r="3.5"
                            fill="#FF5F56"
                            initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                            animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1.6, ease: "easeIn" }}
                        />
                        <motion.circle
                            r="7"
                            fill="none"
                            stroke="#B7FF00"
                            initial={{ cx: to.x, cy: to.y, opacity: 0 }}
                            animate={{ opacity: [0, 0, 0.8, 0], r: [4, 4, 12, 16] }}
                            transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1.6, ease: "easeOut" }}
                        />
                    </g>
                );
            })}

            <motion.circle
                cx="200"
                cy="200"
                r="46"
                fill="url(#coreGlow)"
                animate={{ scale: [1, 1.18, 1] }}
                style={{ originX: "0.5", originY: "0.5" }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="200" cy="200" r="15" fill="#B7FF00" />
            <circle cx="200" cy="200" r="15" fill="none" stroke="rgba(183,255,0,0.5)" strokeWidth="4" strokeDasharray="70 24" />
        </svg>

        <StatusChip testId="core-status" label="SYSTEM STATUS" value="PROTECTED" accent className="top-2 left-0" />
        <StatusChip testId="core-agents" label="AGENTS" value="06 ACTIVE" className="top-10 right-0" />
        <StatusChip testId="core-threats" label="THREATS" value="03 ANALYZED" className="bottom-10 left-0" />
        <StatusChip testId="core-risk" label="RISK SCORE" value="12%" accent className="bottom-2 right-0" />
    </div>
);

export default SecurityCore;
