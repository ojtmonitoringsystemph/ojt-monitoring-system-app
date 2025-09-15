import React from "react";
import { User, Building2, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Progress } from "@/components/atoms/progress";

interface Student {
  id: string;
  name: string;
  program: string;
  company: string;
  deploymentDate: string;
  internshipDuration: number;
  completedHours: number;
  totalHours: number;
  status: "active" | "completed" | "pending";
}

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  const progressPercentage =
    (student.completedHours / student.totalHours) * 100;

  return (
    <Card
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.program}</p>
            </div>
          </div>
          <Badge variant="secondary" className={statusColors[student.status]}>
            {student.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{student.company}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Deployed: {student.deploymentDate}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Progress</span>
            </div>
            <span className="text-foreground font-medium">
              {student.completedHours}/{student.totalHours} hours
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
