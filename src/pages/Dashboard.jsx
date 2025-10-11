import React from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import { useBusiness } from "../context/BusinessContext";

export default function Dashboard() {
  const { businesses } = useBusiness();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row">
        <main className="flex-1 p-6 bg-gray-100 flex items-center justify-center min-h-[400px] md:min-h-0">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Map Placeholder</span>
          </div>
        </main>

        <aside className="w-full md:w-[500px] bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-4 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Samrecxaoebi</h2>
          </div>

          <div className="flex flex-col gap-4">
            {businesses.length > 0 ? (
              businesses.map((b, i) => (
                <Card
                  key={i}
                  title={b.name}
                  content={`${b.description} • ${b.service} (${b.price} ₾)`}
                />
              ))
            ) : (
              <span className="text-gray-500 text-sm">
                No businesses yet — add one!
              </span>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
