import React, { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-4 shadow-lg flex items-center justify-between">
      {/* Logo / Site Name */}
      <h1 className="text-2xl font-bold tracking-wide">Saxeli</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="hover:text-gray-300 transition">Home</a>
        <a href="#" className="hover:text-gray-300 transition">About</a>
        <a href="#" className="hover:text-gray-300 transition">Contact</a>
        
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-600"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 text-white flex flex-col items-center md:hidden py-4 space-y-2 shadow-lg">
          <a href="#" className="hover:text-gray-300 transition">Home</a>
          <a href="#" className="hover:text-gray-300 transition">About</a>
          <a href="#" className="hover:text-gray-300 transition">Contact</a>
          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl shadow-md transition">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
}
