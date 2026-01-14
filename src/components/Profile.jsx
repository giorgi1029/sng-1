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
      console.log("[PROFILE DEBUG] Token from localStorage:", token ? `${token.substring(0, 20)}...` : "MISSING");

      if (!token) {
        console.log("[PROFILE DEBUG] No token found → showing not logged in");
        setLoading(false);
        return;
      }

      try {
        setError(null);

        // Common headers with Bearer token
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        console.log("[PROFILE DEBUG] Sending request with headers:", headers);

        // 1. Try customer endpoint first
        let res = await fetch("https://car4wash-back.vercel.app/api/users/me", {
          method: "GET",
          headers,
        });

        console.log("[PROFILE DEBUG] /users/me status:", res.status);

        let data;
        let detectedType = null;

        if (res.ok) {
          data = await res.json();
          detectedType = "customer";
          console.log("[PROFILE DEBUG] Customer profile loaded:", data);
        } else {
          // 2. Try carwash endpoint
          console.log("[PROFILE DEBUG] /users/me failed → trying carwash endpoint");

          res = await fetch("https://car4wash-back.vercel.app/api/carwash/auth/me", {
            method: "GET",
            headers,
          });

          console.log("[PROFILE DEBUG] /carwash/auth/me status:", res.status);

          if (res.ok) {
            data = await res.json();
            detectedType = "carwash";
            console.log("[PROFILE DEBUG] Carwash profile loaded:", data);
          } else {
            if (res.status === 401) {
              console.log("[PROFILE DEBUG] 401 → clearing token and redirecting");
              localStorage.removeItem("token");
              localStorage.removeItem("userType");
              navigate("/login");
              return;
            }
            const errorText = await res.text();
            throw new Error(`Both endpoints failed: ${res.status} - ${errorText}`);
          }
        }

        // Normalize profile (handle both flat and { carwash: {...} } shapes)
        const normalizedProfile = detectedType === "carwash" && data.carwash ? data.carwash : data;

        setUserType(detectedType);
        localStorage.setItem("userType", detectedType);
        setProfile(normalizedProfile);

        // Set initial form data based on type
        if (detectedType === "customer") {
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
        console.error("[PROFILE DEBUG] Fetch error:", err.message);
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
      const updated = userType === "carwash" && data.carwash ? data.carwash : data;
      setProfile(updated);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  const handleLogout = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-700 text-lg font-medium">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-xl">You are not logged in.</p>
      </div>
    );
  }

  const isCarwash = userType === "carwash";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            {isCarwash ? "Business Profile" : "User Profile"}
          </h1>

          {editing ? (
            <div className="space-y-6">
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

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleUpdate}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isCarwash ? (
                <>
                  <Info label="Business Name" value={profile.businessName} />
                  <Info label="Owner Name" value={profile.ownerName} />
                </>
              ) : (
                <>
                  <Info label="Full Name" value={profile.name} />
                  <Info label="Role" value={profile.role || "Customer"} />
                </>
              )}

              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone || "Not provided"} />
              <Info label="ID" value={profile._id || profile.id} />

              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setEditing(true)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
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
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="mt-1 text-gray-900 font-semibold">{value || "—"}</p>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}