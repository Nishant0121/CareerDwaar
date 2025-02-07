/* eslint-disable no-undef */
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  addJobPosting,
  getJobPostings,
  registerUser,
  loginUser,
} = require("./functions"); // Import login function

dotenv.config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("CareerDwaar Backend is running...");
});

// API Route to Add Job Posting
app.post("/add-job", async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body;

    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    await addJobPosting([title, company, location, salary, description]);
    res.status(201).json({ message: "Job posting added successfully!" });
  } catch (error) {
    console.error("Error adding job posting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Route to Get All Job Postings
app.get("/jobs", async (req, res) => {
  try {
    const jobPostings = await getJobPostings();
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error("Error fetching job postings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Route to Register a User
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const registrationResult = await registerUser(
      name,
      email,
      password,
      gender
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

// API Route to Log In a User
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
