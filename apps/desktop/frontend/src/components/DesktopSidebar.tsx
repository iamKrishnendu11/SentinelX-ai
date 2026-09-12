"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Radar,
  ShieldAlert,
  Settings,
  HelpCircle,
  Shield,
  Cpu,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Scans", href: "/scans", icon: Radar },
  { name: "Vulnerabilities", href: "/vulnerabilities", icon: ShieldAlert },
];

const secondaryNavItems: NavItem[] = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Documentation", href: "/help", icon: HelpCircle },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavList = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
                isActive
                  ? "bg-[#B7FF00]/10 text-[#B7FF00] border border-[#B7FF00]/30 font-semibold shadow-[0_0_15px_rgba(183,255,0,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#B7FF00]" : "text-slate-400"}`} />
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B7FF00] shadow-[0_0_8px_#B7FF00]" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-[#0D0F0D] border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#0D0F0D] border-r border-white/10 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header / Branding */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#B7FF00]/20 via-[#0D0F0D] to-[#B7FF00]/10 border border-[#B7FF00]/40 flex items-center justify-center text-[#B7FF00] shadow-[0_0_12px_rgba(183,255,0,0.15)] group-hover:border-[#B7FF00] transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-100 tracking-wider font-mono">
                  SENTINEL-X
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#B7FF00]/15 text-[#B7FF00] border border-[#B7FF00]/30">
                  DESKTOP
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-tight">
                Local Security Workspace
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Workspace Navigation
            </div>
            {renderNavList(mainNavItems)}
          </div>

          <div className="pt-2 border-t border-white/10">
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
              System & Help
            </div>
            {renderNavList(secondaryNavItems)}
          </div>
        </div>

        {/* Bottom Connection Status */}
        <div className="p-4 border-t border-white/10 bg-[#050505]/60">
          <div className="rounded-lg p-3 bg-[#050505] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                Local Engine Ready
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <Cpu className="w-3 h-3 text-[#B7FF00]" />
              <span>Offline Security Analysis</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
