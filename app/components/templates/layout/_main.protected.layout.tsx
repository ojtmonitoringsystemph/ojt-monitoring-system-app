import { useState } from "react";

import { Menu } from "lucide-react";
import { Outlet } from "react-router";

export default function MainProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-transparent">
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

        {/* Main area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b bg-white/60 backdrop-blur px-4 sm:px-6">
            <button className="sm:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 pb-24 sm:pb-6 bg-gray-50 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
