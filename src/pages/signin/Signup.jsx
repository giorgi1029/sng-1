import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BusinessForm from "./BusinessForm";
import Cookie from 'js-cookie'
export default function SignUp() {
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate(); // for redirection

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

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://car4wash-back.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      Cookies.set('token', data.token)

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-[#cae3ff] to-[#89bbf4] overflow-hidden">
      <div className='absolute top-[-120px] left-[-100px] w-[350px] h-[350px] rounded-full bg-blue-300/30 blur-[120px]'></div>
      <div className='absolute bottom-[-150px] right-[-80px] w-[380px] h-[380px] rounded-full bg-blue-500/30 blur-[140px]'></div>

      <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow mb-2">Car4wash</h1>
      <p className="text-gray-700 text-lg mb-6">Create your account and get started</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-8 py-2 rounded-full font-semibold text-sm transition shadow-sm ${
            activeTab === "user"
              ? "bg-blue-600 text-white scale-105 shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("user")}
        >
          User Sign-Up
        </button>
        <button
          className={`px-8 py-2 rounded-full font-semibold text-sm transition shadow-sm ${
            activeTab === "business"
              ? "bg-green-600 text-white scale-105 shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("business")}
        >
          Register Business
        </button>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/50 rounded-2xl shadow-xl p-8">
        {activeTab === "user" ? (
          <form className="space-y-4" onSubmit={handleUserSubmit}>
            {/* User inputs */}
            <input type="text" name="name" placeholder="Full Name" value={userData.name} onChange={handleUserInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
            <input type="email" name="email" placeholder="Email Address" value={userData.email} onChange={handleUserInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
            <input type="tel" name="phone" placeholder="Phone Number (optional)" value={userData.phone} onChange={handleUserInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition" />
            <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleUserInputChange} className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition" required />

            {/* <div className="grid grid-cols-3 gap-3">
              <input type="text" name="carMake" placeholder="Make" value={userData.carMake} onChange={handleUserInputChange} className="p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition" required />
              <input type="text" name="carModel" placeholder="Model" value={userData.carModel} onChange={handleUserInputChange} className="p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition" />
              <input type="text" name="plateNumber" placeholder="Plate #" value={userData.plateNumber} onChange={handleUserInputChange} className="p-3 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition" />
            </div> */}

            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold transition bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-[1.02] shadow-lg">
              Sign Up
            </button>

            {/* Login / Google OAuth */}
            <div className="flex flex-col items-center gap-3 mt-4">
              <div className="text-gray-700 text-sm">
                Have an account?{" "}
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/login")}>
                  Log in
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm">
                Or sign up with
                <a
                  href="https://car4wash-back.vercel.app/api/auth/google"
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                >
                  <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google" className="w-6 h-6 pointer-events-none select-none" />
                  Google
                </a>
              </div>
            </div>
          </form>
        ) : (
          <BusinessForm />
        )}
      </div>
    </div>
  );
}
