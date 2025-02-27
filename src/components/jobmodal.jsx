/* eslint-disable react/prop-types */
import { useState } from "react";

export default function JobModal({ job, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Here you would typically send the application data to your backend
    console.log("Submitting application", {
      name,
      email,
      resume,
      jobId: job.id,
    });
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white-bg rounded-4xl  p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
        <p className="mb-4">{job.company}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="resume" className="block mb-1">
              Resume
            </label>
            <input
              type="file"
              id="resume"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              required
              className="w-full p-2 border rounded"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-4xl hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
