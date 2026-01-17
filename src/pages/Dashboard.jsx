import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";

// ===== LEAFLET ICON FIX =====
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function Dashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // ← added for query params

  // ===== FILTERS =====
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ===== HANDLE GOOGLE OAUTH REDIRECT + TOKEN STORAGE =====
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);

      // Optional: if you passed name/email in query (as suggested earlier)
      const name = params.get("name");
      const email = params.get("email");
      if (name || email) {
        localStorage.setItem(
          "tempUser",
          JSON.stringify({
            name: decodeURIComponent(name || ""),
            email: decodeURIComponent(email || ""),
          })
        );
      }

      // Clean URL – remove ?token=... etc.
      navigate("/dashboard", { replace: true });
    }
  }, [location.search, navigate]);

  // ===== FETCH CARWASHES (PUBLIC) =====
  useEffect(() => {
    fetch("https://car4wash-back.vercel.app/api/carwash")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load carwashes");
        return res.json();
      })
      .then(setBusinesses)
      .catch((err) => console.error("Carwashes fetch error:", err))
      .finally(() => setMapLoading(false));
  }, []);

  // ===== FETCH PROFILE (AUTHENTICATED) =====
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try user endpoint first
        let res = await fetch("https://car4wash-back.vercel.app/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || !res.ok) {
          // If 401, try carwash endpoint
          res = await fetch("https://car4wash-back.vercel.app/api/carwash/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error("Profile fetch failed");
        }

        const data = await res.json();
        setProfile(data);

        // Persist role for future quick checks
        localStorage.setItem("role", data.role || "customer");
      } catch (err) {
        console.error("Profile fetch error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ===== OWNER / ADMIN CHECK =====
  const isOwnerOrAdmin = (business) => {
    if (!profile) return false;

    const ownerId =
      typeof business.owner === "object" ? business.owner?._id : business.owner;

    return profile._id === ownerId || profile.role === "admin";
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this carwash?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `https://car4wash-back.vercel.app/api/carwash/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setBusinesses((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete carwash");
    }
  };

  // ===== FILTER LOGIC =====
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.address?.toLowerCase().includes(search.toLowerCase());

    const matchesService = serviceFilter
      ? b.services?.some((s) =>
          s.name?.toLowerCase().includes(serviceFilter.toLowerCase())
        )
      : true;

    const matchesPrice = maxPrice
      ? b.services?.some((s) => Number(s.price) <= Number(maxPrice))
      : true;

    return matchesSearch && matchesService && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="flex p-4 gap-4 h-[88vh]">
        {/* ===== MAP ===== */}
        <section className="flex-1 bg-white rounded-3xl overflow-hidden relative">
          {mapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/70 z-10">
              <p className="text-gray-600">Loading map...</p>
            </div>
          )}

          <MapContainer
            center={[41.7151, 44.8271]} // Tbilisi coords
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Default">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Satellite">
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              </LayersControl.BaseLayer>
            </LayersControl>

            {filteredBusinesses.map((b) => {
              const coords = b.location?.coordinates?.coordinates;
              if (!coords || !Array.isArray(coords) || coords.length < 2) return null;

              return (
                <Marker
                  key={b._id}
                  position={[coords[1], coords[0]]} // [lat, lng]
                >
                  <Popup>
                    <strong>{b.businessName}</strong>
                    <br />
                    {b.location?.address || "No address"}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </section>

        {/* ===== LIST ===== */}
      <aside className="w-[420px] max-h-[90vh] backdrop-blur-xl bg-white/70 p-5 overflow-y-auto rounded-3xl shadow-xl border border-white/60">

  <h2 className="text-2xl font-bold mb-6 text-indigo-700">
    Nearby Carwashes
  </h2>

  {/* Filters */}
  <div className="space-y-4 mb-8">
    <input
      className="w-full p-3 rounded-2xl bg-white border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
      placeholder="Search by name or address"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <input
      className="w-full p-3 rounded-2xl bg-white border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
      placeholder="Service (e.g. Interior wash)"
      value={serviceFilter}
      onChange={(e) => setServiceFilter(e.target.value)}
    />

    <input
      className="w-full p-3 rounded-2xl bg-white border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
      type="number"
      placeholder="Max price (GEL)"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />
  </div>

  {loading && (
    <p className="text-center text-gray-400 text-sm">
      Loading carwashes...
    </p>
  )}

  {!loading && filteredBusinesses.length === 0 && (
    <p className="text-center text-gray-400 text-sm">
      No carwashes found
    </p>
  )}

  {/* CARWASH LIST */}
  <div className="space-y-4">
    {filteredBusinesses.map((b) => (
      <div
        key={b._id}
        onClick={() => navigate(`/carwash/${b._id}`)}
        className="group bg-white rounded-2xl p-4 shadow-sm border border-indigo-50 cursor-pointer hover:shadow-lg hover:-translate-y-[2px] transition-all"
      >
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition">
          {b.businessName}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {b.location?.address || "No address"}
        </p>

        {b.services?.length > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            {b.services.length} services available
          </div>
        )}
      </div>
    ))}
  </div>
</aside>

      </main>
    </div>
  );
}