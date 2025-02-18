const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/register-employer", authController.registerEmployerUser);
router.get("/getstudent/:studentId", authController.getStudentInfo);

module.exports = router;
