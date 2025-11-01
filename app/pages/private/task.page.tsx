import React, { useEffect, useState, type ChangeEvent } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import { CheckSquare, Plus, Edit, Trash2 } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { taskService } from "~/app/services/task.service";
import { userService } from "~/app/services/user.service";

interface Task {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo: Student[];
  status: string;
  submissionProofUrl: string[];
  createdAt: string;
  updatedAt: string;
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Tasks: React.FC<PageProps> = ({ userRole, userName, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalContent, setModalContent] = useState<{
    type: "task" | "file" | null;
    data?: any;
  }>({ type: null });

  // Open task details modal
  const openTaskModal = (task: Task) => {
    setModalContent({ type: "task", data: task });
  };

  // Open file modal
  const openFileModal = (fileUrl: string) => {
    setModalContent({ type: "file", data: { url: fileUrl } });
  };

  // Close modal
  const closeModal = () => setModalContent({ type: null });

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    files: [] as File[],
  });

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();
      setTasks(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students
  const fetchStudents = async (search: string = "") => {
    try {
      const params = search
        ? { name: search, role: "student" }
        : { role: "student" };
      const response = await userService.getAll(params);
      setAllStudents(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStudents();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => fetchStudents(studentSearch), 300);
    return () => clearTimeout(debounce);
  }, [studentSearch]);

  const handleAssignStudent = (student: Student) => {
    if (!assignedStudents.find((s) => s._id === student._id)) {
      setAssignedStudents([...assignedStudents, student]);
    }
  };

  const removeAssignedStudent = (id: string) => {
    setAssignedStudents((prev) => prev.filter((s) => s._id !== id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewTask((prev) => ({ ...prev, files: Array.from(e.target.files!) }));
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description) return;

    try {
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("description", newTask.description);
      assignedStudents.forEach((s) => formData.append("assignedTo[]", s._id));
      newTask.files.forEach((file) => formData.append("files", file));

      await taskService.create(formData);
      setNewTask({ title: "", description: "", files: [] });
      setAssignedStudents([]);
      setStudentSearch("");
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (_id: string) => {
    try {
      await taskService.delete(_id);
      setTasks((prev) => prev.filter((task) => task._id !== _id));
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

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground">
                Create and manage tasks for students
              </p>
            </div>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setShowModal(false)}
              >
                ✕
              </Button>
              <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Task Title
                  </label>
                  <Input
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description
                  </label>
                  <Textarea
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Upload Files
                  </label>
                  <Input type="file" multiple onChange={handleFileChange} />
                  {newTask.files.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 max-h-40 overflow-y-auto border rounded p-2">
                      {newTask.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded"
                        >
                          <span className="truncate">{file.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setNewTask((prev) => ({
                                ...prev,
                                files: prev.files.filter((_, i) => i !== idx),
                              }))
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Assign To Students
                  </label>
                  <Input
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                  {allStudents.length > 0 && (
                    <div className="border rounded-lg max-h-48 overflow-y-auto mt-1">
                      {allStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleAssignStudent(student)}
                        >
                          <span>
                            {student.firstName} {student.lastName} (
                            {student.email})
                          </span>
                          {assignedStudents.some(
                            (s) => s._id === student._id
                          ) && (
                            <CheckSquare className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assignedStudents.map((s) => (
                      <Badge
                        key={s._id}
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => removeAssignedStudent(s._id)}
                      >
                        {s.firstName} <Trash2 className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreateTask} className="w-full mt-2">
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        )}
        {modalContent.type && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] p-6 relative overflow-y-auto">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={closeModal}
              >
                ✕
              </Button>

              {modalContent.type === "task" && modalContent.data && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">
                    {modalContent.data.title}
                  </h2>
                  <p>{modalContent.data.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {modalContent.data.assignedTo.map((s: Student) => (
                      <Badge key={s._id}>{s.firstName}</Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Files</h3>
                    {modalContent.data.submissionProofUrl.length === 0 ? (
                      <p>No files uploaded.</p>
                    ) : (
                      modalContent.data.submissionProofUrl.map(
                        (file: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            {file.endsWith(".png") ||
                            file.endsWith(".jpg") ||
                            file.endsWith(".jpeg") ? (
                              <img
                                src={file}
                                alt="task file"
                                className="h-16 w-16 object-cover cursor-pointer rounded"
                                onClick={() => openFileModal(file)}
                              />
                            ) : (
                              <span
                                className="cursor-pointer text-blue-600 underline"
                                onClick={() => window.open(file, "_blank")}
                              >
                                {file.split("/").pop()}
                              </span>
                            )}
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              )}

              {modalContent.type === "file" && modalContent.data && (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={modalContent.data.url}
                    alt="preview"
                    className="max-h-[70vh] max-w-full object-contain rounded"
                  />
                  <a
                    href={modalContent.data.url}
                    download
                    className="text-blue-600 underline"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading tasks...</p>
            ) : tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {task.submissionProofUrl?.length ?? 0} file(s)
                            uploaded
                          </span>
                          <span>
                            Assigned: {task.assignedTo?.length ?? 0} student(s)
                          </span>
                        </div>
                        {task.assignedTo?.length > 0 && (
                          <div className="mt-1 text-sm">
                            {task.assignedTo.map((s) => (
                              <Badge
                                key={s._id}
                                className="mr-1 mb-1 inline-block"
                              >
                                {s.firstName}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => openTaskModal(task)}>
                          View Details
                        </Button>

                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Tasks;
