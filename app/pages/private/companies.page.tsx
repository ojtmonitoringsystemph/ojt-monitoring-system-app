import PageLayout from "@/components/templates/layout/page.layout";
import { Button } from "@/components/atoms/button";
import CompanyCard from "@/components/templates/cards/company.card";
import { Building2, Plus } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const Companies = ({ userRole, userName, onLogout }: PageProps) => {
  const companies = [
    {
      id: "1",
      name: "TechCorp Solutions",
      industry: "Technology",
      location: "San Francisco, CA",
      activeInterns: 5,
      totalInterns: 12,
      description:
        "Leading software development company specializing in enterprise solutions.",
    },
    {
      id: "2",
      name: "Digital Innovations Inc.",
      industry: "Digital Marketing",
      location: "New York, NY",
      activeInterns: 3,
      totalInterns: 8,
      description:
        "Innovative digital marketing agency helping businesses grow online.",
    },
    {
      id: "3",
      name: "CloudTech Systems",
      industry: "Cloud Computing",
      location: "Seattle, WA",
      activeInterns: 4,
      totalInterns: 10,
      description:
        "Cloud infrastructure and services provider for modern businesses.",
    },
  ];

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
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
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Companies;
