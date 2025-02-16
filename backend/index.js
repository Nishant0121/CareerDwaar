/* eslint-disable no-undef */
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const { google } = require("googleapis");
const { Readable } = require("stream"); // Import the Readable stream class
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Use memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

const auth = new google.auth.GoogleAuth({
  keyFile: "./careerdwaar.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

const PORT = 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://career-dwaar.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("CareerDwaar Backend is running...");
});

// Routes
app.use("/api", jobRoutes);
app.use("/api/auth", authRoutes);

// File upload route
app.post("/upload-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileMetadata = {
      name: req.file.originalname,
      parents: ["16CkLIxHrWL8j77MGzGhh-QqNKMf7z_P5"],
    };

    // Convert buffer to a readable stream
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer); // Push the buffer into the stream
    bufferStream.push(null); // End the stream

    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream, // Pass the readable stream here
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
