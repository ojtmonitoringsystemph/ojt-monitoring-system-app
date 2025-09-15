import React, { useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Plus, Search } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const Students: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students] = useState([
    {
      id: "1",
      schoolId: "CS2021001",
      name: "John Smith",
      course: "Computer Science",
      phone: "+1 (555) 123-4567",
      email: "john.smith@student.edu",
      address: "123 Main St, City, State 12345",
      schoolYear: "2023-2024",
      organization: "Tech Solutions Inc.",
    },
    {
      id: "2",
      schoolId: "IT2021005",
      name: "Alice Johnson",
      course: "Information Technology",
      phone: "+1 (555) 234-5678",
      email: "alice.johnson@student.edu",
      address: "456 Oak Ave, City, State 12345",
      schoolYear: "2023-2024",
      organization: "Digital Innovations",
    },
    {
      id: "3",
      schoolId: "SE2021008",
      name: "Bob Wilson",
      course: "Software Engineering",
      phone: "+1 (555) 345-6789",
      email: "bob.wilson@student.edu",
      address: "789 Pine St, City, State 12345",
      schoolYear: "2023-2024",
      organization: "StartUp Labs",
    },
    {
      id: "4",
      schoolId: "CS2021012",
      name: "Emma Davis",
      course: "Computer Science",
      phone: "+1 (555) 456-7890",
      email: "emma.davis@student.edu",
      address: "321 Elm Dr, City, State 12345",
      schoolYear: "2023-2024",
      organization: "Enterprise Systems",
    },
  ]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.schoolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            {userRole === "coordinator" ? "My Students" : "Students"}
          </h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {userRole === "coordinator"
                ? "Master List of Students"
                : "All Students"}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">School ID</th>
                    <th className="text-left p-3 font-medium">Full Name</th>
                    <th className="text-left p-3 font-medium">Course</th>
                    <th className="text-left p-3 font-medium">Phone</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Address</th>
                    <th className="text-left p-3 font-medium">School Year</th>
                    <th className="text-left p-3 font-medium">Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-accent/50"
                    >
                      <td className="p-3 font-medium">{student.schoolId}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.course}</td>
                      <td className="p-3">{student.phone}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3">{student.address}</td>
                      <td className="p-3">{student.schoolYear}</td>
                      <td className="p-3">{student.organization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No students found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Students;
