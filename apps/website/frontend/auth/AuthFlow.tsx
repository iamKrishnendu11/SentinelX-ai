"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import SuccessAnimation from "./SuccessAnimation";

type AuthState = "email" | "otp" | "success";

export default function AuthFlow() {
    const [step, setStep] = useState<AuthState>("email");
    const [email, setEmail] = useState("");
    const [direction, setDirection] = useState(1);
    const router = useRouter();

    const handleEmailSubmit = async (submittedEmail: string) => {
        setEmail(submittedEmail);
        const res = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: submittedEmail })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to send OTP');
        }
        
        setDirection(1);
        setStep("otp");
    };

    const handleOtpVerify = async (otp: string) => {
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Invalid OTP');
        }
    };

    const handleChangeEmail = () => {
        setDirection(-1);
        setStep("email");
    };

    const handleSuccessComplete = () => {
        router.push("/");
    };

    const emailOtpVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 30 : -30,
            opacity: 0,
            filter: "blur(8px)",
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -30 : 30,
            opacity: 0,
            filter: "blur(8px)",
            scale: 0.95
        })
    };

    return (
        <div className="w-full relative flex items-center justify-center min-h-[450px]">
            <AnimatePresence custom={direction}>
                {step === "email" && (
                    <motion.div
                        key="email"
                        custom={direction}
                        variants={emailOtpVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full absolute"
                    >
                        <EmailStep onSubmit={handleEmailSubmit} />
                    </motion.div>
                )}
                
                {step === "otp" && (
                    <motion.div
                        key="otp"
                        custom={direction}
                        variants={emailOtpVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full absolute"
                    >
                        <OtpStep 
                            email={email} 
                            onVerify={handleOtpVerify} 
                            onChangeEmail={handleChangeEmail}
                            onSuccessComplete={handleSuccessComplete}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
