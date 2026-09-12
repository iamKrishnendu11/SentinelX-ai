"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TransitionLink as Link } from "@/components/ui/transition-link";
import { authApi } from "@/lib/api";
import { User, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { BlobCard } from "../../../ui/blob-card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup(name, email, password);
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&sent=true`);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlobCard 
      className="max-w-md mx-auto"
      headerHeight={200}
      header={
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center mb-3">
            <img src="/logo.png" alt="SentinelX Logo" className="w-6 h-6 object-contain drop-shadow-[0_0_8px_#B7FF00]" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Create Sentinel-X Account</h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-mono uppercase tracking-wider">Predict. Fight. Heal.</p>
        </div>
      }
    >
      <div className="p-8 pt-4">

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-mono text-[#9CA3AF] uppercase mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#6B7280] focus:border-[#B7FF00] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#9CA3AF] uppercase mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#6B7280] focus:border-[#B7FF00] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#9CA3AF] uppercase mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#6B7280] focus:border-[#B7FF00] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#cfff4d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Creating Account..." : <>Create Account <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-[#9CA3AF]">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#B7FF00] hover:underline font-mono">
          Log In
        </Link>
      </div>
      </div>
    </BlobCard>
  );
}
