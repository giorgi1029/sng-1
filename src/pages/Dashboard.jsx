import React from "react";
import Header from "../components/Header";
import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Map / Main Section */}
        <main className="flex-1 p-6 bg-gray-100 flex items-center justify-center min-h-[400px] md:min-h-0">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Map Placeholder</span>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-full md:w-[500px] bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-4 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Samrecxaoebi</h2>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-4">
            <Card title="Card 1" content="Details about Card 1" />
            <Card title="Card 2" content="Details about Card 2" />
            <Card title="Card 3" content="Details about Card 3" />
            <Card title="Card 4" content="Details about Card 4" />
            <Card title="Card 5" content="Details about Card 5" />
          </div>
        </aside>
      </div>
    </div>
  );
}
