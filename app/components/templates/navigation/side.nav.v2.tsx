import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  CheckSquare,
  Upload,
  BookOpen,
  MessageSquare,
  ChevronDown,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    name: "Program Requirements",
    href: "/program-requirements",
    icon: BookOpen,
    roles: ["admin"],
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
    roles: ["coordinator", "student"],
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    roles: ["coordinator"],
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    roles: ["admin", "coordinator"],
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
  {
    name: "Announcement",
    href: "/announcement",
    icon: CheckSquare,
    roles: ["coordinator", "admin"],
  },
  {
    name: "Archives",
    href: "/archives",
    icon: Archive,
    roles: ["admin"],
  },
];

interface AppSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SidebarV2({ isOpen, setIsOpen }: AppSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<"admin" | "coordinator" | "student">("student");

  useEffect(() => {
    const savedRole = localStorage.getItem("role") as "admin" | "coordinator" | "student" | null;
    if (savedRole) setUserRole(savedRole);
  }, []);

  const roleNavigation = navigation.filter((item) => item.roles?.includes(userRole));

  const toggleItem = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity sm:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-gray-100 transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h1 className="text-lg font-semibold capitalize">{userRole} Menu</h1>
          <button className="sm:hidden p-2" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {roleNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            const hasSubItems = !!item.subItems;
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
                    <item.icon className="mr-3 h-5 w-5" />
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
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-primary-800 text-blue-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
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
      </aside>
    </>
  );
}
