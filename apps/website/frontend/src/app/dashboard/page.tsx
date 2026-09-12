import { getSession } from "@/lib/session";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();

  // Temporary bypass for checking out the UI without login
  return <DashboardClient user={{ email: session?.email || "guest@sentinelx.ai", name: session?.name || "Guest User" }} />;
}
