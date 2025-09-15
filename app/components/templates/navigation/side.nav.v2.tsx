import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router"; // ✅ FIXED
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
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "~/app/hooks/use.auth";

interface SubItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: SubItem[];
  roles?: Array<"admin" | "coordinator" | "student">;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["admin", "coordinator", "student"],
  },
  {
    name: "Account Management",
    href: "/accounts",
    icon: UserCog,
    roles: ["admin"],
  },
  {
    name: "Students",
    href: "/students",
    icon: Users,
    roles: ["admin", "coordinator"],
  },
  {
    name: "Coordinators",
    href: "/coordinators",
    icon: Users,
    roles: ["admin"],
  },
  { name: "Companies", href: "/companies", icon: Building2, roles: ["admin"] },
  { name: "Enrollment", href: "/enrollment", icon: FileText, roles: ["admin"] },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
    roles: ["admin", "coordinator", "student"],
  },
  {
    name: "Announcements",
    href: "/announcements",
    icon: Megaphone,
    roles: ["admin"],
  },
  {
    name: "Archives",
    href: "/archives",
    icon: Archive,
    roles: ["admin", "student"],
  },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, roles: ["coordinator"] },
  {
    name: "Submitted Tasks",
    href: "/submitted-tasks",
    icon: FileText,
    roles: ["coordinator"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["coordinator"],
  },
  { name: "Daily Diary", href: "/diary", icon: BookOpen, roles: ["student"] },
  {
    name: "Time Tracking",
    href: "/time-tracking",
    icon: Clock,
    roles: ["student"],
  },
  {
    name: "Upload Documents",
    href: "/upload",
    icon: Upload,
    roles: ["student"],
  },
  {
    name: "My Tasks",
    href: "/my-tasks",
    icon: CheckSquare,
    roles: ["student"],
  },
];

interface AppSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SidebarV2({ isOpen, setIsOpen }: AppSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<"admin" | "coordinator" | "student">(
    "student"
  );

  // ✅ Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("role") as
      | "admin"
      | "coordinator"
      | "student"
      | null;
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  // ✅ Filter menu items by role
  const roleNavigation = navigation.filter((item) =>
    item.roles?.includes(userRole)
  );

  useEffect(() => {
    const activeItem = roleNavigation.find((item) => {
      if (item.subItems) {
        return item.subItems.some((sub) =>
          location.pathname.startsWith(sub.href)
        );
      }
      return item.href === location.pathname;
    });

    if (activeItem?.subItems) {
      setExpandedItems([activeItem.name]);
    }
  }, [location.pathname, roleNavigation]);

  const toggleItem = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-10 w-64 bg-gray-100 transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className="text-lg font-semibold capitalize">{userRole} Menu</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {roleNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          const hasSubItems = item.subItems !== undefined;
          const isExpanded = expandedItems.includes(item.name);
          const isSubActive = item.subItems?.some((sub) =>
            location.pathname.startsWith(sub.href)
          );

          return (
            <div key={item.name}>
              {hasSubItems ? (
                <button
                  onClick={() => toggleItem(item.name)}
                  className={cn(
                    "flex w-full items-center px-2 py-2 text-sm font-medium rounded-md",
                    isSubActive
                      ? "bg-blue-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isSubActive ? "text-gray-500" : "text-gray-400"
                    )}
                  />
                  {item.name}
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      isExpanded ? "rotate-180" : ""
                    )}
                  />
                </button>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-primary-800 text-blue-500 hover:bg-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-blue-500" : "text-gray-400"
                    )}
                  />
                  {item.name}
                </Link>
              )}

              {hasSubItems && isExpanded && item.subItems && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={cn(
                          "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                          isSubActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <button
          className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
          onClick={() => logout()}
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
