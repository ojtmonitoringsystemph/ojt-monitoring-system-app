import React, { useEffect, useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import { CheckSquare, Plus, Edit, Trash2 } from "lucide-react";
import { type PageProps } from "@/types/page.type";
import { taskService } from "~/app/services/task.service";
import { userService } from "~/app/services/user.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

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
  });

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();

      // Filter tasks by coordinator's program
      const userData = getUserFromLocalStorage();
      const actualUserRole = userData?.user?.role;
      const userProgram = userData?.user?.program?.toLowerCase();

      // If coordinator, only show tasks assigned to students in their program
      if (actualUserRole === "coordinator" && userProgram) {
        const filteredTasks = response.filter((task: any) => {
          // Check if any assigned student has the same program
          return task.assignedTo?.some(
            (student: any) => student.program?.toLowerCase() === userProgram
          );
        });
        setTasks(filteredTasks);
      } else {
        // Admin sees all tasks
        setTasks(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students
  const fetchStudents = async (search: string = "") => {
    try {
      // Get logged-in user's data from localStorage
      const userData = getUserFromLocalStorage();
      const actualUserRole = userData?.user?.role;
      const userProgram = userData?.user?.program;

      // Build query with program filter for coordinators
      const query: any = { role: "student" };

      // Add name search if provided
      if (search) {
        query.name = search;
      }

      // Coordinators should only see students from their program
      if (actualUserRole === "coordinator" && userProgram) {
        // Ensure program is lowercase to match database values
        query.program = userProgram.toLowerCase();
      }

      // Use search endpoint with query directly in body
      const response = await userService.search(query);
      setAllStudents(response);
    } catch (error) {
      console.error(error);
      setAllStudents([]); // Set empty array on error
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

  const resetModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask({ title: "", description: "" });
    setAssignedStudents([]);
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description) return;
    try {
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("description", newTask.description);
      assignedStudents.forEach((s) => formData.append("assignedTo[]", s._id));

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
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 mt-1 sm:mt-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Tasks</h1>
              <p className="text-xs sm:text-sm text-green-500">
                Create, edit, and manage tasks for students
              </p>
            </div>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto justify-center text-xs sm:text-sm px-2 sm:px-4"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Task</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>

        {/* Create/Edit Task Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-green-600 hover:bg-green-100"
                onClick={resetModal}
              >
                ✕
              </Button>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-green-800">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 block text-green-700">
                    Task Title
                  </label>
                  <Input
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 block text-green-700">
                    Description
                  </label>
                  <Textarea
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                {/* Assign Students */}
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 block text-green-700">
                    Assign To Students
                  </label>
                  <Input
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                  {allStudents.length > 0 && (
                    <div className="border-green-300 rounded-lg max-h-48 overflow-y-auto mt-1 text-sm">
                      {allStudents.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center justify-between px-2 py-1 hover:bg-green-50 cursor-pointer"
                          onClick={() => handleAssignStudent(student)}
                        >
                          <span>
                            {student.firstName} {student.lastName} ({student.email})
                          </span>
                          {assignedStudents.some((s) => s._id === student._id) && (
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
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  {isEditing ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {modalContent.type === "task" && modalContent.data && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-green-900">Task Details</h2>
                  <p className="text-xs sm:text-sm text-green-600 mt-1">
                    ID: {modalContent.data._id}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-600 hover:bg-green-200 rounded-full"
                  onClick={closeModal}
                >
                  ✕
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Title Section */}
                <div className="border-b border-gray-100 pb-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                    Task Title
                  </label>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {modalContent.data.title}
                  </h3>
                </div>

                {/* Status & Dates Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                      Status
                    </label>
                    <Badge
                      className={
                        getStatusColor(modalContent.data.status) +
                        " capitalize text-sm font-semibold"
                      }
                    >
                      {modalContent.data.status}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                      Created
                    </label>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                      {new Date(modalContent.data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                      Updated
                    </label>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                      {new Date(modalContent.data.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="border-b border-gray-100 pb-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-3">
                    Description
                  </label>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 sm:p-4 whitespace-pre-wrap border border-gray-200">
                    {modalContent.data.description}
                  </p>
                </div>

                {/* Assigned Students Section */}
                <div className="border-b border-gray-100 pb-4">
                  <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-3">
                    Assigned Students{" "}
                    <span className="text-green-600 font-bold">
                      ({modalContent.data.assignedTo?.length ?? 0})
                    </span>
                  </label>
                  {modalContent.data.assignedTo?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {modalContent.data.assignedTo?.map((student: any) => (
                        <div
                          key={student._id}
                          className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-start gap-2"
                        >
                          <div className="mt-0.5">
                            <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {student.firstName.charAt(0)}
                              {student.lastName.charAt(0)}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-gray-600 truncate">{student.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      No students assigned to this task
                    </p>
                  )}
                </div>

                {/* Submitted Files Section */}
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block mb-3">
                    Submitted Files{" "}
                    <span className="text-green-600 font-bold">
                      ({modalContent.data.submissionProofUrl?.length ?? 0})
                    </span>
                  </label>
                  {modalContent.data.submissionProofUrl?.length > 0 ? (
                    <div className="space-y-2">
                      {modalContent.data.submissionProofUrl.map((fileUrl: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-300 gap-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">📄</span>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                File {idx + 1}
                              </p>
                              <p className="text-xs text-gray-600">Submission proof</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto text-xs sm:text-sm font-medium rounded-lg"
                            onClick={() => window.open(fileUrl, "_blank")}
                          >
                            Open File →
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                      <p className="text-xs sm:text-sm text-gray-600">📭 No files submitted yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <Card className="border-green-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-green-800">All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-green-600 text-sm">Loading tasks...</p>
            ) : tasks.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="border border-green-300 rounded-lg p-3 sm:p-4 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2 mb-1">
                          <h3 className="font-semibold text-sm sm:text-base text-green-800 break-words">
                            {task.title}
                          </h3>
                          <Badge className={getStatusColor(task.status) + " text-xs sm:text-sm"}>
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-green-500 text-xs sm:text-sm mb-2 break-words">
                          {task.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-green-500">
                          <span>{task.submissionProofUrl?.length ?? 0} file(s) uploaded</span>
                          <span>Assigned: {task.assignedTo?.length ?? 0} student(s)</span>
                        </div>
                        {task.assignedTo?.length > 0 && (
                          <div className="mt-2 text-xs sm:text-sm flex flex-wrap gap-1">
                            {task.assignedTo.map((s) => (
                              <Badge key={s._id} className="bg-green-100 text-green-700 text-xs">
                                {s.firstName}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm flex-1 sm:flex-none"
                          onClick={() => openTaskModal(task)}
                        >
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-100 text-xs"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-100 text-xs"
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
                <CheckSquare className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-500 text-sm">No tasks created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Tasks;
