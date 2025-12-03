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

  const [activeTab, setActiveTab] = useState<"students" | "documents" | "coordinators">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [coordinators, setCoordinators] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    } else if (activeTab === "coordinators") {
      fetchCoordinators();
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

  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      // Filter only coordinators
      const coordinatorData = response.filter((user: any) => user.role === "coordinator");
      setCoordinators(coordinatorData);
    } catch (error) {
      console.error("Failed to fetch coordinators:", error);
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

  // Filter coordinators based on search and filters
  const filteredCoordinators = coordinators.filter((coordinator) => {
    const matchesSearch =
      coordinator.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordinator.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordinator.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgram = programFilter === "all" || coordinator.program === programFilter;

    return matchesSearch && matchesProgram;
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
    } else if (activeTab === "coordinators") {
      // CSV headers for coordinators
      csvContent = "First Name,Last Name,Email,Program,Registration Date\n";

      // Add coordinator data
      filteredCoordinators.forEach((coordinator) => {
        const row = [
          coordinator.firstName,
          coordinator.lastName,
          coordinator.email,
          coordinator.program?.toUpperCase() || "N/A",
          new Date(coordinator.createdAt).toLocaleDateString(),
        ]
          .map((field) => `"${field}"`)
          .join(",");
        csvContent += row + "\n";
      });

      filename = `coordinators_archive_${new Date().toISOString().split("T")[0]}.csv`;
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
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Archive className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Archive</h1>
          </div>
          <Button
            onClick={exportToCSV}
            className="flex items-center gap-2 text-xs sm:text-sm px-3 py-2 w-full sm:w-auto justify-center sm:justify-start"
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "students" ? "default" : "ghost"}
              onClick={() => setActiveTab("students")}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Students ({students.length})
            </Button>
            <Button
              variant={activeTab === "coordinators" ? "default" : "ghost"}
              onClick={() => setActiveTab("coordinators")}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Coordinators ({coordinators.length})
            </Button>
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              onClick={() => setActiveTab("documents")}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Documents ({documents.length})
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 text-sm h-10"
            />
          </div>

          {activeTab === "students" && (
            <div className="grid grid-cols-2 gap-2.5">
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-10">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="bsit">BSIT</SelectItem>
                  <SelectItem value="bsba">BSBA</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-10">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {activeTab === "coordinators" && (
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm h-10">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="bsit">BSIT</SelectItem>
                <SelectItem value="bsba">BSBA</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-muted-foreground">Loading {activeTab}...</div>
          </div>
        ) : (
          <>
            {/* Desktop Table View (md and above) */}
            <div className="hidden md:block">
              <Card>
                <CardHeader className="px-4 py-3 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">
                    {activeTab === "students"
                      ? "Students Archive"
                      : activeTab === "documents"
                      ? "Documents Archive"
                      : "Coordinators Archive"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          {activeTab === "students" ? (
                            <>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Name
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Email
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Program
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Company
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Coordinator
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Status
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Registered
                              </TableHead>
                            </>
                          ) : activeTab === "documents" ? (
                            <>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Student Name
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Email
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Program
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Files Count
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Status
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Upload Date
                              </TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Name
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Email
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Program
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                Registration Date
                              </TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeTab === "students" ? (
                          filteredStudents.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center text-muted-foreground py-8"
                              >
                                No students found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredStudents.map((student) => (
                              <TableRow key={student._id}>
                                <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {student.firstName} {student.lastName}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {student.email}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  <Badge variant="outline">
                                    {student.program?.toUpperCase() || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {student.metadata?.company?.name || "Not assigned"}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {student.metadata?.coordinator
                                    ? `${student.metadata.coordinator.firstName} ${student.metadata.coordinator.lastName}`
                                    : "Not assigned"}
                                </TableCell>
                                <TableCell className="px-2 sm:px-4 py-2">
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
                                <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {formatDate(student.createdAt)}
                                </TableCell>
                              </TableRow>
                            ))
                          )
                        ) : activeTab === "documents" ? (
                          filteredDocuments.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center text-muted-foreground py-8"
                              >
                                No documents found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredDocuments.map((document) => (
                              <TableRow key={document._id}>
                                <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {document.student?.firstName} {document.student?.lastName}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {document.student?.email}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  <Badge variant="outline">
                                    {document.student?.program?.toUpperCase() || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-2 sm:px-4 py-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {document.documents?.length || 0} files
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-2 sm:px-4 py-2">
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
                                <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                                  {formatDate(document.uploadedAt)}
                                </TableCell>
                              </TableRow>
                            ))
                          )
                        ) : filteredCoordinators.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-muted-foreground py-8"
                            >
                              No coordinators found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCoordinators.map((coordinator) => (
                            <TableRow key={coordinator._id}>
                              <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                {coordinator.firstName} {coordinator.lastName}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                {coordinator.email}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-2">
                                <Badge
                                  variant="outline"
                                  className="bg-purple-100 text-purple-800 border-purple-300"
                                >
                                  {coordinator.program?.toUpperCase() || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                                {formatDate(coordinator.createdAt)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Card View (below md) */}
            <div className="md:hidden space-y-3">
              {activeTab === "students" ? (
                filteredStudents.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No students found</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredStudents.map((student) => (
                    <Card key={student._id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm">
                              {student.firstName} {student.lastName}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {student.email}
                            </p>
                          </div>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {student.program?.toUpperCase() || "N/A"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Company</p>
                            <p className="text-xs font-medium truncate">
                              {student.metadata?.company?.name || "Not assigned"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Coordinator</p>
                            <p className="text-xs font-medium truncate">
                              {student.metadata?.coordinator
                                ? `${student.metadata.coordinator.firstName} ${student.metadata.coordinator.lastName}`
                                : "Not assigned"}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <Badge
                              variant={
                                student.metadata?.status === "completed"
                                  ? "default"
                                  : student.metadata?.status === "deployed"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs mt-1"
                            >
                              {student.metadata?.status || "Scheduled"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Registered</p>
                            <p className="text-xs font-medium">{formatDate(student.createdAt)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
              ) : activeTab === "documents" ? (
                filteredDocuments.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No documents found</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredDocuments.map((document) => (
                    <Card key={document._id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm">
                              {document.student?.firstName} {document.student?.lastName}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {document.student?.email}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {document.student?.program?.toUpperCase() || "N/A"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Files</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {document.documents?.length || 0}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <Badge
                              variant={
                                document.status === "approved"
                                  ? "default"
                                  : document.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-xs mt-1"
                            >
                              {document.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="text-xs font-medium">{formatDate(document.uploadedAt)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
              ) : filteredCoordinators.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No coordinators found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredCoordinators.map((coordinator) => (
                  <Card key={coordinator._id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm">
                            {coordinator.firstName} {coordinator.lastName}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {coordinator.email}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-purple-300 whitespace-nowrap"
                        >
                          {coordinator.program?.toUpperCase() || "N/A"}
                        </Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Registered</p>
                        <p className="text-xs font-medium">{formatDate(coordinator.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total{" "}
                    {activeTab === "students"
                      ? "Students"
                      : activeTab === "documents"
                      ? "Documents"
                      : "Coordinators"}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {activeTab === "students"
                      ? students.length
                      : activeTab === "documents"
                      ? documents.length
                      : coordinators.length}
                  </p>
                </div>
                {activeTab === "students" ? (
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                ) : activeTab === "documents" ? (
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                ) : (
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {activeTab === "students" && (
            <>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        BSIT Students
                      </p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {students.filter((s) => s.program === "bsit").length}
                      </p>
                    </div>
                    <Badge className="text-sm sm:text-lg px-2 sm:px-3 py-1">BSIT</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        BSBA Students
                      </p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {students.filter((s) => s.program === "bsba").length}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-sm sm:text-lg px-2 sm:px-3 py-1">
                      BSBA
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "coordinators" && (
            <>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        BSIT Coordinators
                      </p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {coordinators.filter((c) => c.program === "bsit").length}
                      </p>
                    </div>
                    <Badge className="text-sm sm:text-lg px-2 sm:px-3 py-1 bg-purple-100 text-purple-800">
                      BSIT
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        BSBA Coordinators
                      </p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {coordinators.filter((c) => c.program === "bsba").length}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-sm sm:text-lg px-2 sm:px-3 py-1 bg-purple-100 text-purple-800"
                    >
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
