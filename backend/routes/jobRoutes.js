const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.post("/add-job", jobController.addJob);
router.get("/jobs", jobController.getAllJobs);
router.post("/apply", jobController.applyForJob);
router.post("/applied-jobs", jobController.getAppliedJobsList);
router.get("/jobs/employer/:employerId", jobController.getEmployerJobs);
router.get("/applications/job/:jobId", jobController.getJobApplications);

module.exports = router;
