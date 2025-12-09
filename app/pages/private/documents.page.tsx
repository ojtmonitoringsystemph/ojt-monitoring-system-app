import React, { useEffect, useState, type ChangeEvent } from "react";
import { documentService } from "@/services/document.service";
import PageLayout from "~/app/components/templates/layout/page.layout";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface DocumentEntry {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    program?: string;
    avatar?: string | null;
  };
  documentName: string;
  documents: string[];
  status: string;
  remarks: string;
  uploadedAt: string;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentEntry | null>(null);
  const [approvalAction, setApprovalAction] = useState<"approve" | "disapprove" | null>(null);
  const [remarks, setRemarks] = useState<string>("");

  // Get user role for approval functionality
  const userData = getUserFromLocalStorage();
  const userRole = userData?.user?.role;
  const isCoordinator = userRole === "coordinator";

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getAll();
      const allDocuments = Array.isArray(res) ? res : [];

      // Get logged-in user's data from localStorage
      const userData = getUserFromLocalStorage();
      const actualUserRole = userData?.user?.role;
      const userProgram = userData?.user?.program?.toLowerCase();

      // Filter documents by coordinator's program
      if (actualUserRole === "coordinator" && userProgram) {
        const filteredDocuments = allDocuments.filter(
          (doc: DocumentEntry) => doc.student.program?.toLowerCase() === userProgram
        );
        setDocuments(filteredDocuments);
      } else {
        // Admin sees all documents
        setDocuments(allDocuments);
      }
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
      // Handle the response directly as it should be an array of documents
      const searchResults = Array.isArray(res) ? res : [];

      // Apply the same filtering logic as fetchDocuments for coordinators
      const userData = getUserFromLocalStorage();
      const actualUserRole = userData?.user?.role;
      const userProgram = userData?.user?.program?.toLowerCase();

      if (actualUserRole === "coordinator" && userProgram) {
        const filteredResults = searchResults.filter(
          (doc: DocumentEntry) => doc.student.program?.toLowerCase() === userProgram
        );
        setDocuments(filteredResults);
      } else {
        setDocuments(searchResults);
      }
    } catch (error) {
      console.error("Error searching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleApprovalAction = (document: DocumentEntry, action: "approve" | "disapprove") => {
    setSelectedDocument(document);
    setApprovalAction(action);
    setRemarks(action === "approve" ? "Document approved" : "");
    setShowApprovalModal(true);
  };

  const submitApprovalAction = async () => {
    if (!selectedDocument || !approvalAction) return;

    if (approvalAction === "disapprove" && !remarks.trim()) {
      alert("Remarks are required when disapproving a document.");
      return;
    }

    try {
      setActionLoading(selectedDocument._id);

      if (approvalAction === "approve") {
        await documentService.approve(selectedDocument._id, remarks || undefined);
      } else {
        await documentService.disapprove(selectedDocument._id, remarks.trim());
      }

      // Refresh documents list
      await fetchDocuments();

      // Close modal and reset state
      setShowApprovalModal(false);
      setSelectedDocument(null);
      setApprovalAction(null);
      setRemarks("");

      alert(`Document ${approvalAction}d successfully!`);
    } catch (error: any) {
      console.error("Error processing approval action:", error);
      alert(error?.response?.data?.message || `Failed to ${approvalAction} document`);
    } finally {
      setActionLoading(null);
    }
  };

  const cancelApprovalAction = () => {
    setShowApprovalModal(false);
    setSelectedDocument(null);
    setApprovalAction(null);
    setRemarks("");
  };

  return (
    <PageLayout>
      <div
        style={{
          padding: "2rem",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#2e7d32",
              marginBottom: "0.5rem",
            }}
          >
            Student Documents
          </h1>
          <p style={{ color: "#666", fontSize: "0.95rem" }}>
            View and manage all uploaded student documents
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search by student name, document name, or program..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              fontSize: "1rem",
              borderRadius: "10px",
              border: "2px solid #e0e0e0",
              backgroundColor: "#fff",
              boxSizing: "border-box",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
          />
        </div>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "4rem", color: "#2e7d32", fontSize: "1.1rem" }}
          >
            Loading documents...
          </div>
        ) : !documents.length ? (
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
            <p style={{ color: "#666", fontSize: "1.1rem" }}>No documents found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {documents.map((entry) => {
              const statusColors = getStatusBadgeColor(entry.status);
              return (
                <div
                  key={entry._id}
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
                      <h2
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          color: "#2e7d32",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {entry.documentName}
                      </h2>
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
                          <span style={{ fontWeight: "500", color: "#444" }}>Student:</span>{" "}
                          {entry.student.firstName} {entry.student.lastName}
                        </div>
                        {entry.student.email && (
                          <div>
                            <span style={{ fontWeight: "500", color: "#444" }}>Email:</span>{" "}
                            {entry.student.email}
                          </div>
                        )}
                        {entry.student.program && (
                          <div>
                            <span style={{ fontWeight: "500", color: "#444" }}>Program:</span>{" "}
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontWeight: "600",
                                color: "#2e7d32",
                              }}
                            >
                              {entry.student.program}
                            </span>
                          </div>
                        )}
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
                      {entry.status}
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
                      {new Date(entry.uploadedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div>
                      <span style={{ fontWeight: "500" }}>Files:</span> {entry.documents.length}
                    </div>
                  </div>

                  {/* Remarks Section */}
                  {entry.remarks && (
                    <div
                      style={{
                        backgroundColor: "#f9fbe7",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                        border: "1px solid #f0f4c3",
                      }}
                    >
                      <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
                        <span style={{ fontWeight: "600", color: "#444" }}>Remarks:</span>{" "}
                        {entry.remarks}
                      </p>
                    </div>
                  )}

                  {/* Approval Buttons for Coordinators */}
                  {isCoordinator && entry.status === "pending" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <button
                        onClick={() => handleApprovalAction(entry, "approve")}
                        disabled={actionLoading === entry._id}
                        style={{
                          flex: 1,
                          padding: "0.75rem 1rem",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#fff",
                          backgroundColor: actionLoading === entry._id ? "#a5d6a7" : "#2e7d32",
                          border: "none",
                          borderRadius: "8px",
                          cursor: actionLoading === entry._id ? "not-allowed" : "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (actionLoading !== entry._id) {
                            e.currentTarget.style.backgroundColor = "#1b5e20";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (actionLoading !== entry._id) {
                            e.currentTarget.style.backgroundColor = "#2e7d32";
                          }
                        }}
                      >
                        {actionLoading === entry._id ? "Processing..." : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleApprovalAction(entry, "disapprove")}
                        disabled={actionLoading === entry._id}
                        style={{
                          flex: 1,
                          padding: "0.75rem 1rem",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#fff",
                          backgroundColor: actionLoading === entry._id ? "#ef9a9a" : "#c62828",
                          border: "none",
                          borderRadius: "8px",
                          cursor: actionLoading === entry._id ? "not-allowed" : "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (actionLoading !== entry._id) {
                            e.currentTarget.style.backgroundColor = "#b71c1c";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (actionLoading !== entry._id) {
                            e.currentTarget.style.backgroundColor = "#c62828";
                          }
                        }}
                      >
                        {actionLoading === entry._id ? "Processing..." : "✗ Disapprove"}
                      </button>
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
                    {entry.documents.map((fileUrl, index) => {
                      const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif)$/i);
                      return (
                        <div
                          key={`${entry._id}-${index}`}
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
                          <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#999" }}>
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

        {/* Approval Modal */}
        {showApprovalModal && selectedDocument && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) cancelApprovalAction();
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: approvalAction === "approve" ? "#2e7d32" : "#c62828",
                  marginBottom: "1rem",
                }}
              >
                {approvalAction === "approve" ? "Approve Document" : "Disapprove Document"}
              </h3>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                  <strong>Document:</strong> {selectedDocument.documentName}
                </p>
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                  <strong>Student:</strong> {selectedDocument.student.firstName}{" "}
                  {selectedDocument.student.lastName}
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "0.5rem",
                  }}
                >
                  {approvalAction === "disapprove"
                    ? "Reason for disapproval *"
                    : "Remarks (optional)"}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    approvalAction === "disapprove"
                      ? "Please provide a reason for disapproving this document..."
                      : "Add any remarks about this approval..."
                  }
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                    backgroundColor: "#fff",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor =
                      approvalAction === "approve" ? "#2e7d32" : "#c62828")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  onClick={cancelApprovalAction}
                  disabled={actionLoading === selectedDocument._id}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    color: "#666",
                    backgroundColor: "#f5f5f5",
                    border: "none",
                    borderRadius: "8px",
                    cursor: actionLoading === selectedDocument._id ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (actionLoading !== selectedDocument._id) {
                      e.currentTarget.style.backgroundColor = "#e0e0e0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (actionLoading !== selectedDocument._id) {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitApprovalAction}
                  disabled={
                    actionLoading === selectedDocument._id ||
                    (approvalAction === "disapprove" && !remarks.trim())
                  }
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#fff",
                    backgroundColor:
                      actionLoading === selectedDocument._id
                        ? "#ccc"
                        : approvalAction === "approve"
                        ? "#2e7d32"
                        : "#c62828",
                    border: "none",
                    borderRadius: "8px",
                    cursor:
                      actionLoading === selectedDocument._id ||
                      (approvalAction === "disapprove" && !remarks.trim())
                        ? "not-allowed"
                        : "pointer",
                    transition: "background-color 0.2s",
                    opacity: approvalAction === "disapprove" && !remarks.trim() ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (
                      actionLoading !== selectedDocument._id &&
                      !(approvalAction === "disapprove" && !remarks.trim())
                    ) {
                      e.currentTarget.style.backgroundColor =
                        approvalAction === "approve" ? "#1b5e20" : "#b71c1c";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (
                      actionLoading !== selectedDocument._id &&
                      !(approvalAction === "disapprove" && !remarks.trim())
                    ) {
                      e.currentTarget.style.backgroundColor =
                        approvalAction === "approve" ? "#2e7d32" : "#c62828";
                    }
                  }}
                >
                  {actionLoading === selectedDocument._id
                    ? `${approvalAction === "approve" ? "Approving" : "Disapproving"}...`
                    : approvalAction === "approve"
                    ? "Approve Document"
                    : "Disapprove Document"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DocumentsPage;
