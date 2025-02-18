import { useState, useEffect } from "react";
import axios from "axios";
import ApplyModal from "../components/applyModal";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState(0);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "https://careerdwaar.onrender.com/api/jobs"
        );
        const sortedJobs = response.data.sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
        setJobs(sortedJobs);
        setFilteredJobs(sortedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      if (!job || !job.title) return false;

      return (
        (searchTerm === "" ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (locationFilter === "" || job.location === locationFilter) &&
        (experienceFilter === "" || job.experience === experienceFilter) &&
        (salaryFilter === 0 || job.salary >= salaryFilter)
      );
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchTerm, locationFilter, salaryFilter, experienceFilter, jobs]);

  const locations = [...new Set(jobs.map((job) => job.location))];

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const displayedJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex md:flex-row flex-col bg-bglight min-h-screen p-6">
        {/* Sidebar Filters */}
        <div className="md:w-1/4 bg-white-bg backdrop-blur-md w-full p-6 rounded-4xl shadow-md  min-h-fit md:min-h-screen">
          <h2 className="text-lg text-black font-semibold mb-4">Filters</h2>

          <input
            type="text"
            placeholder="Search by title, company..."
            className="w-full max-w-[50vw] mx-auto p-2 border rounded-4xl mb-4"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full max-w-[50vw] mx-auto p-2 border rounded-4xl mb-4"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((location, index) => (
              <option key={`location-${index}`} value={location}>
                {location}
              </option>
            ))}
          </select>

          <input
            type="range"
            min="0"
            max="1000000"
            step="50000"
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(Number(e.target.value))}
            className="w-full max-w-[50vw] mx-auto mb-2"
          />
          <p className="text-gray-600">Salary: ₹{salaryFilter}</p>

          <select
            className="w-full max-w-[50vw] mx-auto p-2 border rounded-4xl mb-4"
            onChange={(e) => setExperienceFilter(e.target.value)}
          >
            <option value="">Experience</option>
            <option value="1 year">1 Year</option>
            <option value="2 years">2 Years</option>
            <option value="3+ years">3+ Years</option>
          </select>
        </div>

        {/* Job Listings */}
        <div className="md:w-3/4 w-full md:ml-6">
          <h1 className="text-2xl font-bold my-6">Job Listings</h1>

          <div className="space-y-6 overflow-y-auto max-h-screen">
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job, index) => (
                <div
                  key={`job-${index}`}
                  className="bg-white-bg backdrop-blur-lg p-6 rounded-4xl shadow-md"
                >
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                  <p className="text-sm text-gray-500">Salary: ₹{job.salary}</p>
                  <button
                    onClick={() => openModal(job)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-4xl hover:bg-blue-600 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No jobs found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-4xl ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-4xl ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedJob && (
        <ApplyModal selectedJob={selectedJob} closeModal={closeModal} />
      )}
    </>
  );
}
