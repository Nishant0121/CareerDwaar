import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/app.context";

export default function SavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);

  const getSavedJobs = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/applied-jobs",
        {
          userId: user.userId, // Correct way to send data
        }
      );
      return response.data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      return []; // Return empty array on error
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await getSavedJobs();
      setSavedJobs(jobs);
    };

    if (user?.userId) {
      fetchJobs();
    }
  }, [user?.userId]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Saved Jobs</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {savedJobs.length > 0 ? (
          savedJobs.map((job, index) => (
            <div key={index} className="border p-4 rounded-4xl shadow">
              <h4 className="text-lg font-bold">{job.job_title}</h4>
              <p className="text-sm text-gray-600">{job.employer_company}</p>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No saved jobs found.</p>
        )}
      </div>
    </div>
  );
}
