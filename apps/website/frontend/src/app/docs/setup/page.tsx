"use client";

import Link from "next/link";
import { Shield, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SetupGuidePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F0] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0D0F0D] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#B7FF00]" />
            <span className="font-display font-bold text-sm text-[#F5F5F0]">SENTINEL-X DOCS</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-mono text-xs text-[#B7FF00] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Guide Content */}
      <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-[#B7FF00]/10 border border-[#B7FF00]/20 text-[#B7FF00]">
            Documentation
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F0] mt-4">
            Sentinel-X Desktop Setup Guide
          </h1>
          <p className="mt-2 text-sm text-[#9CA3AF] font-mono">
            Follow this guide to install and configure Sentinel-X Desktop on your local workstation.
          </p>
        </div>

        <div className="space-y-8 font-sans">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#0D0F0D] border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center text-[#B7FF00] font-mono font-bold text-xs">
                1
              </div>
              <h2 className="font-display text-lg font-bold text-[#F5F5F0]">Download Installer</h2>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed pl-11">
              Visit your authenticated <Link href="/dashboard" className="text-[#B7FF00] underline">Dashboard</Link> and select the appropriate installer for your operating system (Windows, macOS, or Linux).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#0D0F0D] border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center text-[#B7FF00] font-mono font-bold text-xs">
                2
              </div>
              <h2 className="font-display text-lg font-bold text-[#F5F5F0]">Run Installation Wizard</h2>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed pl-11">
              Open the downloaded package (`.msi`, `.dmg`, or `.deb`) and follow the operating system prompts to install Sentinel-X Desktop into your local applications directory.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#0D0F0D] border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center text-[#B7FF00] font-mono font-bold text-xs">
                3
              </div>
              <h2 className="font-display text-lg font-bold text-[#F5F5F0]">Authenticate & Configure</h2>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed pl-11">
              Launch Sentinel-X Desktop. Enter your Sentinel-X account credentials to pair the desktop client with your account. Select your local AI engine preferences.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-[#0D0F0D] border border-[#B7FF00]/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#B7FF00] text-[#050505] flex items-center justify-center font-mono font-bold text-xs">
                4
              </div>
              <h2 className="font-display text-lg font-bold text-[#F5F5F0]">Begin Local Security Scanning</h2>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed pl-11">
              Open any repository or folder locally. Sentinel-X Desktop will run local SAST engines and AI analysis completely on-device without exposing code to cloud servers.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <span className="font-mono text-xs text-[#8B8F88]">Sentinel-X Setup Guide v1.0</span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-xl hover:bg-[#cfff4d] transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0D0F0D] py-4 px-6 text-center font-mono text-xs text-[#8B8F88]">
        Sentinel-X Security Engineering © 2026
      </footer>
    </main>
  );
}
