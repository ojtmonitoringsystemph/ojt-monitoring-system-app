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
import { Plus, Search, Edit } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { userService } from "~/app/services/user.service";
import { companyService } from "~/app/services/company.service";
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
  const getAuth = getUserFromLocalStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
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

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await userService.search({ role: "student" });
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
      const response = await userService.search({ role: "student" });
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

  // Add or Edit
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-800">
            {userRole === "coordinator" ? "My Students" : "Students"}
          </h1>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
            }}
          >
            <Plus className="h-4 w-4" /> Add Student
          </Button>
        </div>

        {/* Students Table */}
        <Card className="border-green-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800">
              {userRole === "coordinator" ? "My Students" : "All Students"}
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-green-600">
                Loading students...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-green-300">
                      <th className="text-left p-3 font-medium text-green-700">
                        Full Name
                      </th>
                      <th className="text-left p-3 font-medium text-green-700">
                        Email
                      </th>
                      <th className="text-left p-3 font-medium text-green-700">
                        Program
                      </th>
                      <th className="text-left p-3 font-medium text-green-700">
                        Company
                      </th>
                      <th className="text-left p-3 font-medium text-green-700">
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
                        <td className="p-3 font-medium text-green-800">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="p-3 text-green-700">{student.email}</td>
                        <td className="p-3 text-green-700">
                          {student.program ?? "-"}
                        </td>
                        <td className="p-3 text-green-700">
                          {student.metadata?.company?.name ?? "-"}
                        </td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-100"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && (
                  <div className="text-center py-8 text-green-500">
                    No students found.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add / Edit Student Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-green-800">
                {isEditing ? "Edit Student Assignment" : "Add Enrollment"}
              </h2>

              {!isEditing && (
                <>
                  <Input
                    placeholder="Search student..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                  {searchResults.length > 0 && (
                    <div className="border-green-300 rounded-md p-2 max-h-40 overflow-y-auto">
                      {searchResults.map((s) => (
                        <div
                          key={s._id}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, userId: s._id }))
                          }
                          className={`p-2 cursor-pointer rounded hover:bg-green-50 ${
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
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, companyId: val }))
                }
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
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
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
      </div>
    </PageLayout>
  );
};

export default Students;
