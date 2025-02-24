import axios from "axios";
import React, { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [branch, setBranch] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const uploadResume = async () => {
    if (!resume) return "";

    setUploading(true);
    const formData = new FormData();
    formData.append("file", resume);

    try {
      const res = await axios.post(
        "https://careerdwaar.onrender.com/upload-resume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploading(false);
      return res.data.url; // Assuming backend returns { url: "Google Drive Link" }
    } catch (err) {
      setUploading(false);
      setError("Failed to upload resume. Try again.");
      return "";
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const resumeDriveLink = await uploadResume();
    if (!resumeDriveLink) return;

    try {
      const response = await axios.post(
        "https://careerdwaar.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
          gender,
          college_name: collegeName,
          branch,
          resume_link: resumeDriveLink,
        }
      );

      console.log("Registration successful:", response.data);
      alert("Registration Successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center rounded-4xl md:p-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-4xl  p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Register as Student
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            placeholder="College Name"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {uploading && (
            <p className="text-blue-500 text-sm mb-3">Uploading resume...</p>
          )}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
          >
            {uploading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-3 text-center">
          Already have an account?{" "}
          <a href="/api/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
