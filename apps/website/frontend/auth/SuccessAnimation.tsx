"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface SuccessAnimationProps {
    onComplete: () => void;
}

export default function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
    useEffect(() => {
        // Complete timeline ends around 2200-2800ms
        const timer = setTimeout(() => {
            onComplete();
        }, 2600);
        return () => clearTimeout(timer);
    }, [onComplete]);

    // Timeline based on requirements:
    // 0-150ms: OTP stabilizes
    // 150-450ms: OTP transitions away
    // 300-650ms: Success circle enters
    // 450-1250ms: Circular stroke draws
    // 1250-1330ms: Tiny pause
    // 1330-1750ms: Checkmark draws
    // 1750-2050ms: Subtle success pulse
    // 1900-2200ms: Optional success text
    // ~2200-2800ms: Transition to app

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Circle Entrance Container */}
            <motion.div
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    duration: 0.35, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3 // global 300ms
                }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center mb-8"
            >
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" fill="none">
                    {/* Animated circle stroke */}
                    <motion.circle
                        cx="50" cy="50" r="46"
                        stroke="var(--color-lime, #B7FF00)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, rotate: -90 }}
                        animate={{ pathLength: 1 }}
                        transition={{ 
                            duration: 0.8, 
                            ease: [0.65, 0, 0.35, 1], // easeInOutCubic
                            delay: 0.45 // global 450ms
                        }}
                        style={{ originX: "50%", originY: "50%" }}
                    />

                    {/* Animated Checkmark */}
                    {/* Left stroke: from upper-left to lower-center, right stroke: lower-center to upper-right */}
                    <motion.path
                        d="M 30 52 L 44 65 L 72 36"
                        stroke="var(--color-lime, #B7FF00)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ 
                            duration: 0.42, 
                            ease: [0.22, 1, 0.36, 1],
                            delay: 1.33 // global 1330ms
                        }}
                    />
                </svg>
                
                {/* Subtle success pulse effect */}
                <motion.div
                    className="absolute inset-0 bg-lime rounded-full mix-blend-screen"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 1.04, 1], opacity: [0, 0.15, 0] }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        delay: 1.75 // global 1750ms
                    }}
                />
            </motion.div>
            
            <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-fog font-medium tracking-wide text-base sm:text-lg"
            >
                Verified successfully.
            </motion.p>
        </div>
    );
}
