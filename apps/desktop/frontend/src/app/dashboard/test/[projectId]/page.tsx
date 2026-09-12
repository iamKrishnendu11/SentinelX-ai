import TestWorkspace from "@/components/workspace/TestWorkspace";

export default async function TestWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-ink text-slate-100 font-sans antialiased selection:bg-lime selection:text-ink">
      <main className="w-full min-h-screen p-4 md:p-8 flex flex-col">
        <TestWorkspace projectId={resolvedParams.projectId} />
      </main>
    </div>
  );
}
