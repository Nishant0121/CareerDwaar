/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";

// Create the App Context
const AppContext = createContext();

// AppProvider Component to Wrap the App
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loginedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Restore user state
    }
  }, []);

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
    <AppContext.Provider value={{ user, login, logout }}>
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
