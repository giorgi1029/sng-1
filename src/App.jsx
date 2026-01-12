import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/signin/Signup"; // import matches the file name
import Dashboard from "./pages/Dashboard";
import Login from "./pages/signin/Log-in";
import CarwashLogin from "./pages/signin/CarwashLogin";
import BusinessForm from "./pages/signin/BusinessForm";
import Profile from "./components/Profile";
import CarwashDetails from "./pages/CarwashDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} /> {/* route URL */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />}/>
      <Route path="/carwashlogin" element={<CarwashLogin />}/>
      <Route path="/profile" element={<Profile />} />
      <Route path="/carwash/:id" element={<CarwashDetails />} />
    </Routes>
  );
}
