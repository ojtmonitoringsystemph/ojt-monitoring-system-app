import { Outlet } from "react-router";

export default function MainInterviewLayout() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Main area */}
      <div className="flex min-h-screen">
        {/* Content */}
        <main className="flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
