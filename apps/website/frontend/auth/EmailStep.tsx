"use client";

import { useState } from "react";
import AuthButton from "./AuthButton";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

interface EmailStepProps {
    onSubmit: (email: string) => Promise<void>;
}

export default function EmailStep({ onSubmit }: EmailStepProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!email) {
            setError("Email is required");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(email);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center text-center w-full bg-panel/40 p-8 rounded-2xl border border-border/40 shadow-2xl backdrop-blur-md">
            <h1 className="text-3xl font-display text-fog mb-2 tracking-tight font-medium">Welcome back</h1>
            <p className="text-ash mb-8 text-sm max-w-xs">Enter your email to continue.</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                <div className="relative group text-left w-full rounded-xl">
                    {/* Animated Border Glow when typing */}
                    {email !== "" && !error && !isLoading && (
                        <motion.div
                            className="absolute -inset-[2px] rounded-[14px] opacity-100 z-0 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div 
                                className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0%,#B7FF00_20%,transparent_50%)]"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    )}

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail className="h-5 w-5 text-ash group-focus-within:text-lime transition-colors duration-300" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        placeholder="name@example.com"
                        className={`relative z-10 w-full bg-[#0A0A0A] border ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' : email !== "" ? 'border-transparent focus:border-transparent focus:ring-0 focus:outline-none' : 'border-border/50 focus:border-lime focus:ring-4 focus:ring-lime/20'} text-fog text-base rounded-xl block pl-11 p-3.5 transition-all duration-300 outline-none`}
                        disabled={isLoading}
                        autoFocus
                    />
                </div>
                
                {error && (
                    <div className="text-red-400 text-sm text-left mt-[-10px] pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {error}
                    </div>
                )}

                <AuthButton type="submit" isLoading={isLoading} disabled={!email || !!error}>
                    Continue
                </AuthButton>
            </form>
        </div>
    );
}
