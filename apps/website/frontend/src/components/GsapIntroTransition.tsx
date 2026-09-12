import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const GsapIntroTransition = () => {
    const curtainRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (!curtainRef.current || !logoRef.current || !counterRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => setIsDone(true)
        });

        const counter = { val: 0 };

        // 1. Percentage counter animation
        tl.to(counter, {
            val: 100,
            duration: 2,
            ease: "power3.inOut",
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.innerText = Math.round(counter.val).toString().padStart(3, '0') + "%";
                }
            }
        });

        // 2. Hide counter and reveal logo
        tl.to(counterRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in"
        }, "+=0.2");

        tl.to(logoRef.current, {
            scale: 1.1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        }, "-=0.2");

        // 3. Curtain wipe up
        tl.to(curtainRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut",
            delay: 0.1,
        });

        return () => {
            tl.kill();
        };
    }, []);

    if (isDone) return null;

    return (
        <div 
            ref={curtainRef} 
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center pointer-events-auto origin-top"
        >
            <div className="relative flex items-center justify-center w-full h-full">
                {/* Logo centered */}
                <div ref={logoRef} className="absolute opacity-0 font-display font-bold text-4xl md:text-6xl text-white tracking-tighter">
                    SentinelX<span className="text-lime">.</span>
                </div>
                
                {/* Counter centered initially */}
                <div ref={counterRef} className="absolute font-mono text-5xl md:text-7xl font-light text-lime tracking-widest">
                    000%
                </div>
            </div>
            
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/50 uppercase">
                    Initializing Environment
                </span>
            </div>
        </div>
    );
};

export default GsapIntroTransition;
