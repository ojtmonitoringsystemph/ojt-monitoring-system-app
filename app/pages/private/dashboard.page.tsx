import {
  Megaphone,
  CheckSquare,
  UserCircle,
  Loader2,
  Building2,
  Users,
  Calendar,
  ChevronRight,
  Clock,
} from "lucide-react";
import StatsCard from "@/components/templates/cards/stats.card";
import { Button } from "@/components/atoms/button";
import { useEffect, useState } from "react";
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { announcementService } from "@/services/announcement.service"; // Import announcement service
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy:
    | {
        _id: string;
        name?: string;
        email?: string;
      }
    | string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [userRole, setUserRole] = useState(getUserFromLocalStorage()?.user?.role || "");

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

  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      const userData = getUserFromLocalStorage();
      const userProgram = userData?.user?.program;

      // Pass user's program as parameter for filtering
      const params = userProgram ? { program: userProgram } : {};
      const response = await announcementService.getAll(params);

      // For students, show all announcements. For others, show latest 3
      const announcementsToShow = userRole === "student" ? response : response.slice(0, 3);
      setAnnouncements(announcementsToShow || []);
    } catch (error: any) {
      console.error("Failed to fetch announcements:", error);
      // Don't show error if it's just unauthorized - user might not have access
    } finally {
      setAnnouncementsLoading(false);
    }
  };
  useEffect(() => {
    if (userRole) {
      fetchMyDashboard();
      fetchAnnouncements();
    }
  }, [userRole]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = getUserFromLocalStorage()?.user?.role || "";
      if (updatedRole !== userRole) {
        setUserRole(updatedRole);
        fetchMyDashboard();
        fetchAnnouncements();
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
            dashboard?.userRole?.charAt(0).toUpperCase() + dashboard?.userRole?.slice(1) ||
            "Student",
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

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get author name helper
  const getAuthorName = (createdBy: Announcement["createdBy"]) => {
    if (typeof createdBy === "string") {
      return "Unknown";
    }
    return createdBy.name || createdBy.email?.split("@")[0] || "Unknown";
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 animate-fade-in bg-white">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">Dashboard</h1>
          <p className="text-xs sm:text-sm text-green-600">
            Welcome back! Here's an overview of your activities.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Export Report
          </Button> */}
          <Button
            onClick={() => {
              fetchMyDashboard();
              fetchAnnouncements();
            }}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex-1 sm:flex-none text-xs sm:text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
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
            <div key={i} className="h-32 bg-green-50 rounded-lg animate-pulse" />
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

      {/* Announcements Section - Only for admin and coordinator */}

      <div className="grid grid-cols-1  gap-6">
        {/* Left side - 2/3 width for other content (you can add other dashboard sections here) */}

        {/* Right side - 1/3 width for Announcements */}
        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Latest Announcements
              </CardTitle>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {announcements.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {announcementsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8">
                <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No announcements yet</p>
                <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="group p-3 -mx-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => {
                      // Navigate to announcements page or show modal
                      window.location.href = `/announcement`;
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                        {announcement.title}
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {truncateContent(announcement.content, 80)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <UserCircle className="h-3 w-3" />
                        By {getAuthorName(announcement.createdBy)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {announcements.length > 0 && userRole !== "student" && (
              <div className="mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => {
                    window.location.href = `/announcement`;
                  }}
                >
                  View All Announcements
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
