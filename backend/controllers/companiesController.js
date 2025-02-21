const { getCompanies } = require("../functions");

const getAllCompanies = async (req, res) => {
  try {
    const companies = await getCompanies(); // Call the function to fetch companies
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllCompanies };
