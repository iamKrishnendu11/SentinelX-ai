"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Settings, LogOut, UserCheck, Unlink } from "lucide-react";
import Link from "next/link";
import { useGitHub } from "@/context/GitHubContext";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

interface DesktopHeaderProps {
  title: string;
}

export default function DesktopHeader({ title }: DesktopHeaderProps) {
  const { githubState, disconnectGitHub, logout } = useGitHub();
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

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

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

      {/* Right: GitHub Status & User Dropdown */}
      <div className="flex items-center gap-4">
        {/* GitHub Connection Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#050505] border border-white/10 text-xs font-mono">
          <GitHubIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">GitHub</span>
          {githubState.connected ? (
            <span className="flex items-center gap-1 text-[#B7FF00] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00] shadow-[0_0_6px_#B7FF00]" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Not Connected
            </span>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#050505] border border-white/10 hover:border-white/20 transition-all text-left cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 rounded-md bg-[#B7FF00]/15 border border-[#B7FF00]/30 flex items-center justify-center text-[#B7FF00] font-mono text-xs font-bold">
              SX
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-mono font-semibold text-slate-200 leading-tight">
                {githubState.connected && githubState.username
                  ? `@${githubState.username}`
                  : "Local Workspace User"}
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
            <div className="absolute right-0 mt-2 w-52 rounded-lg bg-[#0D0F0D] border border-white/15 shadow-2xl py-1.5 z-50 text-xs font-mono">
              <div className="px-3.5 py-2 border-b border-white/10">
                <p className="text-slate-300 font-semibold truncate">
                  {githubState.connected && githubState.username
                    ? `@${githubState.username}`
                    : "Local Workspace User"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {githubState.connected ? "GitHub Authenticated" : "GitHub Disconnected"}
                </p>
              </div>

              <button
                onClick={() => setDropdownOpen(false)}
                className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-[#B7FF00] flex items-center gap-2.5 transition-colors cursor-pointer"
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

              {githubState.connected && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    disconnectGitHub();
                  }}
                  className="w-full text-left px-3.5 py-2 text-amber-300 hover:bg-amber-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect GitHub</span>
                </button>
              )}

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
