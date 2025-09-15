import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { BookOpen, Plus } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const Diary: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Daily Diary
              </h1>
              <p className="text-muted-foreground">
                Record your daily internship activities
              </p>
            </div>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No diary entries yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Diary;
