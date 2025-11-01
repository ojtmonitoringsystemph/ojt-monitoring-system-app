import React, { useEffect, useState } from "react";
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
import { userService } from "@/services/user.service"; // your imported service

const Coordinators = ({ userRole, userName, onLogout }: PageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch coordinators from API
  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({ role: "coordinator" });
      setCoordinators(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const filteredCoordinators = coordinators.filter(
    (coordinator) =>
      `${coordinator.firstName} ${coordinator.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      coordinator.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log("Edit coordinator:", id);
  };

  const handleDelete = (id: string) => {
    setCoordinators((prev) => prev.filter((c) => c._id !== id));
    // Optional: call API to delete if endpoint exists
  };

  const handleAddCoordinator = () => {
    console.log("Add new coordinator");
    // TODO: implement modal or redirect to add coordinator
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
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCoordinators.map((coordinator) => (
                    <CoordinatorCard
                      key={coordinator._id}
                      coordinator={{
                        id: coordinator._id,
                        name: `${coordinator.firstName} ${coordinator.lastName}`,
                        email: coordinator.email,
                        phone: coordinator.phone || "N/A",
                        department: coordinator.department || "N/A",
                        specialization: coordinator.specialization || "N/A",
                        studentsAssigned: coordinator.studentsAssigned || 0,
                        status: coordinator.status || "active",
                        avatar: coordinator.avatar || "",
                        location: coordinator.location || "",
                      }}
                      onEdit={() => handleEdit(coordinator._id)}
                      onDelete={() => handleDelete(coordinator._id)}
                    />
                  ))}
                </div>

                {filteredCoordinators.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No coordinators found matching your search.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Coordinators;
