import React, { useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Download,
} from "lucide-react";
import { type PageProps } from "@/types/page.type";

const SubmittedTasks: React.FC<PageProps> = ({
  userRole,
  userName,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [submissions] = useState([
    {
      id: "1",
      taskCode: "TSK001",
      taskName: "Company Research Report",
      studentName: "John Smith",
      studentId: "CS2021001",
      submissionDate: "2024-01-15",
      status: "pending" as const,
      fileUrl: "#",
      feedback: "",
    },
    {
      id: "2",
      taskCode: "TSK002",
      taskName: "Weekly Progress Report",
      studentName: "Alice Johnson",
      studentId: "IT2021005",
      submissionDate: "2024-01-14",
      status: "approved" as const,
      fileUrl: "#",
      feedback: "Excellent work! Very detailed and well-structured.",
    },
    {
      id: "3",
      taskCode: "TSK003",
      taskName: "Project Documentation",
      studentName: "Bob Wilson",
      studentId: "CS2021008",
      submissionDate: "2024-01-13",
      status: "rejected" as const,
      fileUrl: "#",
      feedback:
        "Please include more technical details and revise the formatting.",
    },
    {
      id: "4",
      taskCode: "TSK001",
      taskName: "Company Research Report",
      studentName: "Emma Davis",
      studentId: "IT2021012",
      submissionDate: "2024-01-12",
      status: "pending" as const,
      fileUrl: "#",
      feedback: "",
    },
  ]);

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.taskCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Submitted Tasks
              </h1>
              <p className="text-muted-foreground">
                Review and grade student task submissions
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Submissions</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{submission.taskName}</h3>
                        <Badge variant="outline">{submission.taskCode}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted by:{" "}
                        <span className="font-medium">
                          {submission.studentName}
                        </span>{" "}
                        ({submission.studentId})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submission Date:{" "}
                        {new Date(
                          submission.submissionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(submission.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(submission.status)}
                          {submission.status}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {submission.feedback && (
                    <div className="mb-3 p-3 bg-muted rounded">
                      <p className="text-sm">
                        <strong>Feedback:</strong> {submission.feedback}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {submission.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {filteredSubmissions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No submissions found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SubmittedTasks;
