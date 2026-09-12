"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGitHub } from "@/context/GitHubContext";
import { exchangeOAuthCode } from "@/services/githubApi";
import { Loader2, AlertCircle } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGitHubConnectionState } = useGitHub();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    let isMounted = true;

    async function completeOAuth() {
      if (!code) {
        if (isMounted) {
          setError("No OAuth code received from GitHub.");
        }
        setTimeout(() => router.push("/dashboard"), 3000);
        return;
      }

      const result = await exchangeOAuthCode(code, state || "");
      if (!isMounted) return;

      setGitHubConnectionState(result);
      if (result.connected && result.status === "connected") {
        router.push("/dashboard");
      } else {
        setError(result.errorMessage || "Unable to verify GitHub authentication.");
        setTimeout(() => router.push("/dashboard"), 3000);
      }
    }

    completeOAuth();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router, setGitHubConnectionState]);

  return (
    <div className="rounded-xl bg-[#0D0F0D] border border-white/10 p-10 max-w-md w-full text-center space-y-4 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-[#B7FF00]/30 flex items-center justify-center text-[#B7FF00] mx-auto">
        {error ? (
          <AlertCircle className="w-7 h-7 text-rose-400" />
        ) : (
          <Loader2 className="w-7 h-7 animate-spin text-[#B7FF00]" />
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-mono font-bold text-slate-100">
          {error ? "Authentication Error" : "Connecting GitHub"}
        </h3>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          {error || "Exchanging authorization code with server..."}
        </p>
      </div>

      {error && (
        <p className="text-[11px] font-mono text-slate-500">
          Redirecting to dashboard...
        </p>
      )}
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-slate-100">
      <Suspense fallback={<div className="text-xs font-mono text-slate-400">Loading...</div>}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
