import React, { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://car4wash-back.vercel.app/api/users/me", {
      credentials: "include", // 🔥 VERY IMPORTANT
    })        
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          You are not logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">
            Profile
          </h1>

          <div className="space-y-4">
            <Info label="Full Name" value={user.name} />
            <Info label="Email" value={user.email} />
            <Info label="Role" value={user.role} />
            <Info label="User ID" value={user._id} />
          </div>

          {/* <button
            onClick={async () => {
              await fetch(
                "https://car4wash-back.vercel.app/api/auth/logout",
                {
                  method: "POST",
                  credentials: "include",
                }
              );
              window.location.href = "/login";
            }}
            className="mt-8 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button> */}
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="font-semibold">
        {value || "—"}
      </p>
    </div>
  );
}
