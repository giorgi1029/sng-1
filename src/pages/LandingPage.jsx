import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
const navigate = useNavigate();

const goToSignUp = () => {
navigate("/signup");
};

const scrollToFeatures = () => {
const element = document.getElementById("features");
if (element) {
element.scrollIntoView({ behavior: "smooth" });
}
};

return ( <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-x-hidden">

  {/* HERO */}
  <header className="relative flex flex-col items-center justify-center text-center py-32 px-6 overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white">

    {/* Animated background shapes */}
    <div className="absolute top-0 left-[-100px] w-[400px] h-[400px] rounded-full bg-white/20 blur-[100px] animate-pulse-slow"></div>
    <div className="absolute bottom-0 right-[-120px] w-[500px] h-[500px] rounded-full bg-white/30 blur-[150px] animate-pulse-slow"></div>

    {/* Main content */}
    <h1 className="relative z-10 text-6xl md:text-7xl font-extrabold drop-shadow-lg leading-tight">
      Car4wash
    </h1>
    <p className="relative z-10 text-xl md:text-2xl max-w-3xl mt-6 opacity-90">
      Instantly book car washes or register your business. Fast, modern, and reliable.
    </p>

    {/* Buttons */}
    <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-12">
      <button
        onClick={goToSignUp}
        className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
      >
        Get Started
      </button>
      <button
        onClick={scrollToFeatures}
        className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
      >
        Learn More
      </button>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-10 w-full flex justify-center z-10">
      <span className="block w-3 h-3 rounded-full bg-white animate-bounce"></span>
    </div>
  </header>

  {/* FEATURES */}
  <section id="features" className="py-24 px-6 bg-blue-50">
    <h2 className="text-4xl font-bold text-center text-blue-700 mb-14">
      Why Choose Car4wash?
    </h2>

    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

      {/* Feature Card 1 */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100 p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
       
        <h3 className="text-2xl font-bold text-blue-700 mb-3">Fast & Reliable</h3>
        <p className="text-gray-600">
          Instantly find and book nearby car wash services with modern UI.
        </p>
      </div>

      {/* Feature Card 2 */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100 p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      
        <h3 className="text-2xl font-bold text-blue-700 mb-3">Business Friendly</h3>
        <p className="text-gray-600">
          Easily register and manage your car wash business from anywhere.
        </p>
      </div>

      {/* Feature Card 3 */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100 p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
       
        <h3 className="text-2xl font-bold text-blue-700 mb-3">Secure Payments</h3>
        <p className="text-gray-600">
          Smooth and safe transactions for every wash and service.
        </p>
      </div>

    </div>
  </section>

  {/* CALL TO ACTION */}
  <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center shadow-inner">
    <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
    <p className="text-lg mb-8 opacity-90">
      Create your account today and join the future of car wash booking.
    </p>
    <button
      onClick={goToSignUp}
      className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
    >
      Get Started
    </button>
  </section>

  {/* FOOTER */}
  <footer className="py-6 text-center text-gray-600">
    &copy; {new Date().getFullYear()} Car4wash. All rights reserved.
  </footer>

  <style>
    {`
      .animate-pulse-slow {
        animation: pulse 6s ease-in-out infinite;
      }
    `}
  </style>
</div>
)}