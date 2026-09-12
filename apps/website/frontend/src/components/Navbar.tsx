"use client";

import { useEffect, useState } from "react";
import { Shield, Menu, X, ArrowRight, User, LogOut, Server, Download } from "lucide-react";
import { SiGithub as Github } from "react-icons/si";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const LINKS = [
    { label: "Platform", href: "#platform" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "AI Engine", href: "#agents" },
    { label: "Security", href: "#security" },
];

const Navbar = ({ onScan }: any) => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    const [user, setUser] = useState<{email: string} | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    setUser(data.user);
                }
            })
            .catch(() => {})
            .finally(() => setAuthLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        setUserMenuOpen(false);
    };

    const handleLaunch = async () => {
        const res = await fetch('/api/server/launch', { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            alert(data.message + "\n" + data.serverUrl);
        } else {
            alert('Failed to launch server');
        }
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
            setUserMenuOpen(false); // Close menu on scroll
        } else {
            setHidden(false);
        }
        setScrolled(latest > 24);
    });

    return (
        <>
            <motion.div 
                variants={{ visible: { y: 0 }, hidden: { y: "-150%" } }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-4xl flex justify-center pointer-events-none"
            >
                <header
                    data-testid="navbar"
                    className={`pointer-events-auto flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 rounded-full border border-white/12 transition-all duration-300 w-full lg:w-fit lg:gap-12 ${
                        scrolled 
                            ? "bg-[#050505]/85 backdrop-blur-2xl shadow-lg shadow-black/50" 
                            : "bg-[#050505]/70 backdrop-blur-[18px]"
                    }`}
                >
                    <a href="#top" data-testid="nav-logo" className="flex items-center gap-2.5 group">
                        <img src="/logo.png" alt="SentinelX Logo" className="w-5 h-5 object-contain" />
                        <span className="font-display font-bold tracking-tight text-xs sm:text-sm text-[#F5F5F0]">
                            SENTINELX AI
                        </span>
                    </a>

                    <nav className="hidden lg:flex items-center gap-6">
                        {LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                                className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#9CA3AF] hover:text-white transition-colors uppercase"
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
                            className="text-[#9CA3AF] hover:text-white transition-colors hidden sm:block"
                            aria-label="GitHub"
                        >
                            <Github size={16} />
                        </a>

                        {authLoading ? (
                            <div className="hidden sm:block w-20 h-9 bg-white/5 animate-pulse rounded-full" />
                        ) : user ? (
                            <div className="flex items-center gap-3 relative">
                                <button
                                    onClick={handleLaunch}
                                    className="hidden sm:inline-flex items-center gap-2 bg-[#B7FF00] text-[#050505] rounded-full font-mono text-[10px] sm:text-[11px] font-bold tracking-wider px-4 py-2 hover:bg-[#cfff4d] hover:scale-105 transition-all"
                                >
                                    LAUNCH SERVER <Server size={12} />
                                </button>
                                
                                <div className="relative hidden sm:block">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-fog"
                                    >
                                        <User size={16} />
                                    </button>
                                    
                                    {userMenuOpen && (
                                        <div className="absolute top-full right-0 mt-3 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-xs text-ash truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-sm text-fog hover:bg-white/5 hover:text-red-400 transition-colors flex items-center gap-2"
                                            >
                                                <LogOut size={14} /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button
                                data-testid="nav-launch-scanner-btn"
                                onClick={onScan}
                                className="hidden sm:inline-flex items-center gap-2 bg-[#B7FF00] text-[#050505] rounded-full font-mono text-[10px] sm:text-[11px] font-bold tracking-wider px-4 sm:px-5 py-2 sm:py-2.5 hover:bg-[#cfff4d] hover:scale-105 transition-all"
                            >
                                DOWNLOAD NOW <Download size={12} />
                            </button>
                        )}

                        <button
                            data-testid="nav-mobile-menu-btn"
                            onClick={() => setOpen(!open)}
                            className="lg:hidden text-[#9CA3AF] hover:text-white transition-colors"
                            aria-label="Menu"
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </header>
            </motion.div>

            {open && (
                <div data-testid="nav-mobile-menu" className="fixed inset-0 z-40 bg-ink pt-28 px-8 lg:hidden backdrop-blur-md">
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
                        
                        {!authLoading && (user ? (
                            <div className="flex flex-col gap-3 mt-4">
                                <p className="text-xs text-ash mb-2">{user.email}</p>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        handleLaunch();
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-full bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold tracking-wider px-6 py-4 self-start hover:bg-[#cfff4d]"
                                >
                                    LAUNCH SERVER <Server size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-full border border-white/10 text-fog font-mono text-xs font-bold tracking-wider px-6 py-4 self-start hover:bg-white/5"
                                >
                                    <LogOut size={14} /> LOGOUT
                                </button>
                            </div>
                        ) : (
                            <button
                                data-testid="nav-mobile-scan-btn"
                                onClick={() => {
                                    setOpen(false);
                                    onScan();
                                }}
                                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold tracking-wider px-6 py-4 self-start hover:bg-[#cfff4d]"
                            >
                                DOWNLOAD NOW <Download size={14} />
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
