import { useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Plus, Search, Filter } from "lucide-react";
import EnrollmentCard from "@/components/templates/cards/enrollment.card";
import { type PageProps } from "@/types/page.type";

const Enrollment: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [enrollments, setEnrollments] = useState([
    {
      id: "1",
      studentName: "Alice Johnson",
      studentId: "STU001",
      studentAvatar: "",
      companyName: "TechCorp Solutions",
      companyId: "COMP001",
      coordinatorName: "Dr. Sarah Johnson",
      coordinatorId: "COORD001",
      enrollmentDate: "2024-01-15",
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      status: "active" as const,
      schoolYear: "2023-2024",
      program: "Computer Science",
    },
    {
      id: "2",
      studentName: "Bob Smith",
      studentId: "STU002",
      studentAvatar: "",
      companyName: "DataWorks Inc",
      companyId: "COMP002",
      coordinatorName: "Prof. Michael Chen",
      coordinatorId: "COORD002",
      enrollmentDate: "2024-01-20",
      startDate: "2024-02-15",
      endDate: "2024-06-15",
      status: "pending" as const,
      schoolYear: "2023-2024",
      program: "Information Technology",
    },
    {
      id: "3",
      studentName: "Carol Williams",
      studentId: "STU003",
      studentAvatar: "",
      companyName: "Business Pro LLC",
      companyId: "COMP003",
      coordinatorName: "Dr. Emily Rodriguez",
      coordinatorId: "COORD003",
      enrollmentDate: "2023-09-01",
      startDate: "2023-09-15",
      endDate: "2023-12-15",
      status: "completed" as const,
      schoolYear: "2023-2024",
      program: "Business Administration",
    },
  ]);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.coordinatorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (id: string) => {
    console.log("Edit enrollment:", id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    setEnrollments(enrollments.filter((enrollment) => enrollment.id !== id));
  };

  const handleAddEnrollment = () => {
    console.log("Add new enrollment");
    // TODO: Implement add functionality
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Enrollment
          </h1>
          <Button
            onClick={handleAddEnrollment}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Enrollment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {filteredEnrollments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No enrollments found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Enrollment;
