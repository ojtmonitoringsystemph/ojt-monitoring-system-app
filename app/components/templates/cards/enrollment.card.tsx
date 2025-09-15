import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Calendar, Building2, User, Edit, Trash2, Clock } from "lucide-react";

interface EnrollmentCardProps {
  enrollment: {
    id: string;
    studentName: string;
    studentId: string;
    studentAvatar?: string;
    companyName: string;
    companyId: string;
    coordinatorName: string;
    coordinatorId: string;
    enrollmentDate: string;
    startDate: string;
    endDate: string;
    status: "active" | "completed" | "pending" | "cancelled";
    schoolYear: string;
    program: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EnrollmentCard: React.FC<EnrollmentCardProps> = ({
  enrollment,
  onEdit,
  onDelete,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={enrollment.studentAvatar}
                alt={enrollment.studentName}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(enrollment.studentName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {enrollment.studentName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                ID: {enrollment.studentId}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusColor(enrollment.status)}>
                  {enrollment.status}
                </Badge>
                <Badge variant="outline">{enrollment.schoolYear}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(enrollment.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(enrollment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 mr-2" />
            {enrollment.companyName}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            Coordinator: {enrollment.coordinatorName}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Duration: {new Date(
              enrollment.startDate
            ).toLocaleDateString()} -{" "}
            {new Date(enrollment.endDate).toLocaleDateString()}
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">Program</p>
            <p className="text-sm text-muted-foreground">
              {enrollment.program}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentCard;
