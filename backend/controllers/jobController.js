/* eslint-disable no-undef */
const {
  addJobPosting,
  getJobPostings,
  applyJob,
  getAppliedJobs,
  getPostedJobs,
  getApplicationsByJobId,
} = require("../functions");

const addJob = async (req, res) => {
  try {
    const {
      employer_id,
      title,
      category,
      job_type,
      location,
      salary,
      deadline,
      google_form_link,
    } = req.body;

    if (!employer_id || !title || !job_type || !deadline) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    await addJobPosting([
      employer_id,
      title,
      category,
      job_type,
      location,
      salary,
      deadline,
      google_form_link,
    ]);
    res.status(201).json({ message: "Job posting added successfully!" });
  } catch (error) {
    console.error("Error adding job posting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobPostings = await getJobPostings();
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error("Error fetching job postings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const applyForJob = async (req, res) => {
  try {
    const { job_id, name, email } = req.body;

    if (!job_id || !name || !email) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled!" });
    }

    const result = await applyJob(job_id, name, email);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAppliedJobsList = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID is required to fetch applied jobs" });
    }

    const appliedJobs = await getAppliedJobs(userId);
    res.status(200).json(appliedJobs);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const userId = Number(req.params.employerId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid employer ID" });
    }

    const jobs = await getPostedJobs(userId);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error fetching jobs:", error);
  }
};

const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await getApplicationsByJobId(jobId);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error fetching applications:", error);
  }
};

module.exports = {
  addJob,
  getAllJobs,
  applyForJob,
  getAppliedJobsList,
  getEmployerJobs,
  getJobApplications,
};
