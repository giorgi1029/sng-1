import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Cookies from 'js-cookie'
const Dashboard = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("businesses")) || [];
    setBusinesses(stored);
  }, []);

  const handleDelete = (index) => {
    const updated = businesses.filter((_, i) => i !== index);
    setBusinesses(updated);
    localStorage.setItem("businesses", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">

      <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-8 drop-shadow-sm">
        Dashboard
      </h1>

      <div className="flex flex-col gap-6">
        {businesses.length > 0 ? (
          businesses.map((b, i) => (
            <div
              key={i}
              className="
              flex items-center justify-between 
              p-6 rounded-3xl 
              bg-white/50 backdrop-blur-xl 
              border border-blue-200/40 
              shadow-lg 
              hover:shadow-2xl hover:-translate-y-1 
              transition-all duration-300"
            >
              <div className="w-full">
                <Card
                  title={b.name}
                  content={`${b.description} • ${b.service} (${b.price} ₾)`}
                />
              </div>

              <button
                onClick={() => handleDelete(i)}
                className="
                ml-6 px-5 py-2.5 
                text-white font-medium 
                bg-gradient-to-r from-red-500 via-red-600 to-red-700
                rounded-2xl shadow-md
                hover:shadow-xl hover:scale-[1.04] 
                active:scale-95
                transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-500 text-lg text-center mt-20">
            No businesses added yet — start by creating one!
          </span>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
