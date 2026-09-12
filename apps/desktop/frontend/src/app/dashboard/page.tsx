import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import WelcomeSection from "@/components/WelcomeSection";
import QuickStartCard from "@/components/QuickStartCard";
import ProjectsSection from "@/components/ProjectsSection";
import SecurityOverview from "@/components/SecurityOverview";
import LocalFirstCard from "@/components/LocalFirstCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-100">
      {/* Fixed Left Sidebar */}
      <DesktopSidebar />

      {/* Main App Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <DesktopHeader title="Dashboard" />

        {/* Dashboard Scrollable Workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome Hero Section */}
          <WelcomeSection />

          {/* Quick Start Grid */}
          <QuickStartCard />

          {/* Two-column layout for Projects and Security Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectsSection />
            <SecurityOverview />
          </div>

          {/* Local-First Trust Card */}
          <LocalFirstCard />
        </main>
      </div>
    </div>
  );
}
