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
import { Plus, Edit, Trash } from "lucide-react";

import { requirementService } from "~/app/services/requirement.service";
import { type PageProps } from "@/types/page.type";

interface Requirement {
  _id: string;
  name: string;
  program: "bsit" | "bsba";
}

const RequirementsPage: React.FC<PageProps> = ({
  userRole,
  userName,
  onLogout,
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-700">Requirements</h1>

          <Button
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
            }}
          >
            <Plus className="h-4 w-4" /> Add Requirement
          </Button>
        </div>

        <Card className="border border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">All Requirements</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-6 text-green-700">Loading...</div>
            ) : (
              <table className="w-full border-collapse mt-3">
                <thead>
                  <tr className="border-b border-green-200">
                    <th className="p-3 text-left font-medium text-green-700">
                      Name
                    </th>
                    <th className="p-3 text-left font-medium text-green-700">
                      Program
                    </th>
                    <th className="p-3 text-left font-medium text-green-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((r) => (
                    <tr key={r._id} className="border-b hover:bg-green-50">
                      <td className="p-3">{r.name}</td>
                      <td className="p-3 uppercase">{r.program}</td>
                      <td className="p-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                          onClick={() => handleEdit(r)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(r._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {requirements.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-gray-500" colSpan={3}>
                        No requirements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg p-6 space-y-4 shadow-lg border border-green-200">
              <h2 className="text-xl font-bold text-green-700">
                {isEditing ? "Edit Requirement" : "Add Requirement"}
              </h2>

              <Input
                placeholder="Requirement name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-green-300 focus:border-green-500"
              />

              <Select
                value={formData.program}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, program: val }))
                }
              >
                <SelectTrigger className="border-green-300 focus:border-green-500">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bsit">BSIT</SelectItem>
                  <SelectItem value="bsba">BSBA</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
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
