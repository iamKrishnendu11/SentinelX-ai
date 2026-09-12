import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import WelcomeSection from "@/components/WelcomeSection";
import GitHubConnectionCard from "@/components/GitHubConnectionCard";
import ProjectsSection from "@/components/ProjectsSection";
import SecurityOverview from "@/components/SecurityOverview";
import LocalAISetupCard from "@/components/LocalAISetupCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-ink flex text-fog font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <DesktopSidebar />

      {/* Main App Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <DesktopHeader title="Dashboard" />

        {/* Dashboard Scrollable Workspace */}
        <main className="flex-1 p-6 md:p-10 w-full mx-auto max-w-[1400px]">
          
          <div className="mb-12">
            <WelcomeSection />
          </div>

          {/* Bento Intelligence Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            
            {/* Top Row: AI Status & GitHub Status */}
            <div className="lg:col-span-2 flex flex-col bg-panel">
              <LocalAISetupCard />
            </div>
            
            <div className="lg:col-span-2 flex flex-col bg-panel">
              <GitHubConnectionCard />
            </div>

            {/* Main Row: Projects List spanning 3 columns, Overview on the right */}
            <div className="lg:col-span-3 flex flex-col bg-panel min-h-[400px]">
              <ProjectsSection />
            </div>

            <div className="lg:col-span-1 flex flex-col bg-panel">
              <SecurityOverview />
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
