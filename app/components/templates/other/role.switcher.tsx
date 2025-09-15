import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { UserCog, Users, GraduationCap } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: "admin" | "coordinator" | "student";
  onRoleChange: (role: "admin" | "coordinator" | "student") => void;
}

const RoleSwitcher = ({ currentRole, onRoleChange }: RoleSwitcherProps) => {
  const roles = [
    {
      value: "admin" as const,
      label: "Admin",
      icon: UserCog,
      description: "Full system access",
      user: "Dr. Sarah Johnson",
    },
    {
      value: "coordinator" as const,
      label: "Coordinator",
      icon: Users,
      description: "Student management",
      user: "Prof. Michael Chen",
    },
    {
      value: "student" as const,
      label: "Student",
      icon: GraduationCap,
      description: "Student portal",
      user: "John Smith",
    },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Switch Role</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Button
              key={role.value}
              variant={currentRole === role.value ? "default" : "outline"}
              className="w-full justify-start gap-3 h-auto p-4"
              onClick={() => onRoleChange(role.value)}
            >
              <Icon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{role.user}</div>
                <div className="text-sm opacity-70">
                  {role.label} - {role.description}
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;
