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

// ================= LEAFLET ICON FIX =================
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

  // ===== FILTER STATE =====
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchCarwashes = async () => {
      try {
        const res = await fetch(
          "https://car4wash-back.vercel.app/api/carwash"
        );
        const data = await res.json();
        setBusinesses(data);
      } catch (err) {
        console.error("Failed to fetch carwashes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarwashes();

    const userData = JSON.parse(localStorage.getItem("userData"));
    setProfile(userData);
  }, []);

  // ================= FILTER LOGIC =================
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.businessName.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.address
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesService = serviceFilter
      ? b.services?.some((s) =>
          s.name.toLowerCase().includes(serviceFilter.toLowerCase())
        )
      : true;

    const matchesPrice = maxPrice
      ? b.services?.some((s) => Number(s.price) <= Number(maxPrice))
      : true;

    return matchesSearch && matchesService && matchesPrice;
  });

  // ================= DELETE CARWASH =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this carwash?")) return;

    try {
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
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex flex-1 p-4 gap-4 h-[88vh]">
        {/* ================= MAP ================= */}
        <section className="flex-1 bg-white rounded-3xl overflow-hidden">
          <MapContainer
            center={[41.7151, 44.8271]}
            zoom={12}
            scrollWheelZoom
            style={{ width: "100%", height: "100%" }}
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
                  position={[coords[1], coords[0]]}
                >
                  <Popup>
                    <strong>{b.businessName}</strong>
                    <br />
                    {b.location?.address ||
                      "No address provided"}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </section>

        {/* ================= BUSINESS LIST ================= */}
        <aside className="w-110 bg-gray-200 p-4 overflow-y-auto rounded-3xl">
          <h2 className="text-xl font-bold mb-4">
            All Carwashes
          </h2>

          {/* ================= FILTER UI ================= */}
          <div className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Search name or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 rounded-xl border border-gray-300"
            />

            <input
              type="text"
              placeholder="Filter by service"
              value={serviceFilter}
              onChange={(e) =>
                setServiceFilter(e.target.value)
              }
              className="w-full p-2 rounded-xl border border-gray-300"
            />

            <input
              type="number"
              placeholder="Max price (₾)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 rounded-xl border border-gray-300"
            />
          </div>

          {loading && (
            <p className="text-gray-500">
              Loading carwashes...
            </p>
          )}

          {!loading &&
            filteredBusinesses.length === 0 && (
              <p className="text-gray-500">
                No matching carwashes found.
              </p>
            )}

          {filteredBusinesses.map((b) => (
            <div
              key={b._id}
              className="mb-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-lg">
                  {b.businessName}
                </h3>

                <p className="text-sm text-gray-600">
                  {b.location?.address ||
                    "No address provided"}
                </p>

                <div className="mt-2">
                  <p className="text-sm font-semibold">
                    Services:
                  </p>
                  <ul className="text-sm text-gray-700">
                    {b.services?.map((s, idx) => (
                      <li key={idx}>
                        • {s.name} — ₾{s.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  ⏰ {b.workingHours?.open} –{" "}
                  {b.workingHours?.close}
                </div>
              </div>

              {(profile?._id === b.owner ||
                profile?.role === "admin") && (
                <button
                  onClick={() =>
                    handleDelete(b._id)
                  }
                  className="ml-4 mt-1 px-2 py-1 rounded-xl bg-red-100 text-red-600 text-sm hover:bg-red-200 transition"
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
