/* eslint-disable no-undef */
const mysql = require("mysql2/promise");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to add a job posting
async function addJobPosting(jobData) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO Jobs (title, company, location, salary, description) VALUES (?, ?, ?, ?, ?)",
      jobData
    );
    connection.release();
    return { success: true, jobId: result.insertId };
  } catch (error) {
    console.error("Error adding job posting:", error);
    throw error;
  }
}

// Function to fetch all job postings
async function getJobPostings() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM Jobs");
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error fetching job postings:", error);
    throw error;
  }
}

// Function to register a new user
async function registerUser(
  name,
  email,
  password,
  gender,
  role = "Employee",
  profilePictureURL = ""
) {
  try {
    const connection = await pool.getConnection();

    // Check if email already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      connection.release();
      return { success: false, message: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const dateJoined = new Date();
    const status = "Active";

    // Default profile picture
    profilePictureURL =
      gender === "male"
        ? "https://avatar.iran.liara.run/public/boy"
        : "https://avatar.iran.liara.run/public/girl";

    // Insert user
    await connection.execute(
      "INSERT INTO Users (userId, name, email, password, role, profilePictureURL, dateJoined, gender, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        name,
        email,
        hashedPassword,
        role,
        profilePictureURL,
        dateJoined,
        gender,
        status,
      ]
    );

    connection.release();
    return { success: true, message: "User registered successfully", userId };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to log in a user
async function loginUser(email, password) {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return { success: false, message: "User not found" };
    }

    const user = users[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      connection.release();
      return { success: false, message: "Incorrect password" };
    }

    connection.release();
    return {
      success: true,
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePictureURL: user.profilePictureURL,
        dateJoined: user.dateJoined,
        status: user.status,
      },
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

module.exports = { addJobPosting, getJobPostings, registerUser, loginUser };
