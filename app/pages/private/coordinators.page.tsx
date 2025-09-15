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
import CoordinatorCard from "@/components/templates/cards/coordinator.card";
import { type PageProps } from "@/types/page.type";

const Coordinators = ({ userRole, userName, onLogout }: PageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinators, setCoordinators] = useState([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+1 (555) 123-4567",
      department: "Computer Science",
      location: "Building A, Room 302",
      avatar: "",
      studentsAssigned: 15,
      specialization: "Software Engineering",
      status: "active" as const,
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
      phone: "+1 (555) 234-5678",
      department: "Information Technology",
      location: "Building B, Room 205",
      avatar: "",
      studentsAssigned: 12,
      specialization: "Data Science",
      status: "active" as const,
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@university.edu",
      phone: "+1 (555) 345-6789",
      department: "Business Administration",
      location: "Building C, Room 150",
      avatar: "",
      studentsAssigned: 20,
      specialization: "Project Management",
      status: "inactive" as const,
    },
  ]);

  const filteredCoordinators = coordinators.filter(
    (coordinator) =>
      coordinator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordinator.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordinator.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log("Edit coordinator:", id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    setCoordinators(
      coordinators.filter((coordinator) => coordinator.id !== id)
    );
  };

  const handleAddCoordinator = () => {
    console.log("Add new coordinator");
    // TODO: Implement add functionality
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Coordinators</h1>
          <Button
            onClick={handleAddCoordinator}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Coordinator
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Coordinators</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search coordinators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoordinators.map((coordinator) => (
                <CoordinatorCard
                  key={coordinator.id}
                  coordinator={coordinator}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {filteredCoordinators.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No coordinators found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Coordinators;
