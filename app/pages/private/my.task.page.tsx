import React, { useEffect, useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { CheckSquare, Trash2, X } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { taskService } from "~/app/services/task.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  submissionProofUrl: string[];
  assignedTo: {
    _id: string;
    name: string;
  }[];
}

const MyTasks: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const getAuth = getUserFromLocalStorage();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground">
              View and complete assigned tasks
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading tasks...</p>
            ) : tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => openModal(task)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{task.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-sm ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {task.submissionProofUrl?.length ?? 0} file(s)
                            uploaded
                          </span>
                        </div>
                      </div>
                      {task.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent modal opening
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
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        {/* Modal */}
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg w-3/4 max-w-2xl p-6 relative overflow-y-auto max-h-[80vh]">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3"
                onClick={closeModal}
              >
                <X />
              </Button>

              <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <span className={getStatusColor(selectedTask.status)}>
                  {selectedTask.status}
                </span>
              </p>
              <p className="mb-4">
                <span className="font-semibold">Description:</span>{" "}
                {selectedTask.description}
              </p>

              <p className="font-semibold mb-2">Uploaded Files:</p>
              {selectedTask.submissionProofUrl.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedTask.submissionProofUrl.map((fileUrl, index) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                    return (
                      <div
                        key={index}
                        className="border rounded p-2 flex flex-col items-center"
                      >
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={`file-${index}`}
                            className="w-24 h-24 object-cover mb-2 rounded"
                          />
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-600 mb-2 rounded">
                            <span>File</span>
                          </div>
                        )}
                        <a
                          href={fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all text-center"
                        >
                          {fileUrl.split("/").pop()}
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No files uploaded</p>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyTasks;
