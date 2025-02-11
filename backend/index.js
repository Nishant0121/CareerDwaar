/* eslint-disable no-undef */
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const {
  addJobPosting,
  getJobPostings,
  registerUser,
  loginUser,
  registerEmployer,
  applyJob,
  getAppliedJobs,
  getPostedJobs,
  getApplicationsByJobId,
} = require("./functions"); // Import functions

dotenv.config();

const app = express();

const upload = multer({ dest: "uploads/" });

const auth = new google.auth.GoogleAuth({
  keyFile: "./careerdwaar.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

const PORT = 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("CareerDwaar Backend is running...");
});

// ✅ API Route to Add Job Posting
app.post("/add-job", async (req, res) => {
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
});

// ✅ API Route to Get All Job Postings
app.get("/jobs", async (req, res) => {
  try {
    const jobPostings = await getJobPostings();
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error("Error fetching job postings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ API Route to Register a User (Employee)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, college_name, branch, resume_link } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const registrationResult = await registerUser(
      name,
      email,
      password,
      gender,
      college_name,
      branch,
      resume_link
    );

    if (!registrationResult.success) {
      return res.status(409).json({ error: registrationResult.message });
    }

    res.status(201).json({
      message: registrationResult.message,
      userId: registrationResult.userId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ API Route to Log In a User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required!" });
    }

    const loginResult = await loginUser(email, password);

    if (!loginResult.success) {
      return res.status(401).json({ error: loginResult.message });
    }

    res.status(200).json({
      message: loginResult.message,
      user: loginResult.user,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ API Route to Register an Employer
app.post("/register-employer", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      company_name,
      industry,
      website,
      logo,
    } = req.body;

    if (!name || !email || !password || !company_name) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled!" });
    }

    const registrationResult = await registerEmployer(
      name,
      email,
      password,
      gender,
      company_name,
      industry,
      website,
      logo
    );

    if (!registrationResult.success) {
      return res.status(409).json({ error: registrationResult.message });
    }

    res.status(201).json({
      message: "Employer registered successfully",
      userId: registrationResult.userId,
    });
  } catch (error) {
    console.error("Error registering employer:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/upload-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileMetadata = {
      name: req.file.originalname,
      parents: ["16CkLIxHrWL8j77MGzGhh-QqNKMf7z_P5"],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: Buffer.from(req.file.buffer),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: { mimeType: req.file.mimetype, body: media.body },
      fields: "id",
    });

    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    const fileUrl = `https://drive.google.com/file/d/${file.data.id}/view`;
    res.json({ url: fileUrl });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "Error uploading file" });
  }
});

app.post("/apply", async (req, res) => {
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
});

app.post("/applied-jobs", async (req, res) => {
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
});

app.get("/jobs/employer/:employerId", async (req, res) => {
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
});

app.get("/applications/job/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await getApplicationsByJobId(jobId); // Wait for the promise to resolve
    console.log(applications); // Check the fetched applications in console
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error fetching applications:", error);
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
