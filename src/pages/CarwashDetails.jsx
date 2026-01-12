import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function CarwashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carwash, setCarwash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://car4wash-back.vercel.app/api/carwash/${id}`)
      .then((res) => res.json())
      .then(setCarwash)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!carwash) {
    return <p className="p-6">Carwash not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto p-6">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium transition"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl p-6 shadow">
          <h1 className="text-2xl font-bold mb-2">
            {carwash.businessName}
          </h1>

          <p className="text-gray-600 mb-6">
            {carwash.location?.address}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            Services & Prices
          </h2>

          <div className="space-y-3">
            {carwash.services?.map((service) => (
              <div
                key={service._id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-2xl"
              >
                <span className="font-medium">
                  {service.name}
                </span>
                <span className="font-bold">
                  {service.price} ₾
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
