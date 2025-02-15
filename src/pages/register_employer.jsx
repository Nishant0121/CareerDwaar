import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use React Router for navigation

export default function EmployerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    companyName: "",
    industry: "",
    website: "",
    logo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Navigation hook

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register-employer",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender || null,
          company_name: formData.companyName,
          industry: formData.industry || null,
          website: formData.website || null,
          logo: formData.logo || null,
        }
      );

      console.log("Employer registered successfully:", response.data);
      alert("Registration Successful! Please log in.");
      navigate("/login"); // Redirect using React Router
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white-bg shadow-lg rounded-4xl  p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Employer Registration
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Gender (Optional) */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Gender (Optional)</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Company Name */}
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Industry */}
          <input
            type="text"
            name="industry"
            placeholder="Industry (e.g., Tech, Finance)"
            value={formData.industry}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Website */}
          <input
            type="url"
            name="website"
            placeholder="Company Website (Optional)"
            value={formData.website}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Company Logo */}
          <input
            type="url"
            name="logo"
            placeholder="Company Logo URL (Optional)"
            value={formData.logo}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Employer"}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-sm text-gray-500 mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
