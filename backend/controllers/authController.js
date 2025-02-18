const {
  registerUser,
  loginUser,
  registerEmployer,
  getStudentInfoById,
} = require("../functions");

const register = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

const registerEmployerUser = async (req, res) => {
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
};

const getStudentInfo = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentInfo = await getStudentInfoById(studentId);
    res.json(studentInfo);
  } catch (error) {
    console.error("Error fetching student info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  registerEmployerUser,
  getStudentInfo,
};
