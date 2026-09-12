"use client";

import { motion } from "framer-motion";

const SecurityCore = () => {
    return (
        <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-white/5 border-dashed"
            />
            {/* Middle Ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[10%] rounded-full border border-white/10"
            >
                <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-lime rounded-full shadow-[0_0_10px_rgba(183,255,0,0.5)]" />
                <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 -mb-1 bg-lime rounded-full shadow-[0_0_10px_rgba(183,255,0,0.5)]" />
            </motion.div>
            {/* Inner Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[25%] rounded-full border border-lime/20 border-dotted"
            >
                <div className="absolute top-1/2 left-0 w-1.5 h-1.5 -ml-0.5 -mt-0.5 bg-fog rounded-full" />
                <div className="absolute top-1/2 right-0 w-1.5 h-1.5 -mr-0.5 -mt-0.5 bg-fog rounded-full" />
            </motion.div>
            {/* Center Core */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[40%] rounded-full bg-panel border border-lime/30 flex items-center justify-center lime-glow"
            >
                <div className="w-1/2 h-1/2 rounded-full bg-lime/10 flex items-center justify-center">
                    <div className="w-1/2 h-1/2 rounded-full bg-lime" />
                </div>
            </motion.div>
        </div>
    );
};

export default SecurityCore;
