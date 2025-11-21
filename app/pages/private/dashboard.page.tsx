import {
  Megaphone,
  CheckSquare,
  UserCircle,
  Loader2,
  Building2,
  Users,
} from "lucide-react";
import StatsCard from "@/components/templates/cards/stats.card";
import { Button } from "@/components/atoms/button";
import { useEffect, useState } from "react";
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [userRole, setUserRole] = useState(
    getUserFromLocalStorage()?.user?.role || ""
  );

  const fetchMyDashboard = async () => {
    try {
      setLoading(true);
      const currentUser = getUserFromLocalStorage()?.user;
      if (!currentUser) return;

      const response = await userService.dashboard({
        userId: currentUser._id || "",
        userRole: currentUser.role || "",
      });

      setDashboard(response.dashboard);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchMyDashboard();
    }
  }, [userRole]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = getUserFromLocalStorage()?.user?.role || "";
      if (updatedRole !== userRole) {
        setUserRole(updatedRole);
        fetchMyDashboard();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userRole]);

  // --- Separate stats based on role ---
  const getStats = () => {
    if (!dashboard) return [];

    if (userRole === "admin") {
      return [
        {
          title: "Total Students",
          value: dashboard?.totalStudents || 0,
          description: "All enrolled students",
          icon: Users,
          trend: "up" as const,
          trendValue: "+3",
        },
        {
          title: "BSIT Students",
          value: dashboard?.bsitStudents || 0,
          description: "Students enrolled in BSIT program",
          icon: CheckSquare,
          trend: "neutral" as const,
          trendValue: "",
        },
        {
          title: "BSBA Students",
          value: dashboard?.bsbaStudents || 0,
          description: "Students enrolled in BSBA program",
          icon: CheckSquare,
          trend: "neutral" as const,
          trendValue: "",
        },
        {
          title: "Total Coordinators",
          value: dashboard?.totalCoordinators || 0,
          description: "Active coordinators in the system",
          icon: UserCircle,
          trend: "up" as const,
          trendValue: "+1",
        },
        {
          title: "Total Companies",
          value: dashboard?.totalCompanies || 0,
          description: "Partnered companies for OJT",
          icon: Building2,
          trend: "up" as const,
          trendValue: "+2",
        },
      ];
    }

    if (userRole === "coordinator") {
      return [
        {
          title: "Total Announcements",
          value: dashboard?.totalAnnouncements || 0,
          description: "Total announcements created",
          icon: Megaphone,
          trend: "up" as const,
          trendValue: "+1",
        },
        {
          title: "Total Students Handled",
          value: dashboard?.totalStudentsHandled || 0,
          description: "Students under your coordination",
          icon: Users,
          trend: "neutral" as const,
          trendValue: "",
        },
        {
          title: "Companies with Students",
          value: dashboard?.companiesWithStudents || 0,
          description: "Partnered companies with active students",
          icon: Building2,
          trend: "up" as const,
          trendValue: "+2",
        },
      ];
    }

    if (userRole === "student") {
      return [
        {
          title: "Total Announcements",
          value: dashboard?.totalAnnouncements || 0,
          description: "Latest posted updates",
          icon: Megaphone,
          trend: "up" as const,
          trendValue: "+1",
        },
        {
          title: "Total Tasks",
          value: dashboard?.totalTasks || 0,
          description: "Tasks assigned to you",
          icon: CheckSquare,
          trend: "neutral" as const,
          trendValue: "",
        },
        {
          title: "User Role",
          value:
            dashboard.userRole.charAt(0).toUpperCase() +
            dashboard.userRole.slice(1),
          description: "Current access level",
          icon: UserCircle,
          trend: "neutral" as const,
          trendValue: "",
        },
      ];
    }

    // Default fallback
    return [
      {
        title: "User Role",
        value: dashboard?.userRole || "N/A",
        description: "Current access level",
        icon: UserCircle,
        trend: "neutral" as const,
        trendValue: "",
      },
    ];
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-white">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Dashboard</h1>
          <p className="text-green-600">
            Welcome back! Here’s an overview of your activities.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Export Report
          </Button>
          <Button
            onClick={fetchMyDashboard}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-green-50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            userRole === "admin"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
              trendValue={stat.trendValue}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
