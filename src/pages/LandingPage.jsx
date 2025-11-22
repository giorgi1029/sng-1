import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Header / Hero */}
      <header className="flex flex-col items-center justify-center text-center py-32 px-6 
        bg-gradient-to-r from-blue-300 via-blue-500 to-blue-500 
        text-white shadow-xl relative overflow-hidden">

        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>

        <h1 className="text-6xl md:text-7xl font-extrabold drop-shadow-lg relative z-10">
          Car4wash
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl mt-6 opacity-90 relative z-10">
          Book washes instantly or register your business. Fast, modern, and secure.
        </p>

        <div className="flex gap-4 mt-10 relative z-10">
          <button
            onClick={goToSignUp}
            className="bg-white text-blue-300 px-7 py-3 rounded-2xl 
              font-semibold shadow-lg hover:shadow-2xl hover:scale-105 
              transition-all"
          >
            Get Started
          </button>

          <button
            className="border border-white px-7 py-3 rounded-2xl font-semibold 
              hover:bg-white hover:text-blue-700 transition-all shadow-md"
          >
            Learn More
          </button>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-14">
          Why Choose Car4wash?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {/* Card */}
          <div className="
            bg-white/70 backdrop-blur-xl
            rounded-3xl shadow-xl border border-blue-100
            p-8 text-center hover:shadow-2xl hover:-translate-y-1 
            transition-all duration-300">
            <h3 className="text-2xl font-bold text-blue-700 mb-3">Fast & Reliable</h3>
            <p className="text-gray-600">
              Instantly find and book nearby car wash services with modern UI.
            </p>
          </div>

          <div className="
            bg-white/70 backdrop-blur-xl
            rounded-3xl shadow-xl border border-blue-100
            p-8 text-center hover:shadow-2xl hover:-translate-y-1 
            transition-all duration-300">
            <h3 className="text-2xl font-bold text-blue-700 mb-3">Business Friendly</h3>
            <p className="text-gray-600">
              Easily register and manage your car wash business from anywhere.
            </p>
          </div>

          <div className="
            bg-white/70 backdrop-blur-xl
            rounded-3xl shadow-xl border border-blue-100
            p-8 text-center hover:shadow-2xl hover:-translate-y-1 
            transition-all duration-300">
            <h3 className="text-2xl font-bold text-blue-700 mb-3">Secure Payments</h3>
            <p className="text-gray-600">
              Smooth and safe transactions for every wash and service.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-blue-700 text-white text-center shadow-inner">
        <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-lg mb-8 opacity-90">
          Create your account today and join the future of car wash booking.
        </p>

        <button
          onClick={goToSignUp}
          className="bg-white text-blue-700 px-8 py-3 rounded-2xl 
            font-semibold shadow-lg hover:shadow-2xl hover:scale-105 
            transition-all"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Car4wash. All rights reserved.
      </footer>
    </div>
  );
}
