import { Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import CursorGrid from "@/components/CursorComp";

const LINKS = [
    { label: "Platform", href: "#platform" },
    { label: "AI Engine", href: "#agents" },
    { label: "Security", href: "#security" },
    { label: "Our Process", href: "#technology" },
    { label: "Projects", href: "https://github.com" },
    { label: "Pricing", href: "#pricing" },
];

const SOCIALS = [
    { icon: <FaLinkedin size={14} />, href: "#" },
    { icon: <FaTwitter size={14} />, href: "#" },
    { icon: <FaGithub size={14} />, href: "#" },
    { icon: <Mail size={14} />, href: "#" },
];

const Footer = () => (
    <footer data-testid="footer" className="bg-[#050505] text-[#F5F5F0] pt-24 md:pt-32 pb-8 md:pb-12 border-t border-white/10 relative z-10 overflow-hidden">
        {/* Interactive Glowing Cursor Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-auto opacity-70">
            <CursorGrid color="#B7FF00" gridOpacity={0.1} maxOpacity={1} radius={250} />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 pointer-events-none">
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24 md:mb-32">
                {/* Left: Tagline & Socials */}
                <div className="md:col-span-5 flex flex-col justify-between">
                    <h3 className="font-display font-medium text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-[-0.04em] mb-12 max-w-sm">
                        Autonomous AI <br/>
                        application <br/>
                        security.
                    </h3>
                    <div className="flex items-center gap-3">
                        {SOCIALS.map((s, i) => (
                            <a 
                                key={i} 
                                href={s.href} 
                                className="pointer-events-auto w-10 h-10 rounded-full bg-[#111] flex items-center justify-center text-white/70 hover:bg-[#B7FF00] hover:text-[#050505] transition-all"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Middle: Quick Links */}
                <div className="md:col-span-4 md:px-8">
                    <p className="font-mono text-[10px] text-white flex items-center gap-2 mb-6 tracking-widest uppercase">
                        <span className="w-1 h-1 bg-lime rounded-full"/> Quick links
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {LINKS.map(l => (
                            <a 
                                key={l.label} 
                                href={l.href}
                                className="pointer-events-auto px-4 py-3 rounded-full bg-[#111] text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-center text-white/80 hover:bg-lime hover:text-black transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Contact */}
                <div className="md:col-span-3 lg:pl-12">
                    <p className="font-mono text-[10px] text-white flex items-center gap-2 mb-6 tracking-widest uppercase">
                        <span className="w-1 h-1 bg-lime rounded-full"/> Contact
                    </p>
                    <div className="font-mono text-[11px] md:text-xs tracking-wider text-white/60 space-y-4">
                        <a href="mailto:hello@sentinelx.ai" className="pointer-events-auto block hover:text-white transition-colors">hello@sentinelx.ai</a>
                        <p>+1 (800) 243-5152</p>
                        <p className="leading-relaxed pt-2">
                            392 Northwest 19th<br/>
                            Street, Miami, FL 33179,<br/>
                            United States of America
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Massive Typography */}
            <div className="w-full relative flex flex-col items-center">
                <h1 className="font-display font-bold tracking-tighter text-[16vw] lg:text-[18vw] leading-[0.75] text-[#F5F5F0] w-full text-center mb-4">
                    SentinelX<span className="text-lime">.</span>
                </h1>
                
                {/* Footer Meta Links */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between mt-8 md:mt-12 font-mono text-[9px] md:text-[10px] tracking-widest text-white/40 uppercase gap-6 md:gap-4">
                    <span>©2026 SentinelX Security.</span>
                    <div className="flex gap-6 md:gap-8">
                        <a href="#" className="pointer-events-auto hover:text-white transition-colors">Terms and Conditions</a>
                        <a href="#" className="pointer-events-auto hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
