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
  remarks: string;
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

        {/* Uploaded Documents */}
        <div
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
            padding: "2rem",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#2e7d32",
                marginBottom: "0.5rem",
              }}
            >
              Your Uploaded Documents
            </h2>
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              Track the status of your submitted documents and coordinator feedback
            </p>
          </div>

          {documentsList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
              <p style={{ color: "#666", fontSize: "1.1rem" }}>No documents uploaded yet.</p>
              <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Upload your first document using the form above.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {documentsList.map((doc) => {
                const getStatusBadgeColor = (status: string) => {
                  switch (status.toLowerCase()) {
                    case "approved":
                      return { bg: "#e8f5e9", text: "#2e7d32", border: "#81c784" };
                    case "rejected":
                      return { bg: "#ffebee", text: "#c62828", border: "#e57373" };
                    default:
                      return { bg: "#fff3e0", text: "#ef6c00", border: "#ffb74d" };
                  }
                };
                const statusColors = getStatusBadgeColor(doc.status);

                return (
                  <div
                    key={doc._id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid #e0e0e0",
                      transition: "box-shadow 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Header Section */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1rem",
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: "1rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            color: "#2e7d32",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {doc.documentName}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "1.5rem",
                            flexWrap: "wrap",
                            fontSize: "0.9rem",
                            color: "#666",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: "500", color: "#444" }}>Program:</span>{" "}
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontWeight: "600",
                                color: "#2e7d32",
                              }}
                            >
                              {doc.student.program || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "0.4rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          border: `1px solid ${statusColors.border}`,
                        }}
                      >
                        {doc.status}
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                        fontSize: "0.85rem",
                        color: "#888",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: "500" }}>Uploaded:</span>{" "}
                        {new Date(doc.uploadedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div>
                        <span style={{ fontWeight: "500" }}>Files:</span> {doc.documents.length}
                      </div>
                    </div>

                    {/* Coordinator Remarks Section */}
                    {doc.remarks && (
                      <div
                        style={{
                          backgroundColor:
                            doc.status === "approved"
                              ? "#f9fbe7"
                              : doc.status === "rejected"
                              ? "#ffebee"
                              : "#f3f4f6",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          marginBottom: "1rem",
                          border:
                            doc.status === "approved"
                              ? "1px solid #f0f4c3"
                              : doc.status === "rejected"
                              ? "1px solid #ffcdd2"
                              : "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}
                        >
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              color:
                                doc.status === "approved"
                                  ? "#2e7d32"
                                  : doc.status === "rejected"
                                  ? "#c62828"
                                  : "#666",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {doc.status === "approved"
                              ? "✓ Coordinator Approved"
                              : doc.status === "rejected"
                              ? "✗ Coordinator Feedback"
                              : "📝 Coordinator Notes"}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            color: "#444",
                            margin: 0,
                            lineHeight: "1.4",
                          }}
                        >
                          {doc.remarks}
                        </p>
                      </div>
                    )}

                    {/* Files Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      {doc.documents.map((fileUrl, index) => {
                        const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif)$/i);
                        return (
                          <div
                            key={`${doc._id}-${index}`}
                            style={{
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              padding: "0.75rem",
                              backgroundColor: "#fafafa",
                              textAlign: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f5f5f5";
                              e.currentTarget.style.borderColor = "#2e7d32";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#fafafa";
                              e.currentTarget.style.borderColor = "#e0e0e0";
                            }}
                          >
                            {isImage ? (
                              <img
                                src={fileUrl}
                                alt={`Document ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  marginBottom: "0.5rem",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  fontSize: "2.5rem",
                                  marginBottom: "0.5rem",
                                  color: "#2e7d32",
                                }}
                              >
                                📄
                              </div>
                            )}
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-block",
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.8rem",
                                color: "#fff",
                                backgroundColor: "#2e7d32",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontWeight: "500",
                                transition: "background-color 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = "#1b5e20")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "#2e7d32")
                              }
                            >
                              {isImage ? "View Image" : "Download"}
                            </a>
                            <div
                              style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#999" }}
                            >
                              File {index + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Upload;
