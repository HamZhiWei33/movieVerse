import React, { createContext, useContext, useState, useEffect } from "react";

export const UserValidationContext = createContext();

export const UserValidationProvider = ({ children }) => {
  const [isValidateUser, setIsValidateUser] = useState(false);

  useEffect(() => {
    // Check if user is already logged in on reload
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsValidateUser(isLoggedIn);
  }, []);

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsValidateUser(true);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsValidateUser(false);
  };

  return (
    <UserValidationContext.Provider value={{ isValidateUser, login, logout }}>
      {children}
    </UserValidationContext.Provider>
  );
};
