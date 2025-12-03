import React, { useEffect, useState } from "react";
import { type PageProps } from "@/types/page.type";
import PageLayout from "~/app/components/templates/layout/page.layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Archive, Users, FileText, Download, Search, Filter, XCircle } from "lucide-react";
import { userService } from "~/app/services/user.service";
import { documentService } from "~/app/services/document.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  createdAt: string;
  metadata?: {
    company?: {
      name: string;
    };
    coordinator?: {
      firstName: string;
      lastName: string;
    };
    status: string;
  };
}

interface DocumentRecord {
  _id: string;
  documents: string[];
  status: string;
  uploadedAt: string;
  remarks?: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    program: string;
  };
}

const Archives: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  // Get user role from localStorage as backup
  const userData = getUserFromLocalStorage();
  const actualUserRole = userRole || userData?.user?.role;

  // Access control - only admin can access this page
  if (actualUserRole !== "admin") {
    return (
      <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                  <XCircle className="h-12 w-12" />
                </div>
                <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You don't have permission to access this page. This section is only available to
                  administrators.
                </p>
                <Button onClick={() => window.history.back()} className="w-full">
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  const [activeTab, setActiveTab] = useState<"students" | "documents">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    } else {
      fetchDocuments();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      // Filter only students
      const studentData = response.filter((user: any) => user.role === "student");
      setStudents(studentData);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAll();
      setDocuments(response);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgram = programFilter === "all" || student.program === programFilter;
    const matchesStatus = statusFilter === "all" || student.metadata?.status === statusFilter;

    return matchesSearch && matchesProgram && matchesStatus;
  });

  // Filter documents based on search
  const filteredDocuments = documents.filter(
    (document) =>
      document.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to CSV function
  const exportToCSV = () => {
    let csvContent = "";
    let filename = "";

    if (activeTab === "students") {
      // CSV headers for students
      csvContent =
        "First Name,Last Name,Email,Program,Company,Coordinator,Status,Registration Date\n";

      // Add student data
      filteredStudents.forEach((student) => {
        const row = [
          student.firstName,
          student.lastName,
          student.email,
          student.program?.toUpperCase() || "N/A",
          student.metadata?.company?.name || "N/A",
          student.metadata?.coordinator
            ? `${student.metadata.coordinator.firstName} ${student.metadata.coordinator.lastName}`
            : "N/A",
          student.metadata?.status || "N/A",
          new Date(student.createdAt).toLocaleDateString(),
        ]
          .map((field) => `"${field}"`)
          .join(",");
        csvContent += row + "\n";
      });

      filename = `students_archive_${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      // CSV headers for documents
      csvContent =
        "Student Name,Student Email,Student Program,Files Count,Status,Upload Date,Remarks\n";

      // Add document data
      filteredDocuments.forEach((document) => {
        const row = [
          `${document.student?.firstName || "Unknown"} ${document.student?.lastName || ""}`,
          document.student?.email || "N/A",
          document.student?.program?.toUpperCase() || "N/A",
          document.documents?.length || 0,
          document.status || "N/A",
          new Date(document.uploadedAt).toLocaleDateString(),
          document.remarks || "N/A",
        ]
          .map((field) => `"${field}"`)
          .join(",");
        csvContent += row + "\n";
      });

      filename = `documents_archive_${new Date().toISOString().split("T")[0]}.csv`;
    }

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Archive className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Archive</h1>
          </div>
          <Button onClick={exportToCSV} className="flex items-center gap-2" disabled={loading}>
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            onClick={() => setActiveTab("students")}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Students ({students.length})
          </Button>
          <Button
            variant={activeTab === "documents" ? "default" : "ghost"}
            onClick={() => setActiveTab("documents")}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Documents ({documents.length})
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

          {activeTab === "students" && (
            <>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="bsit">BSIT</SelectItem>
                  <SelectItem value="bsba">BSBA</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "students" ? "Students Archive" : "Documents Archive"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-muted-foreground">Loading {activeTab}...</div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {activeTab === "students" ? (
                        <>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Coordinator</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Files Count</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Upload Date</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTab === "students" ? (
                      filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No students found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell className="font-medium">
                              {student.firstName} {student.lastName}
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {student.program?.toUpperCase() || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {student.metadata?.company?.name || "Not assigned"}
                            </TableCell>
                            <TableCell>
                              {student.metadata?.coordinator
                                ? `${student.metadata.coordinator.firstName} ${student.metadata.coordinator.lastName}`
                                : "Not assigned"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  student.metadata?.status === "completed"
                                    ? "default"
                                    : student.metadata?.status === "deployed"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {student.metadata?.status || "Scheduled"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(student.createdAt)}</TableCell>
                          </TableRow>
                        ))
                      )
                    ) : filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No documents found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((document) => (
                        <TableRow key={document._id}>
                          <TableCell className="font-medium">
                            {document.student?.firstName} {document.student?.lastName}
                          </TableCell>
                          <TableCell>{document.student?.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {document.student?.program?.toUpperCase() || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {document.documents?.length || 0} files
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                document.status === "approved"
                                  ? "default"
                                  : document.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {document.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total {activeTab === "students" ? "Students" : "Documents"}
                  </p>
                  <p className="text-2xl font-bold">
                    {activeTab === "students" ? students.length : documents.length}
                  </p>
                </div>
                {activeTab === "students" ? (
                  <Users className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>

          {activeTab === "students" && (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">BSIT Students</p>
                      <p className="text-2xl font-bold">
                        {students.filter((s) => s.program === "bsit").length}
                      </p>
                    </div>
                    <Badge className="text-lg px-3 py-1">BSIT</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">BSBA Students</p>
                      <p className="text-2xl font-bold">
                        {students.filter((s) => s.program === "bsba").length}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      BSBA
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Archives;
