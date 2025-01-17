import React, { createContext, useState, useEffect, useContext } from "react";

// Create the UserContext
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user data and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Function to update user and token
  const updateUserContext = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", newToken);
  };

  // Function to clear user and token (e.g., on logout)
  const clearUserContext = () => {
    setUser(null);
    setToken(null);

    // Remove from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ user, token, updateUserContext, clearUserContext }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};
