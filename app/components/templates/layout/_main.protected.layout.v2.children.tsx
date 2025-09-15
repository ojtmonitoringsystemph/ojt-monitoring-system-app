import { useState, type ReactNode } from "react";

import SidebarV2 from "../navigation/side.nav.v2";

interface MainProtectedLayoutProps {
  children: ReactNode;
}

export default function MainProtectedLayout({
  children,
}: MainProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen  bg-gray-100">
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
          <main className="flex-1  bg-white  overflow-y-auto  p-5 m-2 rounded-lg shadow-md">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
