import React from "react";
import { NavLink, useLocation } from "react-router"; // ✅ fix import
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  CheckSquare,
  Upload,
  Archive,
  Megaphone,
  UserCog,
  BookOpen,
  Clock,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/atoms/sidebar";

interface AppSidebarProps {
  userRole?: "admin" | "coordinator" | "student";
}

const AppSidebar: React.FC<AppSidebarProps> = ({ userRole = "student" }) => {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const adminMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Account Management", url: "/accounts", icon: UserCog },
    { title: "Students", url: "/students", icon: Users },
    { title: "Coordinators", url: "/coordinators", icon: Users },
    { title: "Companies", url: "/companies", icon: Building2 },
    { title: "Enrollment", url: "/enrollment", icon: FileText },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "Announcements", url: "/announcements", icon: Megaphone },
    { title: "Archives", url: "/archives", icon: Archive },
  ];

  const coordinatorMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Students", url: "/students", icon: Users },
    { title: "Tasks", url: "/tasks", icon: CheckSquare },
    { title: "Submitted Tasks", url: "/submitted-tasks", icon: FileText },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "Reports", url: "/reports", icon: BarChart3 },
  ];

  const studentMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Daily Diary", url: "/diary", icon: BookOpen },
    { title: "Time Tracking", url: "/time-tracking", icon: Clock },
    { title: "Upload Documents", url: "/upload", icon: Upload },
    { title: "My Tasks", url: "/my-tasks", icon: CheckSquare },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "History", url: "/history", icon: Archive },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return adminMenuItems;
      case "coordinator":
        return coordinatorMenuItems;
      default:
        return studentMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            {!isCollapsed &&
              `${userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} Menu`}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      } // ✅ correct NavLink className usage
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
