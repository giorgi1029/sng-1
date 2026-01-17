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

/* ===== LEAFLET ICON FIX ===== */
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

  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  /* ===== HANDLE GOOGLE OAUTH TOKEN ===== */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    }
  }, [location.search, navigate]);

  /* ===== FETCH CARWASHES ===== */
  useEffect(() => {
    fetch("https://car4wash-back.vercel.app/api/carwash")
      .then((res) => res.json())
      .then(setBusinesses)
      .finally(() => setMapLoading(false));
  }, []);

  /* ===== FETCH PROFILE ===== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    fetch("https://car4wash-back.vercel.app/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  /* ===== FILTER ===== */
  const filteredBusinesses = businesses.filter((b) => {
    const matchSearch =
      b.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.address?.toLowerCase().includes(search.toLowerCase());

    const matchService = serviceFilter
      ? b.services?.some((s) =>
          s.name?.toLowerCase().includes(serviceFilter.toLowerCase())
        )
      : true;

    const matchPrice = maxPrice
      ? b.services?.some((s) => Number(s.price) <= Number(maxPrice))
      : true;

    return matchSearch && matchService && matchPrice;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="flex flex-col md:flex-row gap-4 p-3 md:p-4 h-[calc(100vh-72px)]">

        {/* ===== MAP ===== */}
        <section className="w-full md:flex-1 h-[55vh] md:h-auto bg-white rounded-3xl overflow-hidden relative">
          {mapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <p className="text-gray-500">Loading map...</p>
            </div>
          )}

          <MapContainer
            center={[41.7151, 44.8271]}
            zoom={12}
            className="h-full w-full"
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
              const c = b.location?.coordinates?.coordinates;
              if (!c) return null;

              return (
                <Marker key={b._id} position={[c[1], c[0]]}>
                  <Popup>
                    <strong>{b.businessName}</strong>
                    <br />
                    {b.location?.address}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </section>

        {/* ===== LIST / BOTTOM SHEET ===== */}
        <aside
          className="
            w-full md:w-[420px]
            max-h-[45vh] md:max-h-full
            bg-white/80 backdrop-blur-xl
            rounded-3xl shadow-xl
            border border-white/60
            p-4 md:p-5
            overflow-y-auto
          "
        >
          {/* Mobile drag handle */}
          <div className="md:hidden flex justify-center mb-3">
            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
          </div>

          <h2 className="text-2xl font-bold text-indigo-700 mb-5">
            Nearby Carwashes
          </h2>

          {/* Filters */}
          <div className="space-y-3 mb-6">
            <input
              className="w-full p-3 rounded-2xl border border-indigo-100 focus:ring-2 focus:ring-indigo-400"
              placeholder="Search by name or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              className="w-full p-3 rounded-2xl border border-indigo-100 focus:ring-2 focus:ring-indigo-400"
              placeholder="Service (e.g. Interior)"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            />

            <input
              type="number"
              className="w-full p-3 rounded-2xl border border-indigo-100 focus:ring-2 focus:ring-indigo-400"
              placeholder="Max price (GEL)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {!loading && filteredBusinesses.length === 0 && (
            <p className="text-center text-gray-400">
              No carwashes found
            </p>
          )}

          <div className="space-y-4">
            {filteredBusinesses.map((b) => (
              <div
                key={b._id}
                onClick={() => navigate(`/carwash/${b._id}`)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-50 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  {b.businessName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {b.location?.address}
                </p>

                {b.services?.length > 0 && (
                  <span className="inline-block mt-3 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                    {b.services.length} services
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
