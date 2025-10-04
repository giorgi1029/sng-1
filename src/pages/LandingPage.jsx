import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you could also handle form data, API calls, etc.
    navigate("/dashboard"); // Redirect to next page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to #name</h1>
        <p className="text-gray-600 mt-2">
          Sign up as a user or register your business with us.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("signup")}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "signup"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => setActiveTab("business")}
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "business"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          My Business
        </button>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {activeTab === "signup" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold">Register Your Business</h2>
            <input
              type="text"
              placeholder="Business Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Business Address"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Business Email"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Register Business
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
