import React, {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Upload as UploadIcon, FileText } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { documentService } from "~/app/services/document.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { requirementService } from "~/app/services/requirement.service";

interface Document {
  _id: string;
  student: string;
  documents: string[];
  status: string;
}

interface Requirement {
  _id: string;
  name: string;
  program: string;
}

const Upload = ({ userRole, userName, onLogout }: PageProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentsList, setDocumentsList] = useState<Document[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await documentService.student(
        getUserFromLocalStorage()?.user?._id || ""
      );
      setDocumentsList(res || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  const fetchRequirements = async () => {
    try {
      const userCourse = getUserFromLocalStorage()?.user?.program;
      if (!userCourse) {
        setRequirements([]);
        return;
      }

      const response = await requirementService.getAll();

      // Ensure response is an array before filtering
      const filtered = Array.isArray(response)
        ? response.filter(
            (req: any) => req.program === userCourse.toLowerCase()
          )
        : [];

      setRequirements(filtered);
    } catch (err) {
      console.error("Failed to load requirements:", err);
      setRequirements([]);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchRequirements();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filesArray = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles((prev) => [...prev, ...filesArray]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelectedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("student", getUserFromLocalStorage()?.user?._id || "");

    setUploading(true);
    try {
      await documentService.create(formData);
      setSelectedFiles([]);
      fetchDocuments();
      alert("Files uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  const userCourse = getUserFromLocalStorage()?.user?.program || "No Program";

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <UploadIcon className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Upload Documents
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Upload your files — drag and drop or browse manually
            </p>
          </div>
        </div>

        {/* Dynamic Requirements from API */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Required Documents ({userCourse})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {requirements.length > 0 ? (
                requirements.map((req) => <li key={req._id}>{req.name}</li>)
              ) : (
                <li className="text-gray-500">No requirements found.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <UploadIcon className="h-5 w-5 text-primary" /> Upload Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition relative"
            >
              <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Drop files here or click below to browse
              </p>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <Button
                onClick={handleBrowseClick}
                disabled={uploading}
                className="mb-2"
              >
                Browse Files
              </Button>

              {selectedFiles.length > 0 && (
                <div className="mt-3 text-sm text-muted-foreground flex flex-wrap gap-2 justify-center">
                  {selectedFiles.map((f) => (
                    <span
                      key={f.name}
                      className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-xs"
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
              )}

              <Button
                className="mt-4 w-full sm:w-auto"
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Uploaded Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentsList.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No files uploaded yet
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {documentsList.map((doc) =>
                  doc.documents.map((url, idx) => {
                    const isImage = url.match(/\.(jpeg|jpg|png|gif)$/i);
                    return (
                      <div
                        key={`${doc._id}-${idx}`}
                        className="border rounded-md p-3 flex flex-col items-center hover:shadow-lg transition"
                      >
                        {isImage ? (
                          <img
                            src={url}
                            alt="Uploaded"
                            className="h-32 w-32 object-cover mb-2 rounded-md"
                          />
                        ) : (
                          <FileText className="h-12 w-12 mb-2 text-muted-foreground" />
                        )}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {isImage ? "View Image" : "Download File"}
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Upload;
