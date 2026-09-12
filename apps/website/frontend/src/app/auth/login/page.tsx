"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { Mail, Lock, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { BlobCard } from "../../../ui/blob-card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverifiedEmail(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      await authApi.login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.message && err.message.includes("verify your email")) {
        setUnverifiedEmail(email);
        setError("Please verify your email before logging in.");
      } else {
        setError(err.message || "Invalid email or password.");
      }
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
            <Shield className="w-6 h-6 text-[#B7FF00]" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Log in to Sentinel-X</h1>
          <p className="text-xs text-[#9CA3AF] mt-1 font-mono uppercase tracking-wider">Predict. Fight. Heal.</p>
        </div>
      }
    >
      <div className="p-8 pt-4">
        {searchParams.get("verified") === "true" && !error && (
          <div className="mb-6 p-3 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/20 text-[#B7FF00] text-xs font-mono text-center">
            Email verified successfully! Please log in below.
          </div>
        )}

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {unverifiedEmail && (
            <Link
              href={`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
              className="mt-1 text-[#B7FF00] hover:underline font-bold text-center block"
            >
              Click here to enter your verification code →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {loading ? "Logging in..." : <>Log In <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-[#9CA3AF]">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-[#B7FF00] hover:underline font-mono">
          Create Account
        </Link>
      </div>
      </div>
    </BlobCard>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F0] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />
      <Suspense fallback={<div className="text-ash font-mono">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
