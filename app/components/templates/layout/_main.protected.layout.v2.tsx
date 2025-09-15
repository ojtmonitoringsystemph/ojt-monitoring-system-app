import { useState, useEffect } from "react";

import { Outlet, useNavigate } from "react-router";
import SidebarV2 from "../navigation/side.nav.v2";
import { uselocalStorage } from "@/utils/localstorage.utils";

export default function MainProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      // const auth = uselocalStorage.get("auth") as any;
      // if (!auth || !auth.token) {
      //   navigate("/login");
      //   return;
      // }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen  bg-white">
      {/* Sidebar + Overlay */}
      <div className="sm:hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SidebarV2 isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Content */}
          <main className="flex-1  bg-white  overflow-y-auto  ">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
