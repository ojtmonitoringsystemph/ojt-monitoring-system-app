import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Mail, Phone, MapPin, Edit, Trash2, Users } from "lucide-react";

interface CoordinatorCardProps {
  coordinator: {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    location: string;
    avatar?: string;
    studentsAssigned: number;
    specialization: string;
    status: "active" | "inactive";
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CoordinatorCard = ({
  coordinator,
  onEdit,
  onDelete,
}: CoordinatorCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={coordinator.avatar} alt={coordinator.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(coordinator.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{coordinator.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    coordinator.status === "active" ? "default" : "secondary"
                  }
                >
                  {coordinator.status}
                </Badge>
                <Badge variant="outline">{coordinator.department}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(coordinator.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(coordinator.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            {coordinator.email}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            {coordinator.phone}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {coordinator.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            {coordinator.studentsAssigned} students assigned
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">Specialization</p>
            <p className="text-sm text-muted-foreground">
              {coordinator.specialization}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoordinatorCard;
