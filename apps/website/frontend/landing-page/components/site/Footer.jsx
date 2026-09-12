const LINKS = [
    { label: "Platform", href: "#platform" },
    { label: "AI Agents", href: "#agents" },
    { label: "Security", href: "#security" },
    { label: "Documentation", href: "#technology" },
    { label: "GitHub", href: "https://github.com" },
];

const Footer = () => (
    <footer data-testid="footer" className="border-t border-white/10 bg-panel">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-14">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 bg-lime" />
                        <span className="font-display font-bold tracking-tight text-sm">
                            SENTINELX <span className="text-lime">AI</span>
                        </span>
                    </div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-ash mt-4">AUTONOMOUS APPLICATION SECURITY</p>
                </div>
                <nav className="flex flex-wrap gap-x-8 gap-y-3">
                    {LINKS.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                            className="font-mono text-[11px] tracking-[0.15em] text-ash hover:text-lime transition-colors uppercase"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
            </div>
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[10px] tracking-wider text-ash/60">
                <span>© 2026 SENTINELX AI</span>
                <span>DISCOVER → SIMULATE → VERIFY → HEAL → PREDICT</span>
            </div>
        </div>
    </footer>
);

export default Footer;
