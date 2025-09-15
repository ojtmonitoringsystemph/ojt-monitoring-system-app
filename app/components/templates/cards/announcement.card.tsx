import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: "low" | "medium" | "high";
  type: "general" | "urgent" | "deadline";
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const typeColors = {
    general: "bg-gray-100 text-gray-800",
    urgent: "bg-orange-100 text-orange-800",
    deadline: "bg-purple-100 text-purple-800",
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {announcement.title}
          </h3>
          <div className="flex gap-1 ml-2">
            <Badge
              variant="secondary"
              className={priorityColors[announcement.priority]}
            >
              {announcement.priority}
            </Badge>
            <Badge variant="outline" className={typeColors[announcement.type]}>
              {announcement.type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {announcement.content}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{announcement.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{announcement.date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
