import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) return;

    const endpoint =
      role === "carwash"
        ? "https://car4wash-back.vercel.app/api/carwash/auth/me"
        : "https://car4wash-back.vercel.app/api/users/me";

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-4 shadow-lg flex items-center justify-between h-[12vh]">
      <div>
        <h1
          className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          Spotless
        </h1>

        {profile && (
          <p className="text-sm text-gray-300 mt-1">
            Welcome,{" "}
            <span className="font-semibold">
              {profile.name}
            </span>
          </p>
        )}
      </div>

      <img
        onClick={() => navigate("/profile")}
        src={
          profile?.image ||
          "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        }
        alt="profile"
        className="w-12 h-12 rounded-full shadow-lg border-2 border-blue-300 cursor-pointer hover:scale-105 transition"
      />
    </header>
  );
}
