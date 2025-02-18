/* eslint-disable no-undef */
const fs = require("fs");
const mysql = require("mysql2/promise");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const sslCert = process.env.DB_SSL_CERT
  ? Buffer.from(process.env.DB_SSL_CERT, "utf-8")
  : fs.readFileSync("./ca1.pem");

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // ssl: {
  //   ca: sslCert,
  // },
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to add a job posting
async function addJobPosting(jobData) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO jobs (employer_id, title, category, job_type, location, salary, deadline, google_form_link)VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
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
    const [rows] = await connection.execute("SELECT * FROM jobs");
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error fetching job postings:", error);
    throw error;
  }
}

// Function to register a new user (employee)
async function registerUser(
  name,
  email,
  password,
  gender,
  college_name,
  branch,
  resume_link
) {
  try {
    const connection = await pool.getConnection();

    // Check if email already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      connection.release();
      return { success: false, message: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default profile picture based on gender
    const profilePictureURL =
      gender === "male"
        ? "https://avatar.iran.liara.run/public/boy"
        : "https://avatar.iran.liara.run/public/girl";

    // Insert user into users table
    const [userResult] = await connection.execute(
      "INSERT INTO users (name, email, password_hash, role, profile_picture) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, "student", profilePictureURL]
    );

    const userId = userResult.insertId; // Get the newly created user ID

    // Insert employer details into employers table
    await connection.execute(
      "INSERT INTO students (user_id, college_name, branch, resume_link) VALUES (?, ?, ?, ?)",
      [userId, college_name, branch || null, resume_link || null]
    );

    connection.release();
    return {
      success: true,
      message: "User registered successfully",
      userId: userResult.insertId,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to register an employer
async function registerEmployer(
  name,
  email,
  password,
  gender,
  company_name,
  industry,
  website,
  logo
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction(); // Start transaction

    // Check if email already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      connection.release();
      return { success: false, message: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default profile picture based on gender
    const profilePictureURL =
      gender === "male"
        ? "https://avatar.iran.liara.run/public/boy"
        : "https://avatar.iran.liara.run/public/girl";

    // Insert user into users table (as an employer)
    const [userResult] = await connection.execute(
      "INSERT INTO users (name, email, password_hash, role, profile_picture) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, "employer", profilePictureURL]
    );

    const userId = userResult.insertId; // Get the newly created user ID

    // Insert employer details into employers table
    await connection.execute(
      "INSERT INTO employers (user_id, company_name, industry, website, logo) VALUES (?, ?, ?, ?, ?)",
      [userId, company_name, industry || null, website || null, logo || null]
    );

    await connection.commit(); // Commit transaction
    connection.release();
    return {
      success: true,
      message: "Employer registered successfully",
      userId,
    };
  } catch (error) {
    await connection.rollback(); // Rollback transaction if an error occurs
    connection.release();
    console.error("Error registering employer:", error);
    throw error;
  }
}

// Function to log in a user
async function loginUser(email, password) {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return { success: false, message: "User not found" };
    }

    const user = users[0];

    // Ensure password_hash exists before comparing
    if (!user.password_hash) {
      connection.release();
      return { success: false, message: "Invalid user data" };
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      connection.release();
      return { success: false, message: "Incorrect password" };
    }

    connection.release();
    return {
      success: true,
      message: "Login successful",
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePictureURL: user.profile_picture,
        createdAt: user.created_at,
      },
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

async function applyJob(job_id, name, email) {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT * FROM user_student_view WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      connection.release();
      return { success: false, message: "User not found" };
    }

    const user = result[0];

    const [response] = await connection.execute(
      "INSERT INTO applications (job_id, student_id, resume_link) VALUES (?, ?, ?)",
      [job_id, user.user_id, user.resume_link]
    );

    if (response.affectedRows === 0) {
      connection.release();
      return { success: false, message: "Failed to apply for the job" };
    }

    connection.release();
    return { success: true, message: "Applied for the job successfully" };
  } catch (error) {
    console.error("Error applying job:", error);
    throw error;
  }
}

async function getAppliedJobs(userId) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM student_applied_jobs WHERE student_id = ?",
      [userId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    throw error;
  }
}

async function getPostedJobs(userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM jobs WHERE employer_id = ?",
      [Number(userId)]
    );
    console.log("Fetched jobs:", rows);
    return rows;
  } catch (error) {
    console.error("Error fetching posted jobs:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function getApplicationsByJobId(jobId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM job_applications_view WHERE job_id = ?",
      [jobId]
    );
    console.log(jobId);
    return rows;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function getStudentInfoById(studentId) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        u.id AS user_id,
        u.name,
        u.email,
        u.role,
        u.profile_picture,
        u.created_at,
        u.updated_at,
        s.id AS student_id,
        s.college_name,
        s.branch,
        s.resume_link,
        s.is_verified
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      WHERE s.user_id = ?;
    `;

    const [rows] = await connection.execute(query, [studentId]);

    // Check if the student exists in the result
    if (rows.length === 0) {
      throw new Error("Student not found");
    }

    // Return the student information (first row, as studentId is unique)
    return rows[0];
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw new Error("Internal server error");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}

module.exports = {
  addJobPosting,
  getJobPostings,
  registerUser,
  loginUser,
  registerEmployer,
  applyJob,
  getAppliedJobs,
  getPostedJobs,
  getApplicationsByJobId,
  getStudentInfoById,
};
