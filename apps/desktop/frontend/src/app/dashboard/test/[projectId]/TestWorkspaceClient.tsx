"use client";

import TestWorkspace from "@/components/workspace/TestWorkspace";

export default function TestWorkspaceClient({ projectId }: { projectId: string }) {
  return (
    <div className="min-h-screen bg-ink text-slate-100 font-sans antialiased selection:bg-lime selection:text-ink">
      <main className="w-full min-h-screen p-4 md:p-8 flex flex-col">
        <TestWorkspace projectId={projectId} />
      </main>
    </div>
  );
}
