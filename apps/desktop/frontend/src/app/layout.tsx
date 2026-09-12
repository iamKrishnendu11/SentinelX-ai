import type { Metadata } from "next";
import "./globals.css";
import { GitHubProvider } from "@/context/GitHubContext";
import { LocalAIProvider } from "@/context/LocalAIContext";

export const metadata: Metadata = {
  title: "Sentinel-X Desktop | Local Security Workspace",
  description:
    "Sentinel-X Desktop Application - Autonomous Local Code Security Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-[#F4F4F0] antialiased selection:bg-[#B7FF00] selection:text-[#050505]">
        <GitHubProvider>
          <LocalAIProvider>{children}</LocalAIProvider>
        </GitHubProvider>
      </body>
    </html>
  );
}

