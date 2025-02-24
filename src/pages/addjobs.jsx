/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import { useAuth } from "../context/app.context";

export default function AddJob() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    job_type: "full-time",
    location: "",
    salary: "",
    deadline: "",
    google_form_link: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://careerdwaar.onrender.com/api/add-job",
        {
          employer_id: user.userId, // Ensure the employer ID is sent
          ...formData,
        }
      );

      alert("Job added successfully!");
      console.log(response.data);
      navigate("/employer-dashboard"); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bglight">
      <div className="bg-white-bg shadow-lg rounded-4xl m-2 p-8 max-w-[1000px] w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Post a New Job
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Job Title */}
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={loading}
          />

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category (e.g., Tech, Marketing)"
            value={formData.category}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={loading}
          />

          {/* Job Type */}
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={loading}
          >
            <option value="full-time">Full-time</option>
            <option value="internship">Internship</option>
          </select>

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location (e.g., Remote, Onsite)"
            value={formData.location}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={loading}
          />

          {/* Salary */}
          <input
            type="text"
            name="salary"
            placeholder="Salary (optional)"
            value={formData.salary}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={loading}
          />

          {/* Deadline */}
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={loading}
          />

          {/* Google Form Link */}
          <input
            type="url"
            name="google_form_link"
            placeholder="Application Link (Google Form, etc.)"
            value={formData.google_form_link}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            disabled={loading}
          />

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Post Job"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-3 text-center">
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
