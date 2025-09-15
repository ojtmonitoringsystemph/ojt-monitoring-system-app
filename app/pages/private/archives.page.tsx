import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Archive, Download, Search } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const Archives = ({ userRole, userName, onLogout }: PageProps) => {
  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Archives</h1>
              <p className="text-muted-foreground">
                Access archived internship records and documents
              </p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Archives
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Archived Internships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No archived records found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Archives;
