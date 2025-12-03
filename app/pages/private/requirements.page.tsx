import React, { useEffect, useState } from "react";
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
import { Plus, Edit, Trash, Filter } from "lucide-react";

import { requirementService } from "~/app/services/requirement.service";
import { type PageProps } from "@/types/page.type";

interface Requirement {
  _id: string;
  name: string;
  program: "bsit" | "bsba";
}

const RequirementsPage: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [programFilter, setProgramFilter] = useState("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    program: "",
  });

  // Load Requirements
  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const res = await requirementService.getAll();
      setRequirements(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch requirements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  // Open modal for editing
  const handleEdit = (item: Requirement) => {
    setIsEditing(true);
    setEditingId(item._id);
    setFormData({ name: item.name, program: item.program });
    setShowModal(true);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this requirement?")) return;

    try {
      await requirementService.delete(id);
      fetchRequirements();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete requirement");
    }
  };

  // Save or Update
  const handleSubmit = async () => {
    if (!formData.name || !formData.program) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isEditing && editingId) {
        await requirementService.patch({
          _id: editingId,
          name: formData.name,
          program: formData.program,
        });
        alert("Requirement updated!");
      } else {
        await requirementService.create(formData);
        alert("Requirement added!");
      }

      fetchRequirements();
      closeModal();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save requirement");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", program: "" });
  };

  // Filter requirements by program
  const filteredRequirements = requirements.filter((req) => {
    if (programFilter === "all") return true;
    return req.program === programFilter;
  });

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">Requirements</h1>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-full sm:w-40 border-green-300 focus:border-green-500 text-xs sm:text-sm">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-green-600" />
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="bsit">BSIT</SelectItem>
                <SelectItem value="bsba">BSBA</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4"
              onClick={() => {
                setShowModal(true);
                setIsEditing(false);
              }}
            >
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Requirement</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-green-700 text-sm">Loading...</div>
        ) : (
          <>
            {/* Desktop Table View (md and above) */}
            <div className="hidden md:block">
              <Card className="border border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-700">All Requirements</CardTitle>
                </CardHeader>

                <CardContent>
                  <table className="w-full border-collapse mt-3">
                    <thead>
                      <tr className="border-b border-green-200">
                        <th className="p-3 text-left font-medium text-green-700 text-sm">Name</th>
                        <th className="p-3 text-left font-medium text-green-700 text-sm">
                          Program
                        </th>
                        <th className="p-3 text-left font-medium text-green-700 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequirements.map((r) => (
                        <tr key={r._id} className="border-b hover:bg-green-50">
                          <td className="p-3 text-sm">{r.name}</td>
                          <td className="p-3 uppercase text-sm font-medium">{r.program}</td>
                          <td className="p-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-600 hover:bg-green-50 text-xs"
                              onClick={() => handleEdit(r)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 text-white hover:bg-red-700 text-xs"
                              onClick={() => handleDelete(r._id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {filteredRequirements.length === 0 && (
                        <tr>
                          <td className="p-4 text-center text-gray-500 text-sm" colSpan={3}>
                            No requirements found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Card View (below md) */}
            <div className="md:hidden space-y-3">
              {filteredRequirements.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 text-sm">No requirements found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequirements.map((r) => (
                  <Card key={r._id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm text-green-800">{r.name}</h3>
                          <p className="text-xs text-green-600 uppercase mt-1">{r.program}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-green-600 text-green-600 hover:bg-green-50 text-xs"
                          onClick={() => handleEdit(r)}
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 bg-red-600 text-white hover:bg-red-700 text-xs"
                          onClick={() => handleDelete(r._id)}
                        >
                          <Trash className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-lg p-4 sm:p-6 space-y-4 shadow-lg border border-green-200">
              <h2 className="text-lg sm:text-xl font-bold text-green-700">
                {isEditing ? "Edit Requirement" : "Add Requirement"}
              </h2>

              <Input
                placeholder="Requirement name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="border-green-300 focus:border-green-500 text-sm"
              />

              <Select
                value={formData.program}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, program: val }))}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500 text-sm">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bsit">BSIT</SelectItem>
                  <SelectItem value="bsba">BSBA</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 pt-3 flex-col-reverse sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700 text-sm"
                  onClick={handleSubmit}
                >
                  {isEditing ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default RequirementsPage;
