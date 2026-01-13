import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [userType, setUserType] = useState(null); // "customer" | "carwash" | null
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError(null);

        // 1. Try customer endpoint
        let res = await fetch("https://car4wash-back.vercel.app/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        let data;
        let type = null;

        if (res.ok) {
          data = await res.json();
          type = "customer";
        } else {
          // 2. Try carwash endpoint
          res = await fetch("https://car4wash-back.vercel.app/api/carwash/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (res.ok) {
            data = await res.json();
            type = "carwash";
          } else {
            if (res.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("userType");
              navigate("/login");
              return;
            }
            throw new Error(`Profile fetch failed: ${res.status} ${res.statusText}`);
          }
        }

        // Now we have data & type
        setUserType(type);
        localStorage.setItem("userType", type);

        // Normalize profile (unwrap carwash nested object)
        const normalizedProfile = type === "carwash" ? data.carwash : data;
        setProfile(normalizedProfile);

        // Set form data
        if (type === "customer") {
          setFormData({
            name: normalizedProfile.name || "",
            email: normalizedProfile.email || "",
            phone: normalizedProfile.phone || "",
          });
        } else {
          setFormData({
            businessName: normalizedProfile.businessName || "",
            ownerName: normalizedProfile.ownerName || "",
            email: normalizedProfile.email || "",
            phone: normalizedProfile.phone || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Failed to load profile");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userType) {
      alert("Session invalid. Please log in again.");
      navigate("/login");
      return;
    }

    const endpoint =
      userType === "carwash"
        ? "https://car4wash-back.vercel.app/api/carwash/auth/update"
        : "https://car4wash-back.vercel.app/api/users/update";

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Update failed");
      }

      const data = await res.json();
      const updated = userType === "carwash" ? data.carwash : data.user;
      setProfile(updated);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  const handleLogout = async () => {
    localStorage.clear();
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!profile || !userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">You are not logged in.</p>
      </div>
    );
  }

  const isCarwash = userType === "carwash";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {isCarwash ? "Business Profile" : "User Profile"}
          </h1>

          {editing ? (
            <div className="space-y-4">
              {isCarwash ? (
                <>
                  <InputField
                    label="Business Name"
                    value={formData.businessName || ""}
                    onChange={(v) => setFormData({ ...formData, businessName: v })}
                  />
                  <InputField
                    label="Owner Name"
                    value={formData.ownerName || ""}
                    onChange={(v) => setFormData({ ...formData, ownerName: v })}
                  />
                </>
              ) : (
                <InputField
                  label="Full Name"
                  value={formData.name || ""}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
              )}

              <InputField
                label="Email"
                value={formData.email || ""}
                onChange={(v) => setFormData({ ...formData, email: v })}
              />
              <InputField
                label="Phone"
                value={formData.phone || ""}
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
              {isCarwash ? (
                <>
                  <Info label="Business Name" value={profile.businessName} />
                  <Info label="Owner Name" value={profile.ownerName} />
                </>
              ) : (
                <>
                  <Info label="Full Name" value={profile.name} />
                  <Info label="Role" value={profile.role || "customer"} />
                </>
              )}

              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone || "—"} />
              <Info label="ID" value={profile._id || profile.id} />

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