/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

// Create the App Context
const AppContext = createContext();

// AppProvider Component to Wrap the App
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);

  const getStudent = async () => {
    try {
      const response = await axios.get(
        `https://careerdwaar.onrender.com/api/auth/getstudent/${user.userId}`
      );
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  };

  // Load user from localStorage and fetch student data if user role is 'student'
  useEffect(() => {
    const storedUser = localStorage.getItem("loginedUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Restore user state
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Effect to fetch student data once user is set and role is 'student'
  useEffect(() => {
    if (user?.role === "student") {
      getStudent(); // Fetch student data only if the user is a student
    }
  }, [user]); // This effect depends on the `user` state

  // Login Function
  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("loginedUser");
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, login, logout, student }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook for Using Auth Context
export const useAuth = () => {
  return useContext(AppContext);
};

// Named Exports (NO default export)
export { AppContext };
