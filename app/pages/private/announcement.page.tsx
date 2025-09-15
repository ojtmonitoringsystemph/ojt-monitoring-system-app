import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Megaphone, Plus } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const Announcements: React.FC<PageProps> = ({
  userRole,
  userName,
  onLogout,
}) => {
  const announcements = [
    {
      id: "1",
      title: "New Internship Guidelines",
      content:
        "Updated guidelines for internship requirements have been published.",
      date: "2024-01-15",
      priority: "high" as const,
      author: "Admin Team",
    },
    {
      id: "2",
      title: "System Maintenance",
      content: "Scheduled maintenance will occur this weekend.",
      date: "2024-01-10",
      priority: "medium" as const,
      author: "IT Team",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Announcements
            </h1>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Announcement
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  {announcement.content}
                </p>
                <div className="text-sm text-muted-foreground">
                  By {announcement.author} •{" "}
                  {new Date(announcement.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Announcements;
