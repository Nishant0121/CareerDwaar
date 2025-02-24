/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/app.context";
import axios from "axios";

export default function ApplyModal({ selectedJob, closeModal }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, student } = useAuth();

  console.log("student", student);

  const handleApply = async () => {
    setLoading(true);

    if (!user.name || !user.email) {
      alert("Please fill in your details before applying.");
      setLoading(false);
      return;
    }

    const response = await axios.post(
      "https://careerdwaar.onrender.com/api/apply",
      {
        job_id: selectedJob.id.toString(),
        name: user.name,
        email: user.email,
      }
    );

    setLoading(false);

    if (response.status !== 200) {
      alert("Failed to apply for the job.");
      return;
    }

    console.log("Application submitted successfully:", response.data);

    alert(`Application submitted for ${selectedJob.title}`);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-transparent backdrop-blur-lg bg-opacity-50">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-96 max-w-lg">
        {/* Job Information */}
        <h2 className="text-2xl font-bold mb-2 text-center">
          {selectedJob.title}
        </h2>
        <p className="text-gray-600 text-center">{selectedJob.company}</p>
        <p className="text-sm text-gray-500 text-center">
          {selectedJob.location}
        </p>

        {/* Student Info Section */}
        {student && (
          <div className="mt-4 flex items-center mb-4 border-t pt-4 border-gray-300">
            <img
              src={student.profile_picture}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{student.name}</p>
              <p className="text-sm text-gray-500">{student.college_name}</p>
              <p className="text-sm text-gray-500">
                {student.branch} -{" "}
                {student.is_verified ? "Verified" : "Not Verified"}
              </p>
              <a
                href={student.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm"
              >
                View Resume
              </a>
            </div>
          </div>
        )}

        {/* User Input Section */}
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-3xl mb-3"
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-3xl mb-3"
        />

        <div className="flex justify-end">
          <button
            onClick={handleApply}
            className={`bg-green-500 text-white px-4 py-2 rounded-3xl hover:bg-green-600 mr-2 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Apply"}
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-3xl hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
