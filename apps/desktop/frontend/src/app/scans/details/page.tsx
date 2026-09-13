"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ScanDetailsClient from "../[id]/ScanDetailsClient";

function ScanDetailsWrapper() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("id") || searchParams.get("scanId") || "latest";
  return <ScanDetailsClient scanId={scanId} />;
}

export default function ScanDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-100 font-mono">
          Loading Scan Details...
        </div>
      }
    >
      <ScanDetailsWrapper />
    </Suspense>
  );
}
