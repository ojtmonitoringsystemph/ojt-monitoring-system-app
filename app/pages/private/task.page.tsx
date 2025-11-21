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

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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

  const resetModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask({ title: "", description: "", files: [] });
    setAssignedStudents([]);
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
      resetModal();
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (task: Task) => {
    setIsEditing(true);
    setEditingTaskId(task._id);
    setShowModal(true);
    setNewTask({
      title: task.title,
      description: task.description,
      files: [],
    });
    setAssignedStudents(task.assignedTo);
  };

  const handleUpdateTask = async () => {
    if (!editingTaskId) return;
    try {
      const payload = {
        _id: editingTaskId,
        title: newTask.title,
        description: newTask.description,
        assignedTo: assignedStudents.map((s) => s._id),
        files: newTask.files, // should already contain URLs or file metadata, not File objects
      };

      await taskService.patch(payload); // assumes your patch method sends JSON
      resetModal();
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

  const openTaskModal = (task: Task) => {
    setModalContent({ type: "task", data: task });
  };

  const openFileModal = (fileUrl: string) => {
    setModalContent({ type: "file", data: { url: fileUrl } });
  };

  const closeModal = () => setModalContent({ type: null });

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-green-800">Tasks</h1>
              <p className="text-green-500">
                Create, edit, and manage tasks for students
              </p>
            </div>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>

        {/* Create/Edit Task Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-green-600 hover:bg-green-100"
                onClick={resetModal}
              >
                ✕
              </Button>
              <h2 className="text-lg font-semibold mb-4 text-green-800">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-1 block text-green-700">
                    Task Title
                  </label>
                  <Input
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-1 block text-green-700">
                    Description
                  </label>
                  <Textarea
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm font-medium mb-1 block text-green-700">
                    Upload Files
                  </label>
                  <Input type="file" multiple onChange={handleFileChange} />
                  {newTask.files.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 max-h-40 overflow-y-auto border-green-300 rounded p-2">
                      {newTask.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2 py-1 bg-green-50 rounded"
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

                {/* Assign Students */}
                <div>
                  <label className="text-sm font-medium mb-1 block text-green-700">
                    Assign To Students
                  </label>
                  <Input
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                  {allStudents.length > 0 && (
                    <div className="border-green-300 rounded-lg max-h-48 overflow-y-auto mt-1">
                      {allStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center justify-between px-2 py-1 hover:bg-green-50 cursor-pointer"
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
                        className="flex items-center gap-1 cursor-pointer bg-green-100 text-green-700"
                        onClick={() => removeAssignedStudent(s._id)}
                      >
                        {s.firstName} <Trash2 className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={isEditing ? handleUpdateTask : handleCreateTask}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isEditing ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <Card className="border-green-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800">All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-green-600">
                Loading tasks...
              </p>
            ) : tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="border border-green-300 rounded-lg p-4 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-green-800">
                            {task.title}
                          </h3>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-green-500 text-sm mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-green-500">
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
                                className="mr-1 mb-1 inline-block bg-green-100 text-green-700"
                              >
                                {s.firstName}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => openTaskModal(task)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-100"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-100"
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
                <CheckSquare className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-500">No tasks created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Tasks;
