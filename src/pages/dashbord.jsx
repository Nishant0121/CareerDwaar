import React, { useEffect, useState } from "react";
import { useAuth } from "../context/app.context";

export default function Dashbord() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useAuth();
  const employerId = user?.userId;

  useEffect(() => {
    const fetchJobs = async () => {
      if (!employerId) return;

      try {
        const response = await fetch(
          `https://careerdwaar.onrender.com/api/jobs/employer/${employerId}`
        );
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [employerId]);

  const fetchApplications = async (job) => {
    setSelectedJob(job);
    setLoading(true);

    try {
      const response = await fetch(
        `https://careerdwaar.onrender.com/api/applications/job/${job.id}`
      );
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
    setApplications([]);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Posted Jobs
      </h2>

      {!user ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No jobs posted yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white-bg shadow-lg rounded-4xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600">
                <strong>Category:</strong> {job.category}
              </p>
              <p className="text-gray-600">
                <strong>Type:</strong> {job.job_type}
              </p>
              <p className="text-gray-600">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-gray-600">
                <strong>Salary:</strong> {job.salary}
              </p>
              <p className="text-gray-600">
                <strong>Deadline:</strong> {job.deadline}
              </p>
              <a
                href={job.google_form_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-4xl  transition-all duration-300"
              >
                Apply Here
              </a>

              <button
                onClick={() => fetchApplications(job)}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-4xl  transition-all duration-300"
              >
                View Applications
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for applications */}
      {selectedJob && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white-bg rounded-4xl  p-6 w-full max-w-[1000px] shadow-lg max-h-[80vh] overflow-auto">
            <h3 className="text-2xl font-semibold text-gray-800">
              Applications for {selectedJob.title}
            </h3>

            {loading ? (
              <p className="text-gray-500 mt-3">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p className="text-gray-500 mt-3">No applications yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {applications.map((application, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-100 rounded-4xl  shadow-sm border border-gray-300"
                  >
                    <p className="text-gray-700">
                      <strong>Student:</strong> {application.student_name}
                    </p>
                    <p className="text-gray-700">
                      <strong>Status:</strong> {application.status}
                    </p>
                    <p className="text-gray-700">
                      <strong>Resume:</strong>{" "}
                      <a
                        href={application.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Resume
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={closeModal}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-4xl  transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
