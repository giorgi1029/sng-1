import React, { useEffect, useState } from "react";
import Card from "../components/Card";

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
    <div className="flex flex-col gap-4 p-6">
      {businesses.length > 0 ? (
        businesses.map((b, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow">
            <Card
              title={b.name}
              content={`${b.description} • ${b.service} (${b.price} ₾)`}
            />
            <button
              onClick={() => handleDelete(i)}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <span className="text-gray-500 text-sm">No businesses yet — add one!</span>
      )}
    </div>
  );
};

export default Dashboard;
