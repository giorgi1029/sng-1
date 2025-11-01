import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/signin/Signup"; // import matches the file name
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} /> {/* route URL */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
