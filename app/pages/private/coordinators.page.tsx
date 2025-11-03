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
import { userService } from "@/services/user.service";

interface Coordinator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  specialization?: string;
  status?: string;
  avatar?: string;
  location?: string;
}

const Coordinators: React.FC<PageProps> = ({
  userRole,
  userName,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCoordinator, setEditingCoordinator] =
    useState<Coordinator | null>(null);

  const [formData, setFormData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    specialization: "",
    status: "active",
    location: "",
  });

  // Fetch all coordinators
  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const response = await userService.search({ role: "coordinator" });
      setCoordinators(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search coordinators
  const handleSearchCoordinator = async () => {
    if (searchTerm.trim().length < 2) {
      fetchCoordinators();
      return;
    }

    try {
      setLoading(true);
      const query = { role: "coordinator" };
      const response = await userService.search(query);
      const filtered = (Array.isArray(response) ? response : []).filter(
        (c: Coordinator) =>
          c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCoordinators(filtered);
    } catch (error) {
      console.error("Error searching coordinators:", error);
      setCoordinators([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => handleSearchCoordinator(), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Initial load
  useEffect(() => {
    fetchCoordinators();
  }, []);

  const handleEdit = (coordinator: Coordinator) => {
    setEditingCoordinator(coordinator);
    setFormData({
      _id: coordinator._id,
      firstName: coordinator.firstName,
      lastName: coordinator.lastName,
      email: coordinator.email,
      phone: coordinator.phone || "",
      department: coordinator.department || "",
      specialization: coordinator.specialization || "",
      status: coordinator.status || "active",
      location: coordinator.location || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setCoordinators((prev) => prev.filter((c) => c._id !== id));
  };

  const handleAddCoordinator = () => {
    setEditingCoordinator(null);
    setFormData({
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      specialization: "",
      status: "active",
      location: "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (editingCoordinator) {
        // Update existing coordinator
        await userService.patch(formData);
        alert("Coordinator updated successfully!");
      } else {
        // Add new coordinator
        await userService.create({ ...formData, role: "coordinator" });
        alert("Coordinator added successfully!");
      }
      setShowModal(false);
      fetchCoordinators();
    } catch (error) {
      console.error("Failed to save coordinator:", error);
      alert("Failed to save coordinator.");
    }
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
              <div className="text-center py-8 text-gray-500">
                Loading coordinators...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coordinators.map((coordinator) => (
                    <CoordinatorCard
                      key={coordinator._id}
                      coordinator={{
                        id: coordinator._id,
                        name: `${coordinator.firstName} ${coordinator.lastName}`,
                        email: coordinator.email,
                        phone: coordinator.phone || "N/A",
                        department: coordinator.department || "N/A",
                        specialization: coordinator.specialization || "N/A",
                        studentsAssigned: 0,
                        status:
                          coordinator.status === "inactive"
                            ? "inactive"
                            : "active", // ✅ restrict type
                        avatar: coordinator.avatar || "",
                        location: coordinator.location || "",
                      }}
                      onEdit={() => handleEdit(coordinator)}
                    />
                  ))}
                </div>

                {coordinators.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No coordinators found.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Coordinator Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">
                {editingCoordinator ? "Edit Coordinator" : "Add Coordinator"}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>

              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled
              />
              {/* 
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <Input
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />

              <Input
                placeholder="Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
              />

              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              /> */}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingCoordinator ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Coordinators;
