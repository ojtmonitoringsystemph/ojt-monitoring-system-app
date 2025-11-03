import React, { useEffect, useState, type ChangeEvent } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { FileText, Upload } from "lucide-react";

import { type PageProps } from "@/types/page.type";
import { documentService } from "~/app/services/document.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Document {
  _id: string;
  student: string;
  documents: string[];
  status: "pending" | "approved";
  remarks?: string;
}

const Documents: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch documents on mount
  const fetchDocuments = async () => {
    try {
      const res = await documentService.student(
        getUserFromLocalStorage()?.user?._id || ""
      );
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // You can add additional fields like student ID or remarks
    formData.append("student", getUserFromLocalStorage()?.user?._id || "");
    formData.append("remarks", "Some remarks");

    setUploading(true);
    try {
      await documentService.create(formData);
      setFiles([]);
      fetchDocuments(); // refresh after upload
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Document Review
              </h1>
              <p className="text-muted-foreground">
                Review and approve student documents
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="document-upload"
            />
            <label htmlFor="document-upload">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Select Files
              </Button>
            </label>
            <Button
              variant="default"
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No documents pending review
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li
                    key={doc._id}
                    className="border p-3 rounded-md flex justify-between items-center"
                  >
                    <span>{doc.student}</span>
                    <Button
                      variant="link"
                      onClick={() => window.open(doc.documents[0], "_blank")}
                    >
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Documents;
