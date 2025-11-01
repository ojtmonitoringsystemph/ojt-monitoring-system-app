import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "@/services/auth.service"; // adjust path if needed

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        role,
        email: username,
        password,
      });

      localStorage.setItem("auth", JSON.stringify(response.data));
      localStorage.setItem("role", response.data?.user?.role);
      onLogin?.(role);
      navigate("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message ||
          "Invalid credentials or network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Internship Management System
          </h1>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter your email"
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

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white py-2 px-4 rounded-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
