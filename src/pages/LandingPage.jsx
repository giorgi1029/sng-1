import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100">

      {/* HERO */}
      <header className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-cyan-600 text-white py-36 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <h1 className="relative z-10 text-6xl md:text-7xl font-extrabold tracking-tight">
          Spotless
        </h1>

        <p className="relative z-10 mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-white/90">
          The easiest way to book professional car washes or grow your car wash business online.
        </p>

        <div className="relative z-10 mt-12 flex flex-col sm:flex-row justify-center gap-5">
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-indigo-700 px-9 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
          >
            Book a Car Wash
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="border border-white/70 px-9 py-4 rounded-2xl font-semibold hover:bg-white/20 transition"
          >
            Register Your Business
          </button>
        </div>
      </header>

      {/* IMAGE SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-9xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          
          <img
            src="https://images.contentstack.io/v3/assets/blt62d40591b3650da3/bltee515d46b1b13f83/658ee585d082f768b425faf9/hero_PN1305_HowOftenWashCar_Header-1.jpg"
            alt="Car wash"
            className="rounded-3xl shadow-2xl"
          />

          <div>
            <h2 className="text-4xl font-bold text-indigo-800 mb-6">
              Premium Car Wash Experience
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Spotless connects customers with trusted car wash services nearby.
              From quick exterior washes to full detailing, everything is just a few clicks away.
            </p>
            <p className="text-gray-600 text-lg">
              Businesses get powerful tools to manage bookings, payments, and customers — all in one platform.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 bg-white px-6">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-20">
          How It Works
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">

          <div className="p-8 rounded-3xl bg-indigo-50 shadow-lg">
            <h3 className="text-2xl font-bold text-indigo-700 mb-3">1. Choose Service</h3>
            <p className="text-gray-600">
              Select nearby car washes, compare prices, and choose your service.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-indigo-50 shadow-lg">
            <h3 className="text-2xl font-bold text-indigo-700 mb-3">2. Book & Pay</h3>
            <p className="text-gray-600">
              Book instantly and pay securely through our platform.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-indigo-50 shadow-lg">
            <h3 className="text-2xl font-bold text-indigo-700 mb-3">3. Get Spotless</h3>
            <p className="text-gray-600">
              Arrive or relax — your car will be cleaned professionally.
            </p>
          </div>

        </div>
      </section>

 

      {/* BUSINESS CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-indigo-700 to-cyan-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Own a Car Wash Business?
        </h2>
        <p className="text-lg mb-10 text-white/90">
          Reach more customers, manage bookings, and grow faster with Spotless.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition"
        >
          Register Your Business
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 bg-white">
        © {new Date().getFullYear()} Spotless. All rights reserved.
      </footer>

    </div>
  );
}
