"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Settings, LogOut, UserCheck } from "lucide-react";
import Link from "next/link";

interface DesktopHeaderProps {
  title: string;
}

export default function DesktopHeader({ title }: DesktopHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0D0F0D]/90 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-100 font-mono tracking-wide">
          {title}
        </h1>
        <span className="text-slate-600 font-mono text-xs">/</span>
        <span className="text-xs text-slate-400 font-mono">Sentinel-X Desktop</span>
      </div>

      {/* Right: User Avatar & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#050505] border border-white/10 hover:border-white/20 transition-all text-left"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <div className="w-7 h-7 rounded-md bg-[#B7FF00]/15 border border-[#B7FF00]/30 flex items-center justify-center text-[#B7FF00] font-mono text-xs font-bold">
            SX
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-mono font-semibold text-slate-200 leading-tight">
              Local Workspace User
            </p>
            <p className="text-[10px] text-slate-500 font-mono leading-tight">
              Desktop Edition
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0D0F0D] border border-white/15 shadow-2xl py-1.5 z-50 text-xs font-mono">
            <div className="px-3.5 py-2 border-b border-white/10">
              <p className="text-slate-300 font-semibold truncate">Local User</p>
              <p className="text-[10px] text-slate-500 truncate">local@sentinelx.dev</p>
            </div>

            <button
              onClick={() => setDropdownOpen(false)}
              className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-[#B7FF00] flex items-center gap-2.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Profile</span>
            </button>

            <Link
              href="/settings"
              onClick={() => setDropdownOpen(false)}
              className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-[#B7FF00] flex items-center gap-2.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </Link>

            <div className="my-1 border-t border-white/10" />

            <button
              onClick={() => setDropdownOpen(false)}
              className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
