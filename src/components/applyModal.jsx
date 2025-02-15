/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useAuth } from "../context/app.context";
import axios from "axios";

export default function ApplyModal({ selectedJob, closeModal }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const { user } = useAuth();

  const handleApply = async () => {
    if (!user.name || !user.email) {
      alert("Please fill in your details before applying.");
      return;
    }

    const response = await axios.post("http://localhost:5000/api/apply", {
      job_id: selectedJob.id.toString(),
      name: user.name,
      email: user.email,
    });

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
      <div className="bg-white-bg p-6 rounded-4xl  shadow-lg w-96">
        <h2 className="text-xl font-bold mb-2">{selectedJob.title}</h2>
        <p className="text-gray-600">{selectedJob.company}</p>
        <p className="text-sm text-gray-500">{selectedJob.location}</p>

        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded-4xl mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full p-2 border rounded-4xl mb-2"
        />

        <button
          onClick={handleApply}
          className="bg-green-500 text-white px-4 py-2 rounded-4xl hover:bg-green-600"
        >
          Apply
        </button>
        <button onClick={closeModal} className="ml-2 px-4 py-2 border rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
