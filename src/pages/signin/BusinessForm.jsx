import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function BusinessForm() {
  const navigate = useNavigate();

  const [services, setServices] = useState([{ name: "", price: "" }]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    lat: null,
    lng: null,
    email: "",
    password: "",
    workingHours: "",
  });
  const [openMap, setOpenMap] = useState(false);

  const handleAddService = () => {
    setServices([...services, { name: "", price: "" }]);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function LocationSelector() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setForm({
          ...form,
          location: `Selected: (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          lat,
          lng,
        });
        setOpenMap(false);
      },
    });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.lat || !form.lng) {
      alert("Please select a location on the map.");
      return;
    }
const payload = {
  businessName: form.name,
  ownerName: form.name,
  email: form.email,
  password: form.password,

  location: {
    address: form.location,
    coordinates: {
      type: "Point",
      coordinates: [form.lng, form.lat], // correct order
    },
  },

  services: services.map((s) => ({
    name: s.name,
    price: Number(s.price),
  })),

  workingHours: {
    open: form.open,
    close: form.close,
  },
};



    try {
    const res = await fetch(
  "https://car4wash-back.vercel.app/api/carwash/auth/register",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }
);

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // save carwash to localStorage for dashboard
      // save carwash to localStorage
// save carwash to localStorage
const stored = JSON.parse(localStorage.getItem("businesses")) || [];
stored.push(payload); // ← store payload directly
localStorage.setItem("businesses", JSON.stringify(stored));



      alert("Carwash registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }


  };

  return (
    <>
      {/* MAP MODAL */}
      {openMap && (<div className="fixed inset-0 flex items-center justify-center z-50"> <div className="relative w-[90%] h-[50vh] rounded-xl overflow-hidden shadow-xl">
        {/* Close Button */}
        <button
          onClick={() => setOpenMap(false)}
          className="absolute top-3 right-3 z-[1000] bg-white/80 hover:bg-white text-red-600 font-bold text-xl
w-10 h-10 flex items-center justify-center rounded-full shadow-md backdrop-blur-md transition"
        >
          ✕ </button>

        {/* MAP */}
        <MapContainer
          center={[41.7151, 44.8271]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector />
          {form.lat && form.lng && <Marker position={[form.lat, form.lng]} />}
        </MapContainer>
      </div>
      </div>
      )}

      {/* FORM */}
      <form className="space-y-3 max-w-md mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Carwash Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-blue-200 rounded-xl bg-white"
          required
        />

        {/* Click to open map */}
        <input
          type="text"
          name="location"
          placeholder="Click to select location"
          value={form.location}
          readOnly
          onClick={() => setOpenMap(true)}
          className="w-full p-3 border border-blue-200 rounded-xl bg-white cursor-pointer"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Business Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-blue-200 rounded-xl bg-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-blue-200 rounded-xl bg-white"
          required
        />
<div className="flex gap-3">
  <input
    type="time"
    value={form.open}
    onChange={(e) => setForm({ ...form, open: e.target.value })}
    className="w-1/2 p-3 border border-blue-200 rounded-xl bg-white"
    required
  />

  <input
    type="time"
    value={form.close}
    onChange={(e) => setForm({ ...form, close: e.target.value })}
    className="w-1/2 p-3 border border-blue-200 rounded-xl bg-white"
    required
  />
</div>


        {/* Services */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Services You Offer
          </label>

          {services.map((service, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder={`Service ${index + 1}`}
                value={service.name}
                onChange={(e) =>
                  handleServiceChange(index, "name", e.target.value)
                }
                className="w-2/3 p-3 border border-blue-200 rounded-xl bg-white"
                required
              />
              <input
                type="number"
                placeholder="₾ Price"
                value={service.price}
                onChange={(e) =>
                  handleServiceChange(index, "price", e.target.value)
                }
                className="w-1/3 p-3 border border-blue-200 rounded-xl bg-white"
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddService}
            className="w-full py-2 border border-blue-400 text-blue-600 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
          >
            + Add Another Service
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Register Carwash
        </button>
      </form>
    </>

  );
}
