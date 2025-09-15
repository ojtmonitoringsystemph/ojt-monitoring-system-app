import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { CheckSquare } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const MyTasks = ({ userRole, userName, onLogout }: PageProps) => {
  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground">
              View and complete assigned tasks
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks assigned</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MyTasks;
