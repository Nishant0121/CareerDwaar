import axios from "axios";
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error messages

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);
      alert("Login Successful!");
      localStorage.setItem("loginedUser", JSON.stringify(response.data.user));
      window.location.href = "/"; // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-3 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
