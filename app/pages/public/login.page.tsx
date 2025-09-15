import { useState } from "react";
import RoleSwitcher from "@/components/templates/other/role.switcher";
import { useNavigate } from "react-router";

interface LoginProps {
  onLogin?: (role: "admin" | "coordinator" | "student") => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "coordinator" | "student">(
    "admin"
  );

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    console.log(`Logged in as ${role} with username: ${username}`);

    // Save in localStorage
    localStorage.setItem("role", role);
    localStorage.setItem("name", username);

    if (onLogin) {
      onLogin(role);
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Internship Management System
          </h1>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Role Switcher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <RoleSwitcher currentRole={role} onRoleChange={setRole} />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
