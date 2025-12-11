import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "@/services/auth.service"; // adjust path if needed
import { Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin?: (role: "admin" | "coordinator" | "student") => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "coordinator" | "student">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        role,
        userName: username,
        password,
      });

      localStorage.setItem("auth", JSON.stringify(response.data));
      localStorage.setItem("role", response.data?.user?.role);
      onLogin?.(role);
      setTimeout(() => {
        navigate("/");
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || "Invalid credentials or network error. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Form */}
        <div className="w-full max-w-md mx-auto p-8">
          <div className="text-center mb-8 lg:hidden">
            {/* Show on mobile only */}
            <img src="intern.gif" alt="" className="w-400 mb-6" />
            <h1 className="text-3xl font-bold text-green-600">On-The-Job</h1>
            <p className="text-gray-600 mt-2">Training Monitoring System</p>
          </div>
          <p className="text-gray-500 mt-2 text-center">Sign in to continue</p>
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Enter Your Username"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg shadow-sm 
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 mt-5 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full ${
                loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
              } text-white py-2 px-4 rounded-lg font-medium shadow-md 
            focus:outline-none focus:ring-2 focus:ring-green-500 transition`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Register here
                </button>
              </p>
            </div> */}
          </div>
        </div>

        {/* RIGHT SIDE: Appears only on large screens */}
        <div className="hidden lg:flex flex-col items-center justify-center p-8 text-center">
          <img src="intern.gif" alt="" className="w-400 mb-6" />
          <h1 className="text-3xl font-bold text-green-600">On-The-Job</h1>
          <p className="text-gray-600 mt-2">Training Monitoring System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
