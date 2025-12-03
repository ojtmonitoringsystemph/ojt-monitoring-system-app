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
  };
}

interface Toast {
  id: number;
  type: "success" | "error";
  title: string;
  message: string;
}

const Announcements: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  // Access control - only admin and coordinator can access this page
  if (userRole === "student") {
    return (
      <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                  <XCircle className="h-12 w-12" />
                </div>
                <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You don't have permission to access this page. This section is only available to
                  administrators and coordinators.
                </p>
                <Button onClick={() => window.history.back()} className="w-full">
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const userId = getUserFromLocalStorage()?.user?._id;

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
    return createdBy.name || createdBy.email || "Unknown";
  };

  // Toast container styles
  const toastContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxWidth: "350px",
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
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">Loading announcements...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center text-red-500">{error}</div>
            <Button onClick={fetchAnnouncements} className="ml-4">
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
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            </div>

            {/* Create Announcement Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="text-sm font-medium">
                      Content
                    </label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter announcement content"
                      rows={5}
                    />
                  </div>

                  <div>
                    <label htmlFor="targetProgram" className="text-sm font-medium">
                      Target Program
                    </label>
                    <Select value={targetProgram} onValueChange={setTargetProgram}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        <SelectItem value="bsit">BSIT Only</SelectItem>
                        <SelectItem value="bsba">BSBA Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Announcement Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <label htmlFor="edit-content" className="text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="edit-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter announcement content"
                    rows={5}
                  />
                </div>

                <div>
                  <label htmlFor="edit-targetProgram" className="text-sm font-medium">
                    Target Program
                  </label>
                  <Select value={targetProgram} onValueChange={setTargetProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      <SelectItem value="bsit">BSIT Only</SelectItem>
                      <SelectItem value="bsba">BSBA Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateAnnouncement}>Update Announcement</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No announcements found.
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          By {getAuthorName(announcement.createdBy)} •{" "}
                          {formatDate(announcement.createdAt)}
                          {announcement.updatedAt !== announcement.createdAt && (
                            <span className="ml-2">(Edited)</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons for creator */}
                      <div className="flex items-center gap-2 ml-4">
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
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">
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
