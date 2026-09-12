import { AuthTransitionLayout } from "./auth-transition-layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F0] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />
      <AuthTransitionLayout>
        {children}
      </AuthTransitionLayout>
    </main>
  );
}
