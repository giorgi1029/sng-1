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

// Fix Leaflet marker icons
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

  useEffect(() => {
    const storedBusinesses =
      JSON.parse(localStorage.getItem("businesses")) || [];
    setBusinesses(storedBusinesses);

    const userData = JSON.parse(localStorage.getItem("userData"));
    setProfile(userData);
  }, []);

  // DELETE a business
  const handleDelete = (index) => {
    const updated = businesses.filter((_, i) => i !== index);
    setBusinesses(updated);
    localStorage.setItem("businesses", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen">
      <Header/>
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

            {businesses.map((b, i) => {
              const coords = b.location?.coordinates?.coordinates;
              if (!coords) return null;

              return (
                <Marker
                  key={i}
                  position={[coords[1], coords[0]]} // lat, lng
                >
                  <Popup>
                    <strong>{b.businessName}</strong>
                    <br />
                    {b.location?.address || "No address provided"}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </section>

        {/* ================= BUSINESS LIST ================= */}
        <aside className="w-110 bg-gray-200 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            My Businesses
          </h2>

          {businesses.length === 0 && (
            <p className="text-gray-500">
              No businesses registered yet.
            </p>
          )}

          {businesses.map((b, i) => (
            <div
              key={i}
              className="mb-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-lg">{b.businessName}</h3>

                <p className="text-sm text-gray-600">
                  {b.location?.address || "No address provided"}
                </p>

                <div className="mt-2">
                  <p className="text-sm font-semibold">Services:</p>
                  <ul className="text-sm text-gray-700">
                    {b.services?.map((s, idx) => (
                      <li key={idx}>
                        • {s.name} — ₾{s.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  ⏰ {b.workingHours?.open} – {b.workingHours?.close}
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(i)}
                className="ml-4 mt-1 px-2 py-1 rounded-xl bg-red-100 text-red-600 text-sm hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}
