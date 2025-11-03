import React, { useEffect } from "react";

import { SidebarProvider } from "@/components/atoms/sidebar";
import AppHeader from "@/components/templates/layout/app.header";
import AppSidebar from "@/components/templates/layout/app.sidebar";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { useNavigate } from "react-router";
import { useAuth } from "~/app/hooks/use.auth";

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
  const navigate = useNavigate();
  const getAuth = getUserFromLocalStorage()?.user;

  console.log(getAuth);
  const { logout } = useAuth();

  useEffect(() => {
    if (!getAuth) {
      navigate("/login", { replace: true });
    }
  }, [getAuth, navigate]);

  if (!getAuth) return null; // prevent flicker before redirect

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* <AppSidebar userRole={userRole} /> */}
      <div className="flex-1 flex flex-col">
        <AppHeader
          userRole={getAuth?.role}
          userName={`${getAuth?.firstName || userName} ${
            getAuth?.lastName || ""
          }`}
          onLogout={() => logout()}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
