import { useEffect, useState } from "react";
import { Github, Menu, X } from "lucide-react";

const LINKS = [
    { label: "Platform", href: "#platform" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "AI Agents", href: "#agents" },
    { label: "Security", href: "#security" },
    { label: "Documentation", href: "#technology" },
];

const Navbar = ({ onScan }) => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <header
                data-testid="navbar"
                className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
                    scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10" : "bg-ink border-b border-transparent"
                }`}
            >
                <div className="mx-auto max-w-[1400px] px-6 md:px-12 h-16 flex items-center justify-between">
                    <a href="#top" data-testid="nav-logo" className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 bg-lime lime-glow" />
                        <span className="font-display font-bold tracking-tight text-sm">
                            SENTINELX <span className="text-lime">AI</span>
                        </span>
                    </a>

                    <nav className="hidden lg:flex items-center gap-8">
                        {LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                                className="font-mono text-[11px] tracking-[0.18em] text-ash hover:text-lime transition-colors uppercase"
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            data-testid="nav-github-link"
                            className="text-ash hover:text-lime transition-colors hidden sm:block"
                            aria-label="GitHub"
                        >
                            <Github size={18} />
                        </a>
                        <button
                            data-testid="nav-launch-scanner-btn"
                            onClick={onScan}
                            className="hidden sm:inline-flex bg-lime text-black font-mono text-[11px] font-bold tracking-[0.18em] px-4 py-2.5 hover:bg-[#cfff4d] transition-colors"
                        >
                            LAUNCH SCANNER
                        </button>
                        <button
                            data-testid="nav-mobile-menu-btn"
                            onClick={() => setOpen(!open)}
                            className="lg:hidden text-fog"
                            aria-label="Menu"
                        >
                            {open ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </header>

            {open && (
                <div data-testid="nav-mobile-menu" className="fixed inset-0 z-40 bg-ink pt-24 px-8 lg:hidden">
                    <nav className="flex flex-col gap-6">
                        {LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                                className="font-display text-2xl font-bold uppercase tracking-tight text-fog hover:text-lime transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                        <button
                            data-testid="nav-mobile-scan-btn"
                            onClick={() => {
                                setOpen(false);
                                onScan();
                            }}
                            className="mt-6 bg-lime text-black font-mono text-xs font-bold tracking-[0.2em] px-6 py-4 self-start"
                        >
                            LAUNCH SCANNER
                        </button>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
