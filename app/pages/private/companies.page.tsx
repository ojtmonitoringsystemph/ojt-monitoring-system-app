import { useEffect, useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import { Button } from "@/components/atoms/button";
import CompanyCard from "@/components/templates/cards/company.card";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { companyService } from "@/services/company.service";

interface Company {
  _id: string;
  name: string;
  address: string;
  description: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

const Companies = ({ userRole, userName, onLogout }: PageProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await companyService.getAll();
        const data = Array.isArray(response) ? response : [];
        setCompanies(data);
      } catch (err: any) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create or edit
  const handleSave = async () => {
    try {
      if (editingCompany) {
        // Update existing company
        const updatedCompany = await companyService.patch({
          _id: editingCompany._id,
          ...formData,
        });
        setCompanies((prev) =>
          prev.map((c) => (c._id === editingCompany._id ? updatedCompany : c))
        );
      } else {
        // Create new company
        const newCompany = await companyService.create(formData);
        setCompanies((prev) => [...prev, newCompany]);
      }

      // Reset
      setShowForm(false);
      setEditingCompany(null);
      setFormData({
        name: "",
        address: "",
        description: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
      });
    } catch (error) {
      console.error("Error saving company:", error);
      alert("Failed to save company.");
    }
  };

  // Open form for editing
  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      address: company.address,
      description: company.description,
      contactPerson: company.contactPerson,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
    });
    setShowForm(true);
  };

  // Cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
    setFormData({
      name: "",
      address: "",
      description: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
    });
  };

  // Delete company
  const handleDelete = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }

    try {
      await companyService.delete(companyId);
      // Remove company from local state
      setCompanies((prev) => prev.filter((c) => c._id !== companyId));
      alert("Company deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting company:", error);
      alert(error?.response?.data?.message || "Failed to delete company");
    }
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-green-700">Companies</h1>
              <p className="text-green-600">
                Manage partner companies and internship opportunities
              </p>
            </div>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
            onClick={() => {
              setEditingCompany(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        {/* Company List */}
        {loading ? (
          <p className="text-green-600">Loading companies...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : companies.length === 0 ? (
          <p className="text-green-600">No companies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company._id} className="relative group">
                <CompanyCard
                  company={{
                    id: company._id,
                    name: company.name,
                    location: company.address,
                    description: company.description,
                    industry: "—",
                    activeInterns: 0,
                    totalInterns: 0,
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(company)}
                    className="p-2 bg-white border border-green-200 rounded-full shadow-sm"
                    title="Edit Company"
                  >
                    <Pencil className="h-4 w-4 text-green-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(company._id)}
                    className="p-2 bg-white border border-red-200 rounded-full shadow-sm"
                    title="Delete Company"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4 border border-green-200">
              <h2 className="text-xl font-bold text-green-700">
                {editingCompany ? "Edit Company" : "Add New Company"}
              </h2>

              <input
                name="name"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-green-300 focus:border-green-500 p-2 rounded"
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-green-300 focus:border-green-500 p-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-green-300 focus:border-green-500 p-2 rounded"
              />
              <input
                name="contactPerson"
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full border border-green-300 focus:border-green-500 p-2 rounded"
              />
              <input
                name="contactEmail"
                placeholder="Contact Email"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border border-green-300 focus:border-green-500 p-2 rounded"
              />
              <input
                name="contactPhone"
                placeholder="Contact Phone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full border border-green-300 focus:border-green-500 p-2 rounded"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleSave}>
                  {editingCompany ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Companies;
