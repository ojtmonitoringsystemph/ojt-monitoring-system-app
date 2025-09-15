import React from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Clock, Play, Pause } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const TimeTracking: React.FC<PageProps> = ({
  userRole,
  userName,
  onLogout,
}) => {
  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Time Tracking
              </h1>
              <p className="text-muted-foreground">
                Track your internship hours and attendance
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Clock In
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Pause className="h-4 w-4" />
              Clock Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hours Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8.5</p>
              <p className="text-sm text-muted-foreground">hours logged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">40</p>
              <p className="text-sm text-muted-foreground">hours completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">360</p>
              <p className="text-sm text-muted-foreground">hours left</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default TimeTracking;
