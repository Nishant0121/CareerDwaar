import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    companyName: "",
    industry: "",
    website: "",
    logo: "",
    verificationCode: "",
  });

  const [companies, setCompanies] = useState([]); // List of companies from DB
  const [selectedCompanyCode, setSelectedCompanyCode] = useState(""); // Unique Code of selected company
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  const navigate = useNavigate();

  // Fetch company list from the database
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          "https://careerdwaar.onrender.com/api/companies/getcompanies"
        );
        setCompanies(response.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle company selection
  const handleCompanyChange = (e) => {
    const company = companies.find((c) => c.company_name === e.target.value);
    setFormData({ ...formData, companyName: company.company_name });
    setSelectedCompanyCode(company.unique_code);
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Show verification popup
      setShowVerificationPopup(true);
    } catch (err) {
      setError("Error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle verification
  const handleVerification = async () => {
    if (formData.verificationCode !== selectedCompanyCode) {
      setError("Invalid verification code. Please try again.");
      setShowVerificationPopup(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://careerdwaar.onrender.com/api/auth/register-employer",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender || null,
          company_name: formData.companyName,
          industry: formData.industry || null,
          website: formData.website || null,
          logo: formData.logo || null,
        }
      );

      alert("Registration Successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError("Verification failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center rounded-4xl md:p-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Employer Registration
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border rounded-md"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 mb-3 border rounded-md"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border rounded-md"
          >
            <option value="">Select Gender (Optional)</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Company Selection */}
          <select
            name="companyName"
            value={formData.companyName}
            onChange={handleCompanyChange}
            required
            className="px-4 py-2 mb-3 border rounded-md"
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.unique_code} value={company.company_name}>
                {company.company_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="industry"
            placeholder="Industry (e.g., Tech, Finance)"
            value={formData.industry}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border rounded-md"
          />

          <input
            type="url"
            name="website"
            placeholder="Company Website (Optional)"
            value={formData.website}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border rounded-md"
          />

          <input
            type="url"
            name="logo"
            placeholder="Company Logo URL (Optional)"
            value={formData.logo}
            onChange={handleChange}
            className="px-4 py-2 mb-3 border rounded-md"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Register as Employer"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Verification Popup */}
      {showVerificationPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4 text-center">
              Enter Verification Code
            </h3>
            <p className="text-sm text-gray-600 mb-3 text-center">
              A unique code is required to verify your company.
            </p>
            <input
              type="text"
              name="verificationCode"
              placeholder="Enter Code"
              value={formData.verificationCode}
              onChange={handleChange}
              className="px-4 py-2 mb-3 border w-full rounded-md"
            />
            <button
              onClick={handleVerification}
              className="bg-green-500 text-white py-2 w-full rounded-md hover:bg-green-600 transition"
            >
              Verify & Register
            </button>
            <button
              onClick={() => setShowVerificationPopup(false)}
              className="mt-2 text-sm text-gray-500 hover:underline w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
