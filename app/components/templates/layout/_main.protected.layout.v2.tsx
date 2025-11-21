import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import SidebarV2 from "../navigation/side.nav.v2";

export default function MainProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white flex">
      {/* Mobile overlay */}
      <SidebarV2 isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="sm:hidden flex items-center justify-between p-4 border-b">
          <button
            className="p-2 text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span className="font-semibold">Menu</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
