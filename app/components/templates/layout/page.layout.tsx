import React from "react";
import { SidebarProvider } from "@/components/atoms/sidebar";
import AppHeader from "@/components/templates/layout/app.header";
import AppSidebar from "@/components/templates/layout/app.sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  userRole?: "admin" | "coordinator" | "student";
  userName?: string;
  onLogout?: () => void;
}

const PageLayout = ({
  children,
  userRole = "admin",
  userName = "Dr. Sarah Johnson",
  onLogout,
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* <AppSidebar userRole={userRole} /> */}

      <div className="flex-1 flex flex-col">
        <AppHeader
          userRole={userRole}
          userName={userName}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
