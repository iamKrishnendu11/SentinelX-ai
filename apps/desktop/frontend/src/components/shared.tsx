import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 32 }: any) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
        {children}
    </motion.div>
);

export const Tag = ({ children }: any) => (
    <div className="font-mono text-[11px] tracking-[0.3em] text-lime flex items-center gap-3 uppercase">
        <span className="h-px w-8 bg-lime/60" />
        {children}
    </div>
);

export const Counter = ({ to, suffix = "", className = "" }: any) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false });
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, to, {
            duration: 1.6,
            ease: "easeOut",
            onUpdate: (v) => setVal(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, to]);
    return (
        <span ref={ref} className={className}>
            {val}
            {suffix}
        </span>
    );
};

export const Magnetic = ({ children }: any) => {
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const onMove = (e: any) => {
        const r = (ref.current as any)?.getBoundingClientRect();
        if (!r) return;
        setPos({
            x: (e.clientX - r.left - r.width / 2) * 0.22,
            y: (e.clientY - r.top - r.height / 2) * 0.22,
        });
    };
    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
};

export const SectionShell = ({ id, children, className = "" }: any) => (
    <section id={id} className={`relative border-t border-white/10 ${className}`}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-24 md:py-32">{children}</div>
    </section>
);

export const PrimaryButton = ({ children, onClick, testId, className = "" }: any) => (
    <Magnetic>
        <button
            data-testid={testId}
            onClick={onClick}
            className={`lime-glow bg-lime text-black font-mono text-xs font-bold tracking-[0.2em] px-7 py-4 inline-flex items-center gap-2 hover:bg-[#cfff4d] transition-colors ${className}`}
        >
            {children}
        </button>
    </Magnetic>
);

export const GhostButton = ({ children, onClick, href, testId, className = "" }: any) => {
    const cls = `border border-white/20 text-fog font-mono text-xs tracking-[0.2em] px-7 py-4 inline-flex items-center gap-2 hover:border-lime hover:text-lime transition-colors ${className}`;
    return (
        <Magnetic>
            {href ? (
                <a data-testid={testId} href={href} className={cls}>
                    {children}
                </a>
            ) : (
                <button data-testid={testId} onClick={onClick} className={cls}>
                    {children}
                </button>
            )}
        </Magnetic>
    );
};
