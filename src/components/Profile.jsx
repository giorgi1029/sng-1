import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [userType, setUserType] = useState(null); // 'customer' or 'carwash'
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try customer endpoint first
        let res = await fetch("https://car4wash-back.vercel.app/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        let data;
        if (res.ok) {
          data = await res.json();
          setUserType("customer");
          localStorage.setItem("userType", "customer");
          localStorage.setItem("role", data.role || "customer");
        } else if (res.status === 401 || !res.ok) {
          // Try carwash endpoint
          res = await fetch("https://car4wash-back.vercel.app/api/carwash/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (res.ok) {
            data = await res.json();
            setUserType("carwash");
            localStorage.setItem("userType", "carwash");
            // carwash may not have 'role', but you can set 'owner'
          } else {
            throw new Error("Profile fetch failed on both endpoints");
          }
        }

        setProfile(data);
        // Set initial form data
        if (userType === "customer") {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        } else if (userType === "carwash") {
          setFormData({
            businessName: data.businessName || "",
            ownerName: data.ownerName || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        localStorage.removeItem("role");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
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
        const errData = await res.json();
        throw new Error(errData.message || "Update failed");
      }

      const data = await res.json();
      setProfile(userType === "carwash" ? data.carwash : data.user);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const base = "https://car4wash-back.vercel.app/api";

    const logoutEndpoint =
      userType === "carwash"
        ? `${base}/carwash/auth/logout`   // add this route if needed
        : `${base}/users/logout`;

    if (token) {
      try {
        await fetch(logoutEndpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("Logout request failed:", err);
      }
    }

    localStorage.clear(); // safe & simple
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

  if (!profile) {
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
                    value={formData.businessName}
                    onChange={(v) => setFormData({ ...formData, businessName: v })}
                  />
                  <InputField
                    label="Owner Name"
                    value={formData.ownerName}
                    onChange={(v) => setFormData({ ...formData, ownerName: v })}
                  />
                </>
              ) : (
                <InputField
                  label="Full Name"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
              )}

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

              {/* Optional: add password change field */}
              {/* <InputField label="New Password (optional)" type="password" ... /> */}

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
                  <Info label="Role" value={profile.role} />
                </>
              )}

              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone || "—"} />
              <Info label="ID" value={profile.id || profile._id} />

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

// Reuse your Info & InputField components
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