"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import ScanModal from "@/components/ScanModal";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Loop from "@/components/Loop";
import DigitalTwin from "@/components/DigitalTwin";
import Agents from "@/components/Agents";
import Battle from "@/components/Battle";
import SelfHealing from "@/components/SelfHealing";
import Dashboard from "@/components/Dashboard";
import DevSecOps from "@/components/DevSecOps";
import TechStack from "@/components/TechStack";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import GsapEffects from "@/components/GsapEffects";
import CursorGrid from "@/components/CursorComp";
import GsapIntroTransition from "@/components/GsapIntroTransition";
import { motion } from "framer-motion";

export default function Home() {
    const [scanOpen, setScanOpen] = useState(false);
    const router = useRouter();
    const openScan = useCallback(() => router.push('/login'), [router]);

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="App flex flex-col min-h-screen relative"
        >
            <GsapIntroTransition />
            
            <div className="fixed inset-0 z-0 pointer-events-auto">
                <CursorGrid color="#B7FF00" gridOpacity={0.03} />
            </div>
            
            <div className="relative z-10 flex flex-col flex-grow pointer-events-none">
                <GsapEffects />
                <Toaster theme="dark" position="bottom-right" />
                <div className="pointer-events-auto">
                    <Navbar onScan={openScan} />
                </div>
                <main className="flex-grow pointer-events-auto">
                <Hero onScan={openScan} />
                <Problem />
                <Loop />
                <DigitalTwin />
                <Agents />
                <Battle />
                <SelfHealing onScan={openScan} />
                <Dashboard />
                <DevSecOps />
                <TechStack />
                <FinalCTA onScan={openScan} />
                </main>
                <div className="pointer-events-auto">
                    <Footer />
                </div>
                <div className="pointer-events-auto">
                    <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} />
                </div>
            </div>
        </motion.div>
    );
}
