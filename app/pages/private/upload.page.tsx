import React, { useState, useEffect, useRef, type ChangeEvent, type DragEvent } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Upload as UploadIcon, FileText } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { documentService } from "~/app/services/document.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { requirementService } from "~/app/services/requirement.service";

interface Document {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    program?: string;
  };
  documentName: string;
  documents: string[];
  status: string;
  uploadedAt: string;
}

interface Requirement {
  _id: string;
  name: string;
  program: string;
}

const Upload = ({ userRole, userName, onLogout }: PageProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [documentsList, setDocumentsList] = useState<Document[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await documentService.student(getUserFromLocalStorage()?.user?._id || "");
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
        ? response.filter((req: any) => req.program === userCourse.toLowerCase())
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
    if (!selectedFiles.length) {
      alert("Please select at least one file");
      return;
    }

    if (!documentName.trim()) {
      alert("Please enter a document name");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("student", getUserFromLocalStorage()?.user?._id || "");
    formData.append("documentName", documentName.trim());

    setUploading(true);
    try {
      await documentService.create(formData);
      setSelectedFiles([]);
      setDocumentName("");
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
            <h1 className="text-3xl font-extrabold text-foreground">Upload Documents</h1>
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
            {/* Document Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g., School ID, Birth Certificate, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition relative"
            >
              <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Drop files here or click below to browse</p>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <Button onClick={handleBrowseClick} disabled={uploading} className="mb-2">
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
            <CardTitle className="text-lg font-semibold">Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {documentsList.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No documents uploaded yet</p>
            ) : (
              <div className="space-y-4">
                {documentsList.map((doc) => (
                  <div key={doc._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{doc.documentName}</h3>
                        <p className="text-sm text-gray-500">
                          Status: <span className="font-medium capitalize">{doc.status}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {doc.documents.length} file(s)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {doc.documents.map((url, idx) => {
                        const isImage = url.match(/\.(jpeg|jpg|png|gif)$/i);
                        return (
                          <div
                            key={`${doc._id}-${idx}`}
                            className="border rounded-md p-3 flex flex-col items-center bg-gray-50"
                          >
                            {isImage ? (
                              <img
                                src={url}
                                alt="Uploaded"
                                className="h-24 w-24 object-cover mb-2 rounded-md"
                              />
                            ) : (
                              <FileText className="h-12 w-12 mb-2 text-muted-foreground" />
                            )}
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {isImage ? "View Image" : "Download File"}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Upload;
