import React, { useEffect, useState, type ChangeEvent } from "react";
import { documentService } from "@/services/document.service";
import PageLayout from "~/app/components/templates/layout/page.layout";

interface DocumentEntry {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  documents: string[];
  status: string;
  remarks: string;
  uploadedAt: string;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getAll();
      setDocuments(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      fetchDocuments();
      return;
    }

    try {
      setLoading(true);
      const res = await documentService.search({ query: value });
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error searching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div
        style={{
          padding: "2rem",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fff",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", color: "#2e7d32" }}>Documents</h1>

        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #a5d6a7",
            marginBottom: "2rem",
            boxSizing: "border-box",
            outlineColor: "#2e7d32",
          }}
        />

        {loading ? (
          <div style={{ textAlign: "center", color: "#2e7d32" }}>
            Loading...
          </div>
        ) : !documents.length ? (
          <p style={{ textAlign: "center", color: "#2e7d32" }}>
            No documents found.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {documents.map((entry) =>
              entry.documents.map((fileUrl, index) => (
                <div
                  key={`${entry._id}-${index}`}
                  style={{
                    border: "1px solid #c8e6c9",
                    borderRadius: "10px",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-5px)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)")
                  }
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                      color: "#2e7d32",
                    }}
                  >
                    📄
                  </div>
                  <strong style={{ display: "block", marginBottom: "0.25rem" }}>
                    {entry.student.firstName} {entry.student.lastName}
                  </strong>
                  {entry.remarks && (
                    <p style={{ fontSize: "0.875rem", color: "#555" }}>
                      {entry.remarks}
                    </p>
                  )}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#2e7d32",
                      textDecoration: "underline",
                    }}
                  >
                    View File
                  </a>
                  <small
                    style={{ color: "#999", display: "block", marginTop: 4 }}
                  >
                    {new Date(entry.uploadedAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DocumentsPage;
