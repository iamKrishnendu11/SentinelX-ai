"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends HTMLMotionProps<"button"> {
    isLoading?: boolean;
    children: React.ReactNode;
}

export default function AuthButton({ isLoading, children, disabled, className = "", ...props }: AuthButtonProps) {
    return (
        <motion.button
            whileHover={!disabled && !isLoading ? { scale: 1.01 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            className={`w-full relative flex items-center justify-center py-3.5 px-4 rounded-xl font-medium text-ink bg-lime transition-all duration-300 ${disabled || isLoading ? 'opacity-50 cursor-not-allowed grayscale-[20%]' : 'hover:lime-glow shadow-[0_0_15px_rgba(183,255,0,0.1)]'} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            <span className={`flex items-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </span>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-ink" />
                </div>
            )}
        </motion.button>
    );
}
