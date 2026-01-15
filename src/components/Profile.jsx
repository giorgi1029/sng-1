import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const storedType = localStorage.getItem("userType");

      console.log("[PROFILE] Token:", token ? token.substring(0, 35) + "..." : "MISSING");
      console.log("[PROFILE] Stored userType:", storedType || "not set");

      if (!token) {
        setLoading(false);
        return;
      }

      let endpoint = "https://car4wash-back.vercel.app/api/users/me";
      if (storedType === "carwash") {
        endpoint = "https://car4wash-back.vercel.app/api/carwash/auth/me";
      }

      try {
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log(`[PROFILE] ${endpoint.split("/").pop()} → ${res.status}`);

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            console.log("[PROFILE] 401/403 → clearing session");
            localStorage.removeItem("token");
            localStorage.removeItem("userType");
            navigate("/login", { replace: true });
            return;
          }

          // Fallback if we tried users/me
          if (storedType !== "carwash") {
            console.log("[PROFILE] users/me failed → trying carwash/me");
            const fallbackRes = await fetch(
              "https://car4wash-back.vercel.app/api/carwash/auth/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );

            console.log("[PROFILE] carwash/me fallback →", fallbackRes.status);

            if (fallbackRes.ok) {
              const data = await fallbackRes.json();
              const normalized = data.carwash || data;
              finishProfile("carwash", normalized);
              return;
            }
          }

          const errText = await res.text();
          throw new Error(`Profile load failed: ${res.status} - ${errText}`);
        }

        const data = await res.json();
        const detected = storedType || (data.businessName ? "carwash" : "customer");
        const normalized = detected === "carwash" && data.carwash ? data.carwash : data;

        finishProfile(detected, normalized);
      } catch (err) {
        console.error("[PROFILE] Error:", err.message);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const finishProfile = (type, prof) => {
      setUserType(type);
      localStorage.setItem("userType", type);
      setProfile(prof);
      setUploadedImages(Array.isArray(prof?.images) ? prof.images : []);
      
      if (type === "customer") {
        setFormData({
          name: prof.name || "",
          email: prof.email || "",
          phone: prof.phone || "",
        });
      } else {
        setFormData({
          businessName: prof.businessName || "",
          ownerName: prof.ownerName || "",
          email: prof.email || "",
          phone: prof.phone || "",
        });
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userType) return navigate("/login");

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

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
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

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(
        "https://car4wash-back.vercel.app/api/carwash/auth/upload-images",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setUploadedImages(Array.isArray(data.images) ? data.images : []);
      alert("Photos uploaded successfully!");
    } catch (err) {
      console.error("[UPLOAD ERROR]", err);
      alert(err.message || "Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (url) => {
    if (!window.confirm("Delete this photo?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const res = await fetch(
        "https://car4wash-back.vercel.app/api/carwash/auth/delete-image",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageUrl: url }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Delete failed");
      }

      const data = await res.json();
      setUploadedImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      console.error("[DELETE ERROR]", err);
      alert(err.message || "Could not delete photo");
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

              {isCarwash && (
                <div className="mt-10 border-t pt-8">
                  <h2 className="text-xl font-semibold mb-4">Service Photos</h2>

                  <div className="mb-6">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {uploading && (
                      <p className="text-blue-600 mt-2 text-sm">Uploading photos...</p>
                    )}
                  </div>

                  {uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {uploadedImages.map((url, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={url}
                            alt={`Service photo ${i + 1}`}
                            className="w-full h-40 object-cover rounded-xl shadow-sm transition-transform group-hover:scale-[1.02]"
                          />
                          <button
                            onClick={() => handleDeleteImage(url)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8 italic">
                      No photos uploaded yet
                    </p>
                  )}
                </div>
              )}

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