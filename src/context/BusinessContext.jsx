import React, { createContext, useState, useContext } from "react";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);

  const addBusiness = (business) => {
    setBusinesses((prev) => [...prev, business]);
  };

  return (
    <BusinessContext.Provider value={{ businesses, addBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);
