import React, { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "~/app/services/auth.service";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    userName: "",
    role: "",
    email: "",
    password: "",
    program: "",
    acceptPolicy: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // If checkbox → use checked
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
      return;
    }

    // Otherwise use value
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.userName ||
      !formData.role ||
      !formData.email ||
      !formData.password ||
      !formData.program
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.acceptPolicy) {
      setError("You must accept the Privacy & Policy to continue.");
      return;
    }

    setLoading(true);
    try {
      const res: any = await authService.register(formData);
      console.log("Registration success:", res);
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-8  w-full max-w-md ">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
          Register
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="coordinator">Coordinator</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Select Program</option>
            <option value="bsit">BSIT</option>
            <option value="bsba">BSBA</option>
          </select>

          {/* Privacy & Policy */}
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="acceptPolicy"
              checked={formData.acceptPolicy}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <span>
              I accept the{" "}
              <span className="text-green-700 font-medium cursor-pointer underline">
                Privacy & Policy
              </span>
            </span>
          </label>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-lg font-semibold text-white transition-colors ${
            loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-700 hover:text-green-900 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
