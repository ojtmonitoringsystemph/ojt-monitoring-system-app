import React, { useEffect, useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { CheckSquare, Trash2, X, Upload } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { taskService } from "~/app/services/task.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  submissionProofUrl: string[];
  assignedTo: { _id: string; name: string }[];
}

const MyTasks: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const getAuth = getUserFromLocalStorage();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.student(getAuth?.user?._id);
      setTasks(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleMarkComplete = async (taskId: string) => {
    try {
      await taskService.patch({ _id: taskId, status: "completed" });
      fetchMyTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (taskId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      await taskService.addFilesToSubmissionProof(taskId, formData);
      await fetchMyTasks();
      const updatedTask = await taskService.get(taskId);
      setSelectedTask(updatedTask);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileRemove = async (taskId: string, fileUrl: string) => {
    try {
      await taskService.removeFilesToSubmissionProof(taskId, {
        documents: [fileUrl],
      });
      await fetchMyTasks();
      const updatedTask = await taskService.get(taskId);
      setSelectedTask(updatedTask);
    } catch (error) {
      console.error("File removal failed:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 mt-1 sm:mt-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Tasks</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              View and complete assigned tasks
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-sm">Loading tasks...</p>
            ) : tasks.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="border rounded-lg p-3 sm:p-4 hover:bg-green-50 transition-colors cursor-pointer"
                    onClick={() => openModal(task)}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 break-words">
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs sm:text-sm font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-2 break-words">
                          {task.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span>{task.submissionProofUrl?.length ?? 0} file(s) uploaded</span>
                        </div>
                      </div>
                      {task.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkComplete(task._id);
                          }}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">No tasks assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Modal */}
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-green-900 break-words">
                    {selectedTask.title}
                  </h2>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(
                      selectedTask.status
                    )}`}
                  >
                    {selectedTask.status}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:bg-green-200 rounded-full flex-shrink-0 ml-2"
                  onClick={closeModal}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Description Section */}
                <div className="border-b border-gray-100 pb-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-3">
                    Task Description
                  </label>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 sm:p-4 whitespace-pre-wrap border border-gray-200">
                    {selectedTask.description}
                  </p>
                </div>

                {/* Upload Submission Section */}
                <div className="border-b border-gray-100 pb-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-3">
                    📤 Upload Submission Proof
                  </label>
                  <div className="bg-green-50 rounded-lg border-2 border-dashed border-green-300 p-4 sm:p-6">
                    <input
                      type="file"
                      multiple
                      disabled={uploading}
                      onChange={(e) => handleFileUpload(selectedTask._id, e.target.files)}
                      className="w-full text-xs sm:text-sm file:mr-2 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:cursor-pointer file:text-xs sm:file:text-sm file:font-semibold hover:file:bg-green-700"
                    />
                    {uploading && (
                      <p className="text-xs sm:text-sm text-green-600 mt-3 font-medium">
                        ⏳ Uploading files...
                      </p>
                    )}
                  </div>
                </div>

                {/* Uploaded Files Section */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-3">
                    Uploaded Files{" "}
                    <span className="text-green-600 font-bold">
                      ({selectedTask.submissionProofUrl?.length ?? 0})
                    </span>
                  </label>
                  {selectedTask.submissionProofUrl.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {selectedTask.submissionProofUrl.map((fileUrl, index) => {
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                        return (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                          >
                            <div className="relative">
                              {isImage ? (
                                <img
                                  src={fileUrl}
                                  alt={`file-${index}`}
                                  className="w-full h-32 sm:h-40 object-cover"
                                />
                              ) : (
                                <div className="w-full h-32 sm:h-40 flex items-center justify-center bg-gray-100 text-gray-600">
                                  <div className="text-center">
                                    <span className="text-3xl">📄</span>
                                    <p className="text-xs font-semibold mt-1">Document</p>
                                  </div>
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full"
                                onClick={() => handleFileRemove(selectedTask._id, fileUrl)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="p-2 sm:p-3 bg-gray-50">
                              <a
                                href={fileUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 text-xs sm:text-sm font-semibold break-all line-clamp-2"
                              >
                                {fileUrl.split("/").pop()}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 text-center">
                      <p className="text-xs sm:text-sm text-gray-600">📭 No files uploaded yet</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload your submission proof above
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {selectedTask.status !== "completed" && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={closeModal}
                    >
                      Close
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                      onClick={() => {
                        handleMarkComplete(selectedTask._id);
                        closeModal();
                      }}
                    >
                      Mark as Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyTasks;
