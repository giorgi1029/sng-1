import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../../context/BusinessContext";
import BusinessForm from "./BusinessForm";

export default function SignUp() {
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addBusiness } = useBusiness();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    carMake: "",
    carModel: "",
    plateNumber: "",
  });

  const handleUserInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // User Sign Up Submit Handler
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://express-auth-indol.vercel.app/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          carDetails: {
            make: userData.carMake,
            model: userData.carModel,
            plateNumber: userData.plateNumber,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success → Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Car4wash</h1>
      <p className="text-gray-600 mb-6 text-center">
        Sign up as a user or register your business to start immediately.
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "user"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("user")}
        >
          User Sign-Up
        </button>

        <button
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "business"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("business")}
        >
          Register Business
        </button>
      </div>

      {/* Forms */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {activeTab === "user" ? (
          <form className="space-y-4" onSubmit={handleUserSubmit}>
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm text-center">
                {error}
              </div>
            )}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={userData.name}
              onChange={handleUserInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleUserInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (optional)"
              value={userData.phone}
              onChange={handleUserInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleUserInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Car Details Section */}
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                name="carMake"
                placeholder="Make"
                value={userData.carMake}
                onChange={handleUserInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="carModel"
                placeholder="Model"
                value={userData.carModel}
                onChange={handleUserInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="plateNumber"
                placeholder="Plate #"
                value={userData.plateNumber}
                onChange={handleUserInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition ${
                loading && "opacity-70 cursor-not-allowed"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <BusinessForm addBusiness={addBusiness} navigate={navigate} />
        )}
      </div>
    </div>
  );
}