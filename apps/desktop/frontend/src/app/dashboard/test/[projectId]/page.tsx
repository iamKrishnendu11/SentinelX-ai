import TestWorkspaceClient from "./TestWorkspaceClient";

export async function generateStaticParams() {
  return [
    { projectId: "latest" },
    { projectId: "p-01" },
    { projectId: "p-02" },
    { projectId: "p-03" },
  ];
}

export default async function TestWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = await params;
  return <TestWorkspaceClient projectId={resolvedParams.projectId} />;
}
