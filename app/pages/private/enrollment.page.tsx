import { useEffect, useState, useCallback } from "react";
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
import { Plus, Filter, Loader2, Search, X } from "lucide-react";
import EnrollmentCard from "@/components/templates/cards/enrollment.card";
import { type PageProps } from "@/types/page.type";
import { userService } from "@/services/user.service";
import { companyService } from "@/services/company.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

// ✅ Debounce Hook
function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

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
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [coordSearchLoading, setCoordSearchLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    userId: "",
    companyId: "",
    coordinatorId: getAuth?.user?._id,
    deploymentDate: "",
    status: "scheduled",
  });

  // ✅ Debounced values
  const debouncedStudentSearch = useDebounce(modalSearchTerm, 5000);
  const debouncedCoordSearch = useDebounce(coordSearchTerm, 5000);

  // 🔁 Fetch enrolled students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await userService.search({ role: "student" });
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

  // ✅ Debounced search for students (API-based)
  useEffect(() => {
    const fetchStudents = async () => {
      if (debouncedStudentSearch.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        setSearchLoading(true);
        const response = await userService.search({
          role: "student",
          firstName: debouncedStudentSearch,
        });
        const data = Array.isArray(response) ? response : [];
        const filtered = data.filter((s: any) => !s.metadata?.company);
        setSearchResults(filtered);
      } catch (error) {
        console.error("Error searching students:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };
    fetchStudents();
  }, [debouncedStudentSearch]);

  // ✅ Debounced search for coordinators (API-based)
  useEffect(() => {
    const fetchCoordinators = async () => {
      if (debouncedCoordSearch.trim().length < 2) {
        setCoordinatorResults([]);
        return;
      }
      try {
        setCoordSearchLoading(true);
        const response = await userService.search({
          role: "coordinator",
          firstName: debouncedCoordSearch,
        });
        const data = Array.isArray(response) ? response : [];
        setCoordinatorResults(data);
      } catch (error) {
        console.error("Error searching coordinators:", error);
        setCoordinatorResults([]);
      } finally {
        setCoordSearchLoading(false);
      }
    };
    fetchCoordinators();
  }, [debouncedCoordSearch]);

  // ✅ Save enrollment
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

  // ✅ Improved search handlers
  const handleModalSearchChange = (value: string) => {
    setModalSearchTerm(value);
    if (value.trim().length < 2) {
      setSearchResults([]);
    }
  };

  const handleCoordSearchChange = (value: string) => {
    setCoordSearchTerm(value);
    if (value.trim().length < 2) {
      setCoordinatorResults([]);
    }
  };

  const clearStudentSearch = () => {
    setModalSearchTerm("");
    setSearchResults([]);
  };

  const clearCoordinatorSearch = () => {
    setCoordSearchTerm("");
    setCoordinatorResults([]);
  };

  // 🧩 Fixed EnrollmentModal Component
  const EnrollmentModal = ({
    title = "", // ✅ Default value to prevent undefined error
    onSave,
    onCancel,
    isEdit = false, // ✅ New prop to explicitly check if it's edit mode
  }: {
    title?: string;
    onSave: () => void;
    onCancel: () => void;
    isEdit?: boolean;
  }) => (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold">
          {title || (isEdit ? "Update Enrollment" : "Add New Enrollment")}
        </h2>

        {/* Student search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search student..."
            value={modalSearchTerm}
            onChange={(e) => handleModalSearchChange(e.target.value)}
            disabled={isEdit} // ✅ Use isEdit prop instead of title.includes()
            className="pl-10 pr-10"
          />
          {modalSearchTerm && (
            <button
              onClick={clearStudentSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {searchLoading && (
          <div className="flex justify-center py-2">
            <Loader2 className="animate-spin text-gray-500 h-5 w-5" />
          </div>
        )}

        {!searchLoading && searchResults.length > 0 && (
          <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
            {searchResults.map((s) => (
              <div
                key={s._id}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, userId: s._id }))
                }
                className={`p-2 cursor-pointer rounded hover:bg-gray-100 transition-colors ${
                  formData.userId === s._id
                    ? "bg-blue-50 border border-blue-200"
                    : ""
                }`}
              >
                <div className="font-medium">
                  {s.firstName} {s.lastName}
                </div>
                <div className="text-sm text-gray-500">{s.email}</div>
              </div>
            ))}
          </div>
        )}

        {!searchLoading &&
          debouncedStudentSearch.trim().length >= 2 &&
          searchResults.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-2">
              No students found.
            </p>
          )}

        {/* Coordinator search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search coordinator..."
            value={coordSearchTerm}
            onChange={(e) => handleCoordSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {coordSearchTerm && (
            <button
              onClick={clearCoordinatorSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {coordSearchLoading && (
          <div className="flex justify-center py-2">
            <Loader2 className="animate-spin text-gray-500 h-5 w-5" />
          </div>
        )}

        {!coordSearchLoading && coordinatorResults.length > 0 && (
          <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
            {coordinatorResults.map((c) => (
              <div
                key={c._id}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, coordinatorId: c._id }))
                }
                className={`p-2 cursor-pointer rounded hover:bg-gray-100 transition-colors ${
                  formData.coordinatorId === c._id
                    ? "bg-blue-50 border border-blue-200"
                    : ""
                }`}
              >
                <div className="font-medium">
                  {c.firstName} {c.lastName}
                </div>
                <div className="text-sm text-gray-500">{c.email}</div>
              </div>
            ))}
          </div>
        )}

        {/* Company Select */}
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

        {/* Deployment Date */}
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
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search student or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            isEdit={false} // ✅ Explicitly set isEdit prop
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
            isEdit={true} // ✅ Explicitly set isEdit prop
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Enrollment;
