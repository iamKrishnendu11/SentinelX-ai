"use client";

import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import GitHubConnectionCard from "@/components/GitHubConnectionCard";
import { Settings, Shield, Cpu } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100">
      <DesktopSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="Settings" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0D0F0D] border border-white/10 flex items-center justify-center text-[#B7FF00]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-bold text-slate-100">
                Workspace Settings
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Manage your GitHub authentication and local security workspace preferences.
              </p>
            </div>
          </div>

          {/* GitHub Connection Management */}
          <GitHubConnectionCard />

          {/* Local Security Settings Card */}
          <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold text-slate-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#B7FF00]" />
              Local Security Engine Preferences
            </h3>

            <div className="space-y-3 pt-2 text-xs font-mono text-slate-400">
              <div className="p-4 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">Local Analysis Engine</p>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Execute code security scans offline on this machine.
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/30 text-[10px] uppercase">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">OAuth Security Protocol</p>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Server-side authorization token exchange with PKCE / CSRF state protection.
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Secure
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
