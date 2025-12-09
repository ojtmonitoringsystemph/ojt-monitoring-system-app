import PageLayout from "@/components/templates/layout/page.layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Megaphone, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { announcementService } from "@/services/announcement.service";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  targetProgram?: string;
  createdBy: {
    _id: string;
    name?: string;
    email?: string;
  } | null;
}

interface Toast {
  id: number;
  type: "success" | "error";
  title: string;
  message: string;
}

const Announcements: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  // Get userRole from localStorage as fallback
  const userData = getUserFromLocalStorage();
  const actualUserRole = (userRole || userData?.user?.role || "student") as
    | "admin"
    | "coordinator"
    | "student";

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const userId = userData?.user?._id;

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetProgram, setTargetProgram] = useState("all");

  // Show toast function
  const showToast = (type: "success" | "error", title: string, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  // Remove toast function
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = getUserFromLocalStorage();
      const userProgram = userData?.user?.program;

      // Pass user's program as parameter for filtering
      const params = userProgram ? { program: userProgram } : {};
      const response = await announcementService.getAll(params);
      setAnnouncements(response || []);
    } catch (err) {
      setError("Failed to load announcements");
      showToast("error", "Error", "Failed to load announcements. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      await announcementService.create({
        title,
        content,
        targetProgram: targetProgram,
      });

      showToast("success", "Success", "Announcement created successfully.");

      setIsDialogOpen(false);
      setTitle("");
      setContent("");
      setTargetProgram("all");
      fetchAnnouncements(); // Refresh list
    } catch (error) {
      showToast("error", "Error", "Failed to create announcement. Please try again.");
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    try {
      await announcementService.patch(selectedAnnouncement._id, {
        title,
        content,
        targetProgram,
      });

      showToast("success", "Success", "Announcement updated successfully.");

      setIsEditDialogOpen(false);
      setSelectedAnnouncement(null);
      setTitle("");
      setContent("");
      fetchAnnouncements(); // Refresh list
    } catch (error) {
      showToast("error", "Error", "Failed to update announcement. Please try again.");
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      await announcementService.delete(id);

      showToast("success", "Success", "Announcement deleted successfully.");

      fetchAnnouncements(); // Refresh list
    } catch (error) {
      showToast("error", "Error", "Failed to delete announcement. Please try again.");
    }
  };

  const handleEditClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setTargetProgram(announcement.targetProgram || "all");
    setIsEditDialogOpen(true);
  };

  // Check if user is the creator of the announcement
  const isCreator = (announcement: Announcement) => {
    return userId && announcement.createdBy === userId;
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get author name helper
  const getAuthorName = (createdBy: Announcement["createdBy"]) => {
    if (!createdBy) return "Unknown";
    return createdBy.name || createdBy.email || "Unknown";
  };

  // Toast container styles
  const toastContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    left: "1rem",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxWidth: "350px",
    margin: "0 auto",
  };

  const toastStyle = (type: "success" | "error"): React.CSSProperties => ({
    backgroundColor: type === "success" ? "#10b981" : "#ef4444",
    color: "white",
    padding: "1rem",
    borderRadius: "0.375rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    animation: "slideIn 0.3s ease-out",
  });

  const toastContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const toastTitleStyle: React.CSSProperties = {
    fontWeight: "600",
    fontSize: "0.875rem",
    marginBottom: "0.25rem",
  };

  const toastMessageStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    opacity: 0.9,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0",
    fontSize: "1rem",
    opacity: 0.7,
    transition: "opacity 0.2s",
  };

  if (isLoading) {
    return (
      <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Megaphone className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Announcements</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center text-sm">Loading announcements...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Megaphone className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Announcements</h1>
          </div>
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="text-center text-red-500 text-sm">{error}</div>
            <Button onClick={fetchAnnouncements} className="text-sm">
              Retry
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div style={toastContainerStyle}>
          {toasts.map((toast) => (
            <div key={toast.id} style={toastStyle(toast.type)}>
              {toast.type === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <div style={toastContentStyle}>
                <div style={toastTitleStyle}>{toast.title}</div>
                <div style={toastMessageStyle}>{toast.message}</div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={closeButtonStyle}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add CSS for animation */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Megaphone className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Announcements</h1>
            </div>

            {/* Create Announcement Dialog - Only for Admin and Coordinator */}
            {(actualUserRole === "admin" || actualUserRole === "coordinator") && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto justify-center">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Announcement</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:w-full">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      Create New Announcement
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label htmlFor="title" className="text-xs sm:text-sm font-medium">
                        Title
                      </label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter announcement title"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="content" className="text-xs sm:text-sm font-medium">
                        Content
                      </label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter announcement content"
                        rows={5}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="targetProgram" className="text-xs sm:text-sm font-medium">
                        Target Program
                      </label>
                      <Select value={targetProgram} onValueChange={setTargetProgram}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select target program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Programs</SelectItem>
                          <SelectItem value="bsit">BSIT Only</SelectItem>
                          <SelectItem value="bsba">BSBA Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 pt-2 flex-col-reverse sm:flex-row sm:justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="text-sm"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateAnnouncement} className="text-sm">
                        Create Announcement
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Edit Announcement Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Edit Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="edit-title" className="text-xs sm:text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter announcement title"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-content" className="text-xs sm:text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="edit-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter announcement content"
                    rows={5}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="edit-targetProgram" className="text-xs sm:text-sm font-medium">
                    Target Program
                  </label>
                  <Select value={targetProgram} onValueChange={setTargetProgram}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select target program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      <SelectItem value="bsit">BSIT Only</SelectItem>
                      <SelectItem value="bsba">BSBA Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2 flex-col-reverse sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateAnnouncement} className="text-sm">
                    Update Announcement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No announcements found.
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base break-words">
                          {announcement.title}
                        </h3>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          <div>By {getAuthorName(announcement.createdBy)}</div>
                          <div>
                            {formatDate(announcement.createdAt)}
                            {announcement.updatedAt !== announcement.createdAt && (
                              <span className="ml-2">(Edited)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons - Only for Admin and Coordinator */}
                      {(actualUserRole === "admin" || actualUserRole === "coordinator") && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(announcement)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap text-xs sm:text-sm">
                      {announcement.content}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </>
  );
};

export default Announcements;
