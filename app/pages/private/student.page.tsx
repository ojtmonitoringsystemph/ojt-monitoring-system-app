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

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll({ role: "student" });
      setStudents(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching students:", error);
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
    const filtered = students.filter(
      (s) =>
        !s.metadata?.company &&
        `${s.firstName} ${s.lastName}`
          .toLowerCase()
          .includes(modalSearchTerm.toLowerCase())
    );
    setSearchResults(filtered);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (modalSearchTerm.trim().length > 1) handleSearchStudent();
      else setSearchResults([]);
    }, 300);
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
      console.error(error);
      alert("Failed to assign student.");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      student.metadata?.coordinator?._id === getAuth?.user?._id
  );

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
                    {filteredStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="border-b hover:bg-accent/50"
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
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
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
