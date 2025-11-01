import { useEffect, useState } from "react";
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
import { Plus, Filter, Edit } from "lucide-react";
import EnrollmentCard from "@/components/templates/cards/enrollment.card";
import { type PageProps } from "@/types/page.type";
import { userService } from "@/services/user.service";
import { companyService } from "@/services/company.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  program?: string;
  avatar?: string;
  metadata?: {
    company?: { _id: string; name: string };
    coordinator?: { _id: string; firstName: string; lastName: string };
    deploymentDate?: string;
    status?: "scheduled" | "deployed" | "completed";
  };
}

const Enrollment: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const getAuth = getUserFromLocalStorage();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [coordSearchTerm, setCoordSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [students, setStudents] = useState<Student[]>([]);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [coordinatorResults, setCoordinatorResults] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    userId: "",
    companyId: "",
    coordinatorId: getAuth?.user?._id,
    deploymentDate: "",
    status: "scheduled",
  });

  // 🔁 Fetch enrolled students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({ role: "student" });
      const data = Array.isArray(response) ? response : [];
      const enrolled = data.filter((u: any) => u.metadata?.company);
      setStudents(enrolled);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Fetch companies
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

  // 🔍 Search non-enrolled students
  const handleSearchStudent = async () => {
    try {
      const response = await userService.getAll({ role: "student" });
      const data = Array.isArray(response) ? response : [];
      const filtered = data.filter(
        (s: any) =>
          `${s.firstName} ${s.lastName}`
            .toLowerCase()
            .includes(modalSearchTerm.toLowerCase()) && !s.metadata?.company
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  // 🔍 Search coordinators
  const handleSearchCoordinator = async () => {
    try {
      const response = await userService.getAll({ role: "coordinator" });
      const data = Array.isArray(response) ? response : [];
      const filtered = data.filter((c: any) =>
        `${c.firstName} ${c.lastName}`
          .toLowerCase()
          .includes(coordSearchTerm.toLowerCase())
      );
      setCoordinatorResults(filtered);
    } catch (error) {
      console.error("Error searching coordinators:", error);
    }
  };

  // ⏳ Debounce student search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (modalSearchTerm.trim().length > 1) handleSearchStudent();
      else setSearchResults([]);
    }, 400);
    return () => clearTimeout(timeout);
  }, [modalSearchTerm]);

  // ⏳ Debounce coordinator search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (coordSearchTerm.trim().length > 1) handleSearchCoordinator();
      else setCoordinatorResults([]);
    }, 400);
    return () => clearTimeout(timeout);
  }, [coordSearchTerm]);

  // ✅ Save enrollment (create or update)
  const handleSaveEnrollment = async (isUpdate = false) => {
    try {
      if (!formData.userId || !formData.companyId || !formData.deploymentDate) {
        alert("Please complete all fields before saving.");
        return;
      }

      if (isUpdate) {
        await userService.patch({
          _id: formData.userId,
          ...formData,
        });
        alert("Enrollment updated successfully!");
      } else {
        await userService.assignedToCompany({
          ...formData,
          coordinatorId: formData.coordinatorId,
        });
        alert("Student assigned successfully!");
      }

      await fetchStudents();
      setShowModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving enrollment:", error);
      alert("Failed to save enrollment.");
    }
  };

  const resetForm = () => {
    setSearchResults([]);
    setCoordinatorResults([]);
    setModalSearchTerm("");
    setCoordSearchTerm("");
    setFormData({
      userId: "",
      companyId: "",
      coordinatorId: getAuth?.user?._id,
      deploymentDate: "",
      status: "scheduled",
    });
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.metadata?.company?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || student.metadata?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🧩 Reusable modal
  const EnrollmentModal = ({
    title,
    onSave,
    onCancel,
  }: {
    title: string;
    onSave: () => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">{title}</h2>

        {/* Student search */}
        <Input
          placeholder="Search student..."
          value={modalSearchTerm}
          onChange={(e) => setModalSearchTerm(e.target.value)}
          disabled={title.includes("Update")}
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

        {/* Coordinator search */}
        <Input
          placeholder="Search coordinator..."
          value={coordSearchTerm}
          onChange={(e) => setCoordSearchTerm(e.target.value)}
        />
        {coordinatorResults.length > 0 && (
          <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
            {coordinatorResults.map((c) => (
              <div
                key={c._id}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, coordinatorId: c._id }))
                }
                className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
                  formData.coordinatorId === c._id ? "bg-gray-200" : ""
                }`}
              >
                {c.firstName} {c.lastName} ({c.email})
              </div>
            ))}
          </div>
        )}

        {/* Company */}
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

        {/* Deployment date */}
        <Input
          type="date"
          value={formData.deploymentDate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, deploymentDate: e.target.value }))
          }
        />

        {/* Status */}
        <Select
          value={formData.status}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, status: val }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Enrollment
          </h1>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Enrollment
          </Button>
        </div>

        {/* Search + Filter */}
        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
            <div className="flex gap-4">
              <Input
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <EnrollmentCard
                  key={student._id}
                  enrollment={{
                    id: student._id,
                    studentName: `${student.firstName} ${student.lastName}`,
                    studentId: student._id,
                    studentAvatar: student.avatar || "",
                    companyName:
                      student.metadata?.company?.name || "Unassigned",
                    companyId: student.metadata?.company?._id || "",
                    coordinatorName: student.metadata?.coordinator
                      ? `${student.metadata.coordinator.firstName} ${student.metadata.coordinator.lastName}`
                      : "N/A",
                    coordinatorId: student.metadata?.coordinator?._id || "",
                    enrollmentDate: "",
                    startDate: student.metadata?.deploymentDate || "",
                    endDate: "",
                    status: student.metadata?.status || "scheduled",
                    program: student.program || "N/A",
                    schoolYear: "2024-2025",
                  }}
                  onEdit={() => {
                    setFormData({
                      userId: student._id,
                      companyId: student.metadata?.company?._id || "",
                      coordinatorId:
                        student.metadata?.coordinator?._id ||
                        getAuth?.user?._id,
                      deploymentDate: student.metadata?.deploymentDate || "",
                      status: student.metadata?.status || "scheduled",
                    });
                    setShowEditModal(true);
                  }}
                  onDelete={() => {}}
                />
              ))}
            </div>

            {!loading && filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No enrolled students found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Modal */}
        {showModal && (
          <EnrollmentModal
            title="Add New Enrollment"
            onSave={() => handleSaveEnrollment(false)}
            onCancel={() => {
              setShowModal(false);
              resetForm();
            }}
          />
        )}

        {/* Update Modal */}
        {showEditModal && (
          <EnrollmentModal
            title="Update Enrollment"
            onSave={() => handleSaveEnrollment(true)}
            onCancel={() => {
              setShowEditModal(false);
              resetForm();
            }}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Enrollment;
