import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "@/components/templates/layout/page.layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Plus, Search, Edit, UserPlus, Trash2 } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { userService } from "~/app/services/user.service";
import { companyService } from "~/app/services/company.service";
import { authService } from "~/app/services/auth.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  program?: string;
  metadata?: {
    company?: { _id: string; name: string };
    coordinator?: { _id: string; firstName: string; lastName: string };
    deploymentDate?: string;
    status?: string;
  };
}

const Students: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const navigate = useNavigate();
  const getAuth = getUserFromLocalStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    userId: "",
    companyId: "",
    coordinatorId: getAuth?.user?._id,
    deploymentDate: "",
    status: "scheduled",
  });

  // Registration form state
  const [registerFormData, setRegisterFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    userName: "",
    role: "student",
    email: "",
    password: "",
    program: "",
    acceptPolicy: false,
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Get logged-in user's data from localStorage
      const userData = getUserFromLocalStorage();
      const actualUserRole = userData?.user?.role;
      const userProgram = userData?.user?.program;

      // Build query
      const query: any = { role: "student" };

      // Coordinators should only see students from their program
      if (actualUserRole === "coordinator" && userProgram) {
        query.program = userProgram.toLowerCase();
      }

      const response = await userService.search(query);
      setStudents(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAll();
      setCompanies(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCompanies();
  }, []);

  // Search students for modal
  const handleSearchStudent = async () => {
    if (modalSearchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      // Get logged-in user's data from localStorage
      const userData = getUserFromLocalStorage();
      const actualUserRole = userData?.user?.role;
      const userProgram = userData?.user?.program;

      // Build query
      const query: any = { role: "student" };

      // Coordinators should only see students from their program
      if (actualUserRole === "coordinator" && userProgram) {
        query.program = userProgram.toLowerCase();
      }

      const response = await userService.search(query);
      const filtered = (Array.isArray(response) ? response : []).filter(
        (s: Student) =>
          !s.metadata?.company &&
          (s.firstName.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
            s.lastName.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(modalSearchTerm.toLowerCase()))
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching students:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleSearchStudent(), 300);
    return () => clearTimeout(timeout);
  }, [modalSearchTerm]);

  // Add or Edit student assignment
  const handleSaveOrUpdate = async () => {
    if (!formData.userId || !formData.companyId || !formData.deploymentDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isEditing && editingStudentId) {
        // 🔹 Update existing student assignment
        await userService.patch({
          _id: editingStudentId,
          metadata: {
            company: formData.companyId,
            coordinator: formData.coordinatorId,
            deploymentDate: formData.deploymentDate,
            status: formData.status,
          },
        });
        alert("Student details updated successfully!");
      } else {
        // 🔹 Assign new student to company
        await userService.assignedToCompany({
          ...formData,
          coordinatorId: getAuth?.user?._id,
        });
        alert("Student assigned successfully!");
      }

      fetchStudents();
      closeModal();
    } catch (error) {
      console.error("Failed to save or update student:", error);
      alert("Failed to process request.");
    }
  };

  // Handle student registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    // Validation
    if (
      !registerFormData.firstName ||
      !registerFormData.lastName ||
      !registerFormData.userName ||
      !registerFormData.email ||
      !registerFormData.password ||
      !registerFormData.program
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
      alert("Student account created successfully!");
      setShowRegisterModal(false);
      resetRegisterForm();
      fetchStudents(); // Refresh the student list
    } catch (err: any) {
      console.error(err);
      setRegisterError(err.response?.data?.message || "Registration failed. Please try again.");
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
      role: "student",
      email: "",
      password: "",
      program: "",
      acceptPolicy: false,
    });
    setRegisterError(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setIsEditing(false);
    setEditingStudentId(null);
    setFormData({
      userId: "",
      companyId: "",
      coordinatorId: getAuth?.user?._id,
      deploymentDate: "",
      status: "scheduled",
    });
    setSearchResults([]);
    setModalSearchTerm("");
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    resetRegisterForm();
  };

  const handleEditStudent = (student: Student) => {
    setIsEditing(true);
    setShowModal(true);
    setEditingStudentId(student._id);
    setFormData({
      userId: student._id,
      companyId: student.metadata?.company?._id ?? "",
      coordinatorId: student.metadata?.coordinator?._id ?? getAuth?.user?._id,
      deploymentDate: student.metadata?.deploymentDate ?? "",
      status: student.metadata?.status ?? "scheduled",
    });
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return;
    }

    try {
      await userService.delete(studentId);
      // Remove student from local state
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
      alert("Student deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting student:", error);
      alert(error?.response?.data?.message || "Failed to delete student");
    }
  };

  const filteredStudents = students.filter((s) => {
    const search = searchTerm.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(search) ||
      s.lastName.toLowerCase().includes(search) ||
      s.email.toLowerCase().includes(search)
    );
  });

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
            {userRole === "coordinator" ? "My Students" : "Students"}
          </h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none text-xs sm:text-sm"
              onClick={() => setShowRegisterModal(true)}
            >
              <UserPlus className="h-4 w-4" /> Create Student
            </Button>
            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none text-xs sm:text-sm"
              onClick={() => {
                setShowModal(true);
                setIsEditing(false);
              }}
            >
              <Plus className="h-4 w-4" /> Assign Student
            </Button>
          </div>
        </div>

        {/* Students Table */}
        <Card className="border-green-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-green-800">
              {userRole === "coordinator" ? "My Students" : "All Students"}
            </CardTitle>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-green-600 text-sm">Loading students...</div>
            ) : (
              <>
                {/* Desktop Table View (md and above) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-green-300">
                        <th className="text-left p-3 font-medium text-green-700 text-sm">
                          Full Name
                        </th>
                        <th className="text-left p-3 font-medium text-green-700 text-sm">Email</th>
                        <th className="text-left p-3 font-medium text-green-700 text-sm">
                          Program
                        </th>
                        <th className="text-left p-3 font-medium text-green-700 text-sm">
                          Company
                        </th>
                        <th className="text-left p-3 font-medium text-green-700 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr
                          key={student._id}
                          className="border-b border-green-200 hover:bg-green-50"
                        >
                          <td className="p-3 font-medium text-green-800 text-sm">
                            {student.firstName} {student.lastName}
                          </td>
                          <td className="p-3 text-green-700 text-sm">{student.email}</td>
                          <td className="p-3 text-green-700 text-sm">{student.program ?? "-"}</td>
                          <td className="p-3 text-green-700 text-sm">
                            {student.metadata?.company?.name ?? "-"}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-100 text-xs"
                                onClick={() => handleEditStudent(student)}
                              >
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1 border-red-500 text-red-600 hover:bg-red-100 text-xs"
                                onClick={() => handleDeleteStudent(student._id)}
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {students.length === 0 && (
                    <div className="text-center py-8 text-green-500 text-sm">
                      No students found.
                    </div>
                  )}
                </div>

                {/* Mobile Card View (below md) */}
                <div className="md:hidden space-y-3">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-green-500 text-sm">
                      No students found.
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <Card key={student._id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-sm text-green-800">
                                {student.firstName} {student.lastName}
                              </h3>
                              <p className="text-xs text-green-600 truncate">{student.email}</p>
                            </div>
                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded whitespace-nowrap">
                              {student.program ?? "N/A"}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-green-200">
                            <p className="text-xs text-green-600 mb-2">Company</p>
                            <p className="text-sm font-medium text-green-800">
                              {student.metadata?.company?.name ?? "Not assigned"}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 flex items-center justify-center gap-1 border-green-500 text-green-600 hover:bg-green-100 text-xs"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 flex items-center justify-center gap-1 border-red-500 text-red-600 hover:bg-red-100 text-xs"
                              onClick={() => handleDeleteStudent(student._id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Assign Student Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold text-green-800">
                {isEditing ? "Edit Student Assignment" : "Assign Student to Company"}
              </h2>

              {!isEditing && (
                <>
                  <Input
                    placeholder="Search student..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                  {searchResults.length > 0 && (
                    <div className="border border-green-300 rounded-md p-2 max-h-40 overflow-y-auto">
                      {searchResults.map((s) => (
                        <div
                          key={s._id}
                          onClick={() => setFormData((prev) => ({ ...prev, userId: s._id }))}
                          className={`p-2 cursor-pointer rounded hover:bg-green-50 text-sm ${
                            formData.userId === s._id ? "bg-green-100" : ""
                          }`}
                        >
                          {s.firstName} {s.lastName} ({s.email})
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <Select
                value={formData.companyId}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, companyId: val }))}
              >
                <SelectTrigger className="border-green-300 focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={formData.deploymentDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deploymentDate: e.target.value,
                  }))
                }
                className="border-green-300 focus:ring-green-500 focus:border-green-500"
              />

              <Select
                value={formData.status}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
              >
                <SelectTrigger className="border-green-300 focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-100"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSaveOrUpdate}
                >
                  {isEditing ? "Update" : "Assign"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Student Account Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-4">
                Create Student Account
              </h2>

              <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                <Input
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={registerFormData.userName}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                />

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
                  name="middleName"
                  placeholder="Middle Name"
                  value={registerFormData.middleName}
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

                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerFormData.email}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerFormData.password}
                  onChange={handleRegisterChange}
                  className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <Select
                  value={registerFormData.program}
                  onValueChange={(val) =>
                    setRegisterFormData((prev) => ({ ...prev, program: val }))
                  }
                >
                  <SelectTrigger className="border-green-300 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bsit">BSIT</SelectItem>
                    <SelectItem value="bsba">BSBA</SelectItem>
                  </SelectContent>
                </Select>

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

                {registerError && (
                  <p className="text-red-600 text-sm text-center">{registerError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-100"
                    onClick={closeRegisterModal}
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
                    {registerLoading ? "Creating..." : "Create Account"}
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

export default Students;
