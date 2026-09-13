"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TestWorkspaceClient from "./[projectId]/TestWorkspaceClient";

function TestWorkspaceWrapper() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "latest";
  return <TestWorkspaceClient projectId={projectId} />;
}

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink flex items-center justify-center text-fog font-mono">
          Loading Workspace...
        </div>
      }
    >
      <TestWorkspaceWrapper />
    </Suspense>
  );
}
