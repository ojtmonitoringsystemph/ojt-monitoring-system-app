import React, {
  useState,
  useEffect,
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
import { Upload as UploadIcon, FileText, Image } from "lucide-react";
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
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentsList, setDocumentsList] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch existing uploaded files
  const fetchDocuments = async () => {
    try {
      const res = await documentService.getAll();
      setDocumentsList(res || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle file selection from file dialog
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "documents" | "images"
  ) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    if (type === "documents")
      setDocumentFiles((prev) => [...prev, ...filesArray]);
    else setImageFiles((prev) => [...prev, ...filesArray]);
  };

  // Handle drag-and-drop
  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    type: "documents" | "images"
  ) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (type === "documents") setDocumentFiles((prev) => [...prev, ...files]);
    else setImageFiles((prev) => [...prev, ...files]);
  };

  // Upload files to backend
  const handleUpload = async (type: "documents" | "images") => {
    const files = type === "documents" ? documentFiles : imageFiles;
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("student", getUserFromLocalStorage()?.user?._id || "");

    setUploading(true);
    try {
      await documentService.create(formData);
      type === "documents" ? setDocumentFiles([]) : setImageFiles([]);
      fetchDocuments();
      alert("Files uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  // Render upload card (documents/images)
  const renderUploadCard = (
    title: string,
    files: File[],
    type: "documents" | "images",
    Icon: React.FC<any>
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
        >
          <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Drop {title.toLowerCase()} here or click to browse
          </p>

          {/* Hidden input triggered by label */}
          <input
            type="file"
            id={`${type}-input`}
            multiple
            onChange={(e) => handleFileChange(e, type)}
            className="hidden"
          />
          <label htmlFor={`${type}-input`} className="cursor-pointer">
            <Button disabled={uploading}>Choose Files</Button>
          </label>

          {/* Show selected files */}
          {files.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              {files.map((f) => f.name).join(", ")}
            </div>
          )}

          <Button
            className="mt-3"
            onClick={() => handleUpload(type)}
            disabled={uploading || files.length === 0}
          >
            {uploading ? "Uploading..." : `Upload ${title}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
              Upload required documents and images
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderUploadCard("Documents", documentFiles, "documents", FileText)}
          {renderUploadCard("Images", imageFiles, "images", Image)}
        </div>

        {/* Display uploaded files */}
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
