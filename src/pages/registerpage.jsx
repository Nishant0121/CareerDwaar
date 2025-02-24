/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Register from "./register";
import EmployerRegister from "./register_employer";

export default function RegisterPage() {
  const [userType, setUserType] = useState("student");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen w-full bg-transparent p-5"
    >
      <h1 className="text-3xl font-bold text-gray-700 mb-5">Register</h1>

      {/* User Type Selection */}
      <div className="mb-5">
        <div className="flex space-x-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUserType("student")}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              userType === "student"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Student
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUserType("employer")}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              userType === "employer"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Employer
          </motion.button>
        </div>
      </div>

      {/* Form Animation */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {userType === "student" && (
            <motion.div
              key="student"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Register />
            </motion.div>
          )}

          {userType === "employer" && (
            <motion.div
              key="employer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <EmployerRegister />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
