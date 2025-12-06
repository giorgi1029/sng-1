import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Cookies from "js-cookie";

import {
MapContainer,
TileLayer,
Marker,
Popup,
LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
iconUrl:
"[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png)",
iconRetinaUrl:
"[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png)",
shadowUrl:
"[https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png](https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png)",
});

const Dashboard = () => {
const [businesses, setBusinesses] = useState([]);
const [profile, setProfile] = useState(null);

useEffect(() => {
const stored = JSON.parse(localStorage.getItem("businesses")) || [];
setBusinesses(stored);


const userData = JSON.parse(localStorage.getItem("userData"));
setProfile(userData);


}, []);

const handleDelete = (index) => {
const updated = businesses.filter((_, i) => i !== index);
setBusinesses(updated);
localStorage.setItem("businesses", JSON.stringify(updated));
};

return ( <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
{/* HEADER */} <div className="flex items-center justify-between"> <div> <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm">
Dashboard </h1>
{profile && ( <p className="text-lg text-gray-700 mt-1">
Welcome, <span className="font-semibold">{profile.name}</span> </p>
)} </div>

```
    {/* PROFILE CIRCLE */}
    <div className="relative">
      <img
        src={
          profile?.image ||
          "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        }
        alt="profile"
        className="w-10 h-10 rounded-full shadow-md cursor-pointer hover:scale-105 transition-all"
      />
    </div>
  </div>

  {/* BUSINESS LIST */}
  <div className="flex flex-col gap-6 mt-8">
    {businesses.length > 0 ? (
      businesses.map((b, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-6 rounded-3xl bg-white/50 backdrop-blur-xl border border-blue-200/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-full">
            <Card
              title={b.name}
              content={`${b.description} • ${b.service} (${b.price} ₾)`}
            />
          </div>

          <button
            onClick={() => handleDelete(i)}
            className="ml-6 px-5 py-2.5 text-white font-medium bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.04] active:scale-95 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      ))
    ) : (
      console.log("oi")
    )}
  </div>

  <div className="mt-12 w-300 h-[82vh]">
    <div className="w-full h-[82vh] overflow-hidden border border-blue-200/50 bg-white/60 rounded-3xl">
      <MapContainer
        center={[41.7151, 44.8271]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Google-style">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Topographic">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Markers for every business */}
        {businesses.map(
          (b, i) =>
            b.lat &&
            b.lng && (
              <Marker key={i} position={[b.lat, b.lng]}>
                <Popup>
                  <strong>{b.name}</strong> <br />
                  {b.description}
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  </div>
</div>


);
};

export default Dashboard;
