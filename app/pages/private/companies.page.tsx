import { useEffect, useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import { Button } from "@/components/atoms/button";
import CompanyCard from "@/components/templates/cards/company.card";
import { Building2, Plus } from "lucide-react";
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create
  const handleCreate = async () => {
    try {
      const newCompany = await companyService.create(formData);
      setCompanies((prev) => [...prev, newCompany]);
      setShowForm(false);
      setFormData({
        name: "",
        address: "",
        description: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
      });
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company.");
    }
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Companies</h1>
              <p className="text-muted-foreground">
                Manage partner companies and internship opportunities
              </p>
            </div>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        {/* Company List */}
        {loading ? (
          <p className="text-muted-foreground">Loading companies...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : companies.length === 0 ? (
          <p className="text-muted-foreground">No companies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company._id}
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
            ))}
          </div>
        )}

        {/* Form Modal (No external modal lib used) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">Add New Company</h2>

              <input
                name="name"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="contactPerson"
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="contactEmail"
                placeholder="Contact Email"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="contactPhone"
                placeholder="Contact Phone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Companies;
