import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://car4wash-back.vercel.app/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // optional – for quick access
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-[#cae3ff] to-[#89bbf4] overflow-hidden">
      <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow mb-2">Spotless</h1>
      <p className="text-gray-700 text-lg mb-6">Log in to your account</p>

      <div className="w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/50 rounded-2xl shadow-xl p-8">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold transition bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-[1.02] shadow-lg"
          >
            Log In
          </button>

          {/* Google Login */}
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              Or log in with
              <a
                href="https://car4wash-back.vercel.app/api/auth/google"
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google" className="w-6 h-6 pointer-events-none select-none" />
                Google
              </a>
            </div>

            <div className="text-gray-700 text-sm mt-2">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}