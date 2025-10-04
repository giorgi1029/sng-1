import React from "react";

export default function Card({ title, content }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {content && <p className="text-gray-600 mt-1">{content}</p>}
    </div>
  );
}
