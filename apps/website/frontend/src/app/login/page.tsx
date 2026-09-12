"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectLogin() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/auth/login");
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#9CA3AF] font-mono text-xs">
            Redirecting to login...
        </div>
    );
}
