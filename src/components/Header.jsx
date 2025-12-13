import React, { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
const [profile, setProfile] = useState(null);
  return (
    <header className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-4 shadow-lg flex items-center justify-between h-[12vh]">
              <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Spotless
          </h1>

          {profile && (
            <p className="text-lg text-gray-700 mt-1">
              Welcome, <span className="font-semibold">{profile.name}</span>
            </p>
          )}
        </div>

        <img
          src={
            profile?.image ||
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
          }
          alt="profile"
          className="w-12 h-12 rounded-full shadow-lg border-2 border-blue-300"
        />
    </header>
  );
}
