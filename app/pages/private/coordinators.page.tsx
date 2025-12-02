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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Plus, Search, UserPlus } from "lucide-react";
import CoordinatorCard from "@/components/templates/cards/coordinator.card";
import { type PageProps } from "@/types/page.type";
import { userService } from "@/services/user.service";
import { authService } from "~/app/services/auth.service";

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

  // Coordinator registration form state (changed from student)
  const [registerFormData, setRegisterFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    userName: "",
    role: "coordinator", // Changed to coordinator
    email: "",
    password: "",
    department: "",
    specialization: "",
    phone: "",
    acceptPolicy: false,
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

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

  // Handle coordinator registration (changed from student)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    // Validation
    if (
      !registerFormData.firstName ||
      !registerFormData.lastName ||
      !registerFormData.userName ||
      !registerFormData.email ||
      !registerFormData.password
    ) {
      setRegisterError("Please fill in all required fields.");
      return;
    }

    if (!registerFormData.acceptPolicy) {
      setRegisterError("You must accept the Privacy & Policy to continue.");
      return;
    }

    setRegisterLoading(true);
    try {
      await authService.register(registerFormData);
      alert("Coordinator account created successfully!");
      setShowModal(false);
      resetRegisterForm();
      fetchCoordinators(); // Refresh the coordinator list
    } catch (err: any) {
      console.error(err);
      setRegisterError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const resetRegisterForm = () => {
    setRegisterFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      userName: "",
      role: "coordinator",
      email: "",
      password: "",
      department: "",
      specialization: "",
      phone: "",
      acceptPolicy: false,
    });
    setRegisterError(null);
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setRegisterFormData({
        ...registerFormData,
        [name]: checked,
      });
      return;
    }

    setRegisterFormData({
      ...registerFormData,
      [name]: value,
    });
  };

  const closeModal = () => {
    setShowModal(false);
    resetRegisterForm();
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
    setRegisterFormData({
      firstName: coordinator.firstName,
      middleName: "",
      lastName: coordinator.lastName,
      userName: coordinator.email, // Using email as username
      role: "coordinator",
      email: coordinator.email,
      password: "", // Password not shown for editing
      department: coordinator.department || "",
      specialization: coordinator.specialization || "",
      phone: coordinator.phone || "",
      acceptPolicy: true, // Set to true for editing
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setCoordinators((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-700">Coordinators</h1>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setShowModal(true)}
          >
            <UserPlus className="h-4 w-4" /> Create Coordinator
          </Button>
        </div>

        <Card className="border border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">All Coordinators</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
              <Input
                placeholder="Search coordinators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:border-green-500"
              />
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-green-600">
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
                            : "active",
                        avatar: coordinator.avatar || "",
                        location: coordinator.location || "",
                      }}
                      onEdit={() => handleEdit(coordinator)}
                    />
                  ))}
                </div>

                {coordinators.length === 0 && !loading && (
                  <div className="text-center py-8 text-green-600">
                    No coordinators found.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Coordinator Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto border border-green-200">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                {editingCoordinator
                  ? "Edit Coordinator"
                  : "Create Coordinator Account"}
              </h2>

              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={registerFormData.userName}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  disabled={!!editingCoordinator} // Disable username editing for existing coordinators
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={registerFormData.firstName}
                    onChange={handleRegisterChange}
                    className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={registerFormData.lastName}
                    onChange={handleRegisterChange}
                    className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <Input
                  type="text"
                  name="middleName"
                  placeholder="Middle Name (Optional)"
                  value={registerFormData.middleName}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerFormData.email}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  disabled={!!editingCoordinator} // Disable email editing for existing coordinators
                />

                {!editingCoordinator && (
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={registerFormData.password}
                    onChange={handleRegisterChange}
                    className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                )}

                {/* <Input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={registerFormData.phone}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                /> */}

                {/* <Input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={registerFormData.department}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <Input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={registerFormData.specialization}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                /> */}

                {!editingCoordinator && (
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="acceptPolicy"
                      checked={registerFormData.acceptPolicy}
                      onChange={handleRegisterChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                    />
                    <span>
                      I accept the{" "}
                      <span className="text-green-700 font-medium cursor-pointer underline">
                        Privacy & Policy
                      </span>
                    </span>
                  </label>
                )}

                {registerError && (
                  <p className="text-red-600 text-sm text-center">
                    {registerError}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-100"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={registerLoading}
                    className={`bg-green-600 hover:bg-green-700 text-white ${
                      registerLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {registerLoading
                      ? editingCoordinator
                        ? "Updating..."
                        : "Creating..."
                      : editingCoordinator
                      ? "Update Coordinator"
                      : "Create Account"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Coordinators;
