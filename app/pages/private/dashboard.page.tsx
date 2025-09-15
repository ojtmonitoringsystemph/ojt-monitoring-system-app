import { Users, Building2, CheckSquare, Clock, TrendingUp } from "lucide-react";
import StatsCard from "@/components/templates/cards/stats.card";
import AnnouncementCard from "@/components/templates/cards/announcement.card";
import StudentCard from "@/components/templates/cards/student.card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";

const Dashboard = () => {
  // Mock data - in real app, this would come from your backend
  const stats = [
    {
      title: "Total Students",
      value: 156,
      description: "Active internships",
      icon: Users,
      trend: "up" as const,
      trendValue: "+12%",
    },
    {
      title: "Partner Companies",
      value: 24,
      description: "Current partnerships",
      icon: Building2,
      trend: "up" as const,
      trendValue: "+2",
    },
    {
      title: "Pending Tasks",
      value: 8,
      description: "Require attention",
      icon: CheckSquare,
      trend: "down" as const,
      trendValue: "-5",
    },
    {
      title: "Avg. Completion",
      value: "78%",
      description: "Internship progress",
      icon: TrendingUp,
      trend: "up" as const,
      trendValue: "+3%",
    },
  ];

  const announcements = [
    {
      id: "1",
      title: "New Documentation Requirements",
      content:
        "Starting next week, all students must submit weekly progress reports in addition to daily diary entries.",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      priority: "high" as const,
      type: "deadline" as const,
    },
    {
      id: "2",
      title: "Company Visit Schedule",
      content:
        "We will be conducting company visits for all active internship sites between Jan 20-25.",
      author: "Prof. Michael Chen",
      date: "2024-01-14",
      priority: "medium" as const,
      type: "general" as const,
    },
    {
      id: "3",
      title: "System Maintenance",
      content:
        "The internship tracking system will be undergoing maintenance on Saturday from 2-4 PM.",
      author: "IT Support",
      date: "2024-01-13",
      priority: "low" as const,
      type: "urgent" as const,
    },
  ];

  const recentStudents = [
    {
      id: "1",
      name: "Alice Thompson",
      program: "Computer Science",
      company: "TechCorp Solutions",
      deploymentDate: "2024-01-08",
      internshipDuration: 480,
      completedHours: 120,
      totalHours: 480,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Bob Martinez",
      program: "Information Technology",
      company: "Digital Innovations Inc.",
      deploymentDate: "2024-01-10",
      internshipDuration: 480,
      completedHours: 80,
      totalHours: 480,
      status: "active" as const,
    },
    {
      id: "3",
      name: "Carol Davis",
      program: "Software Engineering",
      company: "CloudTech Systems",
      deploymentDate: "2024-01-05",
      internshipDuration: 480,
      completedHours: 180,
      totalHours: 480,
      status: "active" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your internships.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>Add Student</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Deployments</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Announcements</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
