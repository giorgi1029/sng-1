
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BusinessForm() {
  const navigate = useNavigate();

  const [services, setServices] = useState([{ name: "", price: "" }]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    email: "",
    password: "",
    workingHours: "",
  });

  const handleAddService = () => {
    setServices([...services, { name: "", price: "" }]);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = { ...form, services };

  try {
    const res = await fetch(
      "https://car4wash-back.vercel.app/api/carwash/", // correct endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If auth required, add token:
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Carwash registered successfully!");
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
  }
};


  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Carwash Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-3 border border-[#c9d7ee] rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full p-3 border border-[#c9d7ee] rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Business Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-3 border border-[#c9d7ee] rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-3 border border-[#c9d7ee] rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
        required
      />

      <input
        type="text"
        name="workingHours"
        placeholder="Working Hours (e.g. 09:00 - 20:00)"
        value={form.workingHours}
        onChange={handleChange}
        className="w-full p-3 border border-[#c9d7ee] rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
        required
      />

      {/* Services */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Services You Offer
        </label>

        {services.map((service, index) => (
          <div key={index} className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder={`Service ${index + 1}`}
              value={service.name}
              onChange={(e) =>
                handleServiceChange(index, "name", e.target.value)
              }
              className="w-2/3 p-3 border border-[#c9d7ee] rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
            <input
              type="number"
              placeholder="₾ Price"
              value={service.price}
              onChange={(e) =>
                handleServiceChange(index, "price", e.target.value)
              }
              className="w-1/3 p-3 border border-[#c9d7ee] rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddService}
          className="w-full py-2 border border-blue-400 text-blue-600 rounded-xl bg-blue-50/40 hover:bg-blue-100 transition"
        >
          + Add Another Service
        </button>
      </div>

      {/* Register Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
      >
        Register Carwash
      </button>

      {/* Login & Google */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="text-gray-700 text-sm">
          Have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          Or sign up with
          <a
            href="https://car4wash-back.vercel.app/api/auth/google"
            className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
          >
            <img
              src="/src/assets/google.png"
              alt="Google"
              className="w-6 h-6 pointer-events-none select-none"
            />
            Google
          </a>
        </div>
      </div>
    </form>
  );
}
