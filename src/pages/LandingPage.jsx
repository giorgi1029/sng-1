import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate("/signup"); // Change route to your SignUp page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-200">
      {/* Header / Hero */}
      <header className="flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-r from-cyan-300 to-cyan-700 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 ">Car4wash</h1>
        <p className="text-lg md:text-2xl max-w-xl mb-8">
          The easiest way to book car washes or register your business. Fast, reliable, and secure.
        </p>
        <div className="flex gap-4">
          <button
            onClick={goToSignUp}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            Get Started
          </button>
          <button
            className="bg-transparent border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Learn More
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Car4wash?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">
              Instantly find and book nearby car wash services with ease.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-2">Business Friendly</h3>
            <p className="text-gray-600">
              Register your business to reach more customers and manage
              appointments efficiently.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Safe and smooth payment processing for both customers and
              businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Business Registration Section */}
      <section className="py-20 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">
          Register Your Business with Car4wash
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <p className="text-lg text-gray-700 mb-6 text-center">
            Join our growing network of car wash businesses. Boost your
            visibility, get more bookings, and manage your operations easily
            through one platform.
          </p>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="border rounded-xl p-6 text-center hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-gray-500 mb-4">Perfect for small car wash stations</p>
              <p className="text-3xl font-bold mb-4">$9<span className="text-lg">/month</span></p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Up to 50 bookings/month</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <button
                onClick={goToSignUp}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Choose Plan
              </button>
            </div>

            <div className="border-2 border-blue-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Professional</h3>
              <p className="text-gray-500 mb-4">Best for growing businesses</p>
              <p className="text-3xl font-bold mb-4">$19<span className="text-lg">/month</span></p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Unlimited bookings</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Featured listings</li>
              </ul>
              <button
                onClick={goToSignUp}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Choose Plan
              </button>
            </div>

            <div className="border rounded-xl p-6 text-center hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-500 mb-4">For large franchises or networks</p>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>Custom booking system</li>
                <li>Dedicated account manager</li>
                <li>Full analytics suite</li>
              </ul>
              <button
                onClick={goToSignUp}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">
          Join Car4wash today and grow your business with us.
        </p>
        <button
          onClick={goToSignUp}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Car4wash. All rights reserved.
      </footer>
    </div>
  );
}
