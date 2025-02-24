import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ApplyModal from "../components/applyModal";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState(0);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://careerdwaar.onrender.com/api/jobs"
        );
        const sortedJobs = response.data.sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
        setJobs(sortedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 🔥 Optimized Search with useMemo and Filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (!job) return false; // Ensure job exists

      const jobTitle = job.title?.toLowerCase() ?? "";
      const jobCompany = job.company?.toLowerCase() ?? "";
      const jobLocation = job.location?.toLowerCase() ?? "";

      return (
        (searchTerm === "" ||
          jobTitle.includes(searchTerm.toLowerCase()) ||
          jobCompany.includes(searchTerm.toLowerCase()) ||
          jobLocation.includes(searchTerm.toLowerCase())) &&
        (locationFilter === "" ||
          jobLocation === locationFilter.toLowerCase()) &&
        (experienceFilter === "" || job.experience === experienceFilter) &&
        (salaryFilter === 0 || job.salary >= salaryFilter)
      );
    });
  }, [searchTerm, locationFilter, salaryFilter, experienceFilter, jobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredJobs]);

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
        <div className="md:w-1/4 bg-white-bg backdrop-blur-md w-full p-6 rounded-4xl shadow-md min-h-fit md:min-h-screen">
          <h2 className="text-lg text-black font-semibold mb-4">Filters</h2>

          {/* 🔍 Search Input with Debouncing */}
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            className="w-full max-w-[50vw] mx-auto p-2 border rounded-4xl mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full max-w-[50vw] mx-auto p-2 border rounded-4xl mb-4"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {[...new Set(jobs.map((job) => job.location))].map(
              (location, index) => (
                <option key={`location-${index}`} value={location}>
                  {location}
                </option>
              )
            )}
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
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              </div>
            ) : displayedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedJobs.map((job, index) => (
                  <div
                    key={`job-${index}`}
                    className="bg-white-bg backdrop-blur-lg p-6 rounded-4xl shadow-md"
                  >
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-gray-600">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                    <p className="text-sm text-gray-500">
                      Salary: ₹{job.salary}
                    </p>
                    <button
                      onClick={() => openModal(job)}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-4xl hover:bg-blue-600 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
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
