import { useEffect, useState, useCallback } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import "@/App.css";
import Navbar from "@/components/site/Navbar";
import ScanModal from "@/components/site/ScanModal";
import Hero from "@/components/site/Hero";
import Problem from "@/components/site/Problem";
import Loop from "@/components/site/Loop";
import DigitalTwin from "@/components/site/DigitalTwin";
import Agents from "@/components/site/Agents";
import Battle from "@/components/site/Battle";
import SelfHealing from "@/components/site/SelfHealing";
import Dashboard from "@/components/site/Dashboard";
import DevSecOps from "@/components/site/DevSecOps";
import TechStack from "@/components/site/TechStack";
import FinalCTA from "@/components/site/FinalCTA";
import Footer from "@/components/site/Footer";

function App() {
    const [scanOpen, setScanOpen] = useState(false);
    const openScan = useCallback(() => setScanOpen(true), []);

    useEffect(() => {
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        let raf;
        const loop = (t) => {
            lenis.raf(t);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="App">
            <Toaster theme="dark" position="bottom-right" />
            <Navbar onScan={openScan} />
            <main>
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
            <Footer />
            <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} />
        </div>
    );
}

export default App;
