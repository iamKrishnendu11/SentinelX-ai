import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import { Radar, Info } from "lucide-react";

export default function ScansPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="Scans" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-[#B7FF00]">
              <Radar className="w-7 h-7" />
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-xl font-mono font-bold text-slate-100">
                Scans
              </h2>
              <p className="text-sm text-slate-400 font-sans">
                Your security scans will appear here.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050505] border border-white/10 text-xs font-mono text-slate-400">
              <Info className="w-4 h-4 text-[#B7FF00]" />
              <span>Static analysis engine pipeline standby</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
