import ScanDetailsClient from "./ScanDetailsClient";

export async function generateStaticParams() {
  return [
    { id: "latest" },
    { id: "sess-latest" },
    { id: "sess-gitgpt-01" },
    { id: "sess-sentinelx-02" },
    { id: "sess-mannmitra-03" },
  ];
}

export default async function ScanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ScanDetailsClient scanId={resolvedParams.id} />;
}
