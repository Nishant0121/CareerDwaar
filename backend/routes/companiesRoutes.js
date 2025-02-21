const express = require("express");
const { getAllCompanies } = require("../controllers/companiesController");
const router = express.Router();

router.get("/getcompanies", getAllCompanies);

module.exports = router;
