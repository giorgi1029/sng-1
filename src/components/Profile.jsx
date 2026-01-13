import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const res = await fetch("https://car4wash-back.vercel.app/api/users/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (res.status === 401) {
          // Token invalid/expired → clear it and treat as logged out
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update your profile");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("https://car4wash-back.vercel.app/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Update failed");
      }

      const data = await res.json();
      setUser(data.user);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    // Optional: call backend logout (mostly for symmetry / future blacklisting)
    if (token) {
      try {
        await fetch("https://car4wash-back.vercel.app/api/users/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn("Logout request failed:", err);
        // continue anyway — we still clear local token
      }
    }

    localStorage.removeItem("token");
    // localStorage.removeItem("user"); // if you stored it

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <p className="mt-4 text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>

          {editing ? (
            <div className="space-y-4">
              <InputField
                label="Full Name"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              <InputField
                label="Email"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
              />
              <InputField
                label="Phone"
                value={formData.phone}
                onChange={(v) => setFormData({ ...formData, phone: v })}
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Info label="Full Name" value={user.name} />
              <Info label="Email" value={user.email} />
              <Info label="Phone" value={user.phone || "—"} />
              <Info label="Role" value={user.role} />
              <Info label="User ID" value={user._id} />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
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
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold text-gray-700">{value || "—"}</p>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <input
        className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}