"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, User, LogOut, ChevronDown, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface DashboardHeaderProps {
  user: {
    email: string;
    name?: string;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const displayName = user.name || user.email.split("@")[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/auth/login");
    }
  };

  useGSAP(() => {
    if (dropdownOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [dropdownOpen]);

  useGSAP(() => {
    if (showProfileModal && modalOverlayRef.current && modalRef.current) {
      gsap.fromTo(
        modalOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [showProfileModal]);

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-xl border-b border-white/10 w-full px-6 py-3.5 transition-all">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center group-hover:border-[#B7FF00]/40 transition-colors">
            <img src="/logo.png" alt="SentinelX Logo" className="w-4 h-4 object-contain drop-shadow-[0_0_8px_#B7FF00]" />
          </div>
          <span className="font-display font-bold tracking-tight text-sm text-[#F5F5F0] uppercase">
            Sentinel<span className="text-[#B7FF00]">-</span>X
          </span>
          <span className="hidden sm:inline-block font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/20 text-[#B7FF00] tracking-[0.2em]">
            Workspace
          </span>
        </Link>

        {/* Right: User Profile Dropdown */}
        <div className="relative" ref={dropdownContainerRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-none border border-white/10 bg-white/5 hover:bg-white/10 hover:border-lime/40 transition-all text-[#F5F5F0] cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-label="User profile menu"
          >
            <div className="w-6 h-6 rounded-none bg-[#B7FF00]/20 border border-[#B7FF00]/30 flex items-center justify-center text-[#B7FF00]">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#F5F5F0] max-w-[140px] truncate">
              {displayName}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-lime' : ''}`} />
          </button>

          {dropdownOpen && (
            <div 
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-64 rounded-none bg-[#0D0F0D] border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                <p className="text-[10px] tracking-[0.2em] uppercase font-mono font-bold text-[#F5F5F0] truncate">{displayName}</p>
                <p className="text-[9px] tracking-wider font-mono text-ash truncate mt-1">{user.email}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[9px] tracking-widest uppercase font-mono text-[#B7FF00]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00] animate-blink" />
                  <span>Authenticated Session</span>
                </div>
              </div>

              <div className="p-1.5 space-y-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-none text-[10px] tracking-wider uppercase font-mono text-[#F5F5F0] hover:bg-white/5 hover:text-lime transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Info</span>
                </button>

                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="w-full text-left px-3 py-2 rounded-none text-[10px] tracking-wider uppercase font-mono text-[#FF5F56] hover:bg-[#FF5F56]/10 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Modal */}
      {showProfileModal && (
        <div ref={modalOverlayRef} className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-sm flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-panel border border-white/15 rounded-none max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-lime" />
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-fog font-bold">User Profile</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-ash hover:text-fog transition-colors cursor-pointer"
              >
                <span className="font-mono text-xs font-bold">X</span>
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-ash uppercase text-[10px] tracking-[0.2em] block mb-2">Name</label>
                <div className="p-3 bg-ink border border-white/10 rounded-none text-fog tracking-wider">
                  {displayName}
                </div>
              </div>

              <div>
                <label className="text-ash uppercase text-[10px] tracking-[0.2em] block mb-2">Email Address</label>
                <div className="p-3 bg-ink border border-white/10 rounded-none text-fog tracking-wider">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="text-ash uppercase text-[10px] tracking-[0.2em] block mb-2">Account Status</label>
                <div className="p-3 bg-ink border border-lime/30 rounded-none text-lime flex items-center gap-2 tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified & Active</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-7 py-3 bg-lime text-ink font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-none hover:bg-[#cfff4d] transition-colors lime-glow cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
