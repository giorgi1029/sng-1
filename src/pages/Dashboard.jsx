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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // ===== FILTERS =====
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ===== FETCH CARWASHES =====
  useEffect(() => {
    fetch("https://car4wash-back.vercel.app/api/carwash")
      .then((res) => res.json())
      .then(setBusinesses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ===== FETCH PROFILE =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) return;

    const endpoint =
      role === "carwash"
        ? "https://car4wash-back.vercel.app/api/carwash/auth/me"
        : "https://car4wash-back.vercel.app/api/users/me";

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  // ===== OWNER / ADMIN CHECK =====
  const isOwnerOrAdmin = (business) => {
    if (!profile) return false;

    const ownerId =
      typeof business.owner === "object"
        ? business.owner?._id
        : business.owner;

    return (
      profile._id === ownerId ||
      profile.role === "admin"
    );
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this carwash?")) return;

    const token = localStorage.getItem("token");

    await fetch(
      `https://car4wash-back.vercel.app/api/carwash/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBusinesses((prev) =>
      prev.filter((b) => b._id !== id)
    );
  };

  // ===== FILTER LOGIC =====
  const filteredBusinesses = businesses.filter(
    (b) => {
      const matchesSearch =
        b.businessName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        b.location?.address
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesService = serviceFilter
        ? b.services?.some((s) =>
            s.name
              .toLowerCase()
              .includes(
                serviceFilter.toLowerCase()
              )
          )
        : true;

      const matchesPrice = maxPrice
        ? b.services?.some(
            (s) => Number(s.price) <= maxPrice
          )
        : true;

      return (
        matchesSearch &&
        matchesService &&
        matchesPrice
      );
    }
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="flex p-4 gap-4 h-[88vh]">
        {/* ===== MAP ===== */}
        <section className="flex-1 bg-white rounded-3xl overflow-hidden">
          <MapContainer
            center={[41.7151, 44.8271]}
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
              const coords =
                b.location?.coordinates?.coordinates;
              if (!coords) return null;

              return (
                <Marker
                  key={b._id}
                  position={[
                    coords[1],
                    coords[0],
                  ]}
                >
                  <Popup>
                    <strong>
                      {b.businessName}
                    </strong>
                    <br />
                    {b.location?.address}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </section>

   {/* ===== LIST ===== */}
<aside className="w-[420px] bg-gray-200 p-4 overflow-y-auto rounded-3xl">
  <h2 className="text-xl font-bold mb-4">
    All Carwashes
  </h2>

  {/* Filters */}
  <div className="space-y-2 mb-4">
    <input
      className="w-full p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Search by name or address"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <input
      className="w-full p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Service (e.g. Interior wash)"
      value={serviceFilter}
      onChange={(e) => setServiceFilter(e.target.value)}
    />
    <input
      className="w-full p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="number"
      placeholder="Max price"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />
  </div>

  {loading && (
    <p className="text-center text-gray-500">
      Loading carwashes...
    </p>
  )}

  {!loading && filteredBusinesses.length === 0 && (
    <p className="text-center text-gray-500">
      No carwashes found
    </p>
  )}

  {filteredBusinesses.map((b) => (
    <div
      key={b._id}
      onClick={() => navigate(`/carwash/${b._id}`)}
      className="bg-white p-4 rounded-2xl mb-4 shadow cursor-pointer
                 hover:shadow-lg hover:scale-[1.01] transition"
    >
      <h3 className="font-bold text-lg">
        {b.businessName}
      </h3>

      <p className="text-sm text-gray-600 mb-2">
        {b.location?.address}
      </p>

      {b.services?.length > 0 && (
        <p className="text-sm text-gray-500">
          Services: {b.services.length}
        </p>
      )}

      {isOwnerOrAdmin(b) && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🚫 prevent navigation
            handleDelete(b._id);
          }}
          className="mt-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
        >
          Delete
        </button>
      )}
    </div>
  ))}
</aside>

      </main>
    </div>
  );
}
  