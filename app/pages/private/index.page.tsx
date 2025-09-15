import { useEffect, useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import Dashboard from "./dashboard.page";
import { type PageProps } from "@/types/page.type";

const Index = ({ onLogout }: Omit<PageProps, "userRole" | "userName">) => {
  const [userRole, setUserRole] = useState<"admin" | "coordinator" | "student">(
    "student"
  );
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role") as
      | "admin"
      | "coordinator"
      | "student"
      | null;
    const savedName = localStorage.getItem("name");

    if (savedRole) setUserRole(savedRole);
    if (savedName) setUserName(savedName);
  }, []);

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <Dashboard />
    </PageLayout>
  );
};

export default Index;
