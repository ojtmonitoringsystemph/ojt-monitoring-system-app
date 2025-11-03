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
import { Plus, Search } from "lucide-react";
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
      if (Array.isArray(response)) setStudents(response);
      else setStudents([]);
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

  // Search students for modal (uses BE /user/search)
  const handleSearchStudent = async () => {
    if (modalSearchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const query = { role: "student" };
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

  const handleSaveEnrollment = async () => {
    if (!formData.userId || !formData.companyId || !formData.deploymentDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      await userService.assignedToCompany({
        ...formData,
        coordinatorId: getAuth?.user?._id,
      });
      alert("Student assigned successfully!");
      fetchStudents();
      setShowModal(false);
      setFormData({
        userId: "",
        companyId: "",
        coordinatorId: getAuth?.user?._id,
        deploymentDate: "",
        status: "scheduled",
      });
      setSearchResults([]);
      setModalSearchTerm("");
    } catch (error) {
      console.error("Failed to assign student:", error);
      alert("Failed to assign student.");
    }
  };

  // Filter visible students (only coordinator’s if coordinator)

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {userRole === "coordinator" ? "My Students" : "Students"}
          </h1>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" /> Add Student
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {userRole === "coordinator" ? "My Students" : "All Students"}
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading students...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Full Name</th>
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-left p-3 font-medium">Program</th>
                      <th className="text-left p-3 font-medium">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="p-3">{student.email}</td>
                        <td className="p-3">{student.program ?? "-"}</td>
                        <td className="p-3">
                          {student.metadata?.company?.name ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No students found.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Enrollment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">Add Enrollment</h2>

              <Input
                placeholder="Search student..."
                value={modalSearchTerm}
                onChange={(e) => setModalSearchTerm(e.target.value)}
              />

              {searchResults.length > 0 && (
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {searchResults.map((s) => (
                    <div
                      key={s._id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, userId: s._id }))
                      }
                      className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
                        formData.userId === s._id ? "bg-gray-200" : ""
                      }`}
                    >
                      {s.firstName} {s.lastName} ({s.email})
                    </div>
                  ))}
                </div>
              )}

              <Select
                value={formData.companyId}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, companyId: val }))
                }
              >
                <SelectTrigger>
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
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEnrollment}>Assign</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Students;
