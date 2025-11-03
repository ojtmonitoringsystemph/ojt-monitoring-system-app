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

interface Document {
  _id: string;
  student: string;
  documents: string[];
  status: string;
}

const Upload = ({ userRole, userName, onLogout }: PageProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentsList, setDocumentsList] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  // Reference to hidden file input
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

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleBrowseClick = () => {
    // Manually trigger file input
    fileInputRef.current?.click();
  };

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

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <UploadIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Upload Documents
            </h1>
            <p className="text-muted-foreground">
              Upload your files — drag and drop or browse manually
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5" /> File Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
            >
              <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Drop files here or click below to browse
              </p>

              {/* Hidden input triggered by button */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <Button onClick={handleBrowseClick} disabled={uploading}>
                Browse Files
              </Button>

              {selectedFiles.length > 0 && (
                <div className="mt-3 text-sm text-muted-foreground">
                  {selectedFiles.map((f) => f.name).join(", ")}
                </div>
              )}

              <Button
                className="mt-4"
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            {documentsList.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No files uploaded yet
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documentsList.map((doc) =>
                  doc.documents.map((url, idx) => {
                    const isImage = url.match(/\.(jpeg|jpg|png|gif)$/i);
                    return (
                      <div
                        key={`${doc._id}-${idx}`}
                        className="border rounded-md p-2 flex flex-col items-center"
                      >
                        {isImage ? (
                          <img
                            src={url}
                            alt="Uploaded"
                            className="h-32 w-32 object-cover mb-2 rounded"
                          />
                        ) : (
                          <FileText className="h-12 w-12 mb-2" />
                        )}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 underline"
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
