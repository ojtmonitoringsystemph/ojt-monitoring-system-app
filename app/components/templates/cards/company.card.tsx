import React from "react";
import { Building2, Users, MapPin, Globe } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";

interface Company {
  id: string;
  name: string;
  description: string;
  location: string;
  website?: string;
  activeInterns: number;
  totalInterns: number;
  industry: string;
}

interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick }) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {company.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {company.location}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline">{company.industry}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {company.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {company.activeInterns} active, {company.totalInterns} total
              interns
            </span>
          </div>
        </div>

        {company.website && (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
