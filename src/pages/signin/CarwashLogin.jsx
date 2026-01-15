import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CarwashLogin() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrorMessage(""); // clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        "https://car4wash-back.vercel.app/api/carwash/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Login failed. Please check your credentials.");
        return;
      }

      // ─── Store token & user type in localStorage ───
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "carwash");

      // Optional: you can also store some user info if you want
      // localStorage.setItem("userEmail", data.email || loginData.email);

      navigate("/dashboard"); // or "/profile" if you prefer
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-[#cae3ff] to-[#89bbf4] overflow-hidden">
      <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow mb-2">
        Spotless
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Log in to your carwash account
      </p>

      <div className="w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/50 rounded-2xl shadow-xl p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center text-sm">
              {errorMessage}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-lg
              ${isLoading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-[1.02] hover:shadow-xl"}`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          <div className="text-gray-700 text-sm mt-4 text-center">
            Don’t have a carwash account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}