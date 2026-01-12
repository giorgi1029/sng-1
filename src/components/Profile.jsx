import React, { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetch("https://car4wash-back.vercel.app/api/users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFormData({ name: data.name, email: data.email, phone: data.phone });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async () => {
    const res = await fetch(
      "https://car4wash-back.vercel.app/api/users/update",
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setEditing(false);
      alert("Profile updated!");
    } else {
      alert("Update failed");
    }
  };

  const handleLogout = async () => {
    await fetch("https://car4wash-back.vercel.app/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>

          {editing ? (
            <div className="space-y-4">
              <InputField label="Full Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
              <InputField label="Email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
              <InputField label="Phone" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
              <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          ) : (
            <div className="space-y-4">
              <Info label="Full Name" value={user.name} />
              <Info label="Email" value={user.email} />
              <Info label="Phone" value={user.phone || "—"} />
              <Info label="Role" value={user.role} />
              <Info label="User ID" value={user._id} />

              <button onClick={() => setEditing(true)} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Edit Profile</button>
              <button onClick={handleLogout} className="mt-2 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Logout</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value || "—"}</p>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <input
        className="w-full border px-3 py-2 rounded mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}


