"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { KeyRound, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import OtpStep from "../../../../auth/OtpStep";
import { BlobCard } from "../../../ui/blob-card";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleVerify = async (otpString: string) => {
    // The OtpStep will catch the error if thrown.
    await authApi.verifyEmail(email, otpString);
  };

  const handleSuccessComplete = () => {
    router.push("/auth/login?verified=true");
  };

  const handleChangeEmail = () => {
    router.push("/auth/register");
  };

  return (
    <BlobCard 
      className="max-w-md mx-auto w-full"
      headerHeight={160}
      header={
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-[#B7FF00]" />
          </div>
        </div>
      }
    >
      <OtpStep 
        email={email} 
        onVerify={handleVerify} 
        onChangeEmail={handleChangeEmail} 
        onSuccessComplete={handleSuccessComplete} 
      />
      <div className="pb-8 flex justify-center mt-2">
        <Link href="/auth/login" className="text-xs text-[#9CA3AF] hover:text-[#F5F5F0] hover:underline font-mono">
          Back to Login
        </Link>
      </div>
    </BlobCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F0] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />
      <Suspense fallback={<div className="text-ash font-mono">Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
