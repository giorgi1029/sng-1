import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { BusinessProvider } from "./context/BusinessContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <BusinessProvider>
      <App />
    </BusinessProvider>
    </BrowserRouter>
  </StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { BrowserRouter } from "react-router-dom";
// import { BusinessProvider } from "./context/BusinessContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <BusinessProvider>
//       <App />
//     </BusinessProvider>
//   </BrowserRouter>
// );
