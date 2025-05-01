import React, { createContext, useContext, useState } from "react";

export const UserValidationContext = createContext();

export const UserValidationProvider = ({ children }) => {
  const [isValidateUser, setIsValidateUser] = useState(true);

  return (
    <UserValidationContext.Provider
      value={{ isValidateUser, setIsValidateUser }}
    >
      {children}
    </UserValidationContext.Provider>
  );
};
