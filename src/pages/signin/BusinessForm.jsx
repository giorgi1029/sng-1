import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

export default function BusinessForm() {
  const navigate = useNavigate();

  const [services, setServices] = useState([{ name: "", price: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    location: "",
    lat: null,
    lng: null,
    email: "",
    password: "",
    open: "",
    close: "",
  });

  const [openMap, setOpenMap] = useState(false);

  // ================= SERVICES =================
  const handleAddService = () => {
    setServices([...services, { name: "", price: "" }]);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleRemoveService = (index) => {
    if (services.length === 1) return;
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  // ================= MAP CLICK =================
  function LocationSelector() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          setForm((prev) => ({
            ...prev,
            location: data.display_name || "Unknown address",
            lat,
            lng,
          }));

          setOpenMap(false);
        } catch (err) {
          alert("Failed to get address");
        }
      },
    });

    return null;
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.lat || !form.lng) {
      setFormError("Please select a location on the map.");
      return;
    }

    if (!form.businessName.trim() || !form.ownerName.trim()) {
      setFormError("Business name and owner name are required.");
      return;
    }

    const validServices = services.filter(
      (s) => s.name.trim() !== "" && !isNaN(Number(s.price)) && Number(s.price) > 0
    );

    if (validServices.length === 0) {
      setFormError("Please add at least one valid service.");
      return;
    }

    const payload = {
      businessName: form.businessName.trim(),
      ownerName: form.ownerName.trim(),
      email: form.email.trim(),
      password: form.password,
      location: {
        address: form.location.trim(),
        coordinates: {
          type: "Point",
          coordinates: [form.lng, form.lat],
        },
      },
      services: validServices.map((s) => ({
        name: s.name.trim(),
        price: Number(s.price),
      })),
      workingHours: {
        open: form.open,
        close: form.close,
      },
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    setIsSubmitting(true);

    try {
      const res = await fetch(
        "https://car4wash-back.vercel.app/api/carwash/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Registration failed");
        return;
      }

      // Auto-login after success
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", "carwash");
        alert("Carwash registered successfully! You are now logged in.");
        navigate("/dashboard");
      } else {
        alert("Carwash registered successfully!");
        navigate("/carwashlogin");
      }
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ================= MAP MODAL ================= */}
      {openMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[90%] h-[50vh] rounded-xl overflow-hidden shadow-xl bg-white">
            <button
              onClick={() => setOpenMap(false)}
              className="absolute top-3 right-3 z-[1000] w-10 h-10 rounded-full bg-white text-red-600 font-bold text-xl shadow"
            >
              ✕
            </button>

            <MapContainer
              center={[41.7151, 44.8271]}
              zoom={13}
              scrollWheelZoom
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationSelector />
              {form.lat && form.lng && <Marker position={[form.lat, form.lng]} />}
            </MapContainer>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center text-sm">
            {formError}
          </div>
        )}

        <input
          type="text"
          name="businessName"
          placeholder="Carwash Name"
          value={form.businessName}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white/90"
          required
        />

        <input
          type="text"
          name="ownerName"
          placeholder="Owner Full Name"
          value={form.ownerName}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white/90"
          required
        />

        <input
          type="text"
          placeholder="Click to select location"
          value={form.location}
          readOnly
          onClick={() => setOpenMap(true)}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white/90 cursor-pointer"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Business Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white/90"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white/90"
          required
        />

        <div className="flex gap-3">
          <input
            type="time"
            value={form.open}
            onChange={(e) => setForm({ ...form, open: e.target.value })}
            className="w-1/2 p-3 border border-gray-300 rounded-xl bg-white/90"
            required
          />
          <input
            type="time"
            value={form.close}
            onChange={(e) => setForm({ ...form, close: e.target.value })}
            className="w-1/2 p-3 border border-gray-300 rounded-xl bg-white/90"
            required
          />
        </div>

        {/* ================= SERVICES ================= */}
        <div>
          <p className="font-semibold mb-2">Services You Offer</p>

          {services.map((service, i) => (
            <div key={i} className="flex gap-3 mb-3 items-center">
              <input
                type="text"
                placeholder={`Service ${i + 1}`}
                value={service.name}
                onChange={(e) => handleServiceChange(i, "name", e.target.value)}
                className="w-2/3 p-3 border border-gray-300 rounded-xl bg-white/90"
                required
              />
              <input
                type="number"
                placeholder="₾ Price"
                value={service.price}
                onChange={(e) => handleServiceChange(i, "price", e.target.value)}
                className="w-1/3 p-3 border border-gray-300 rounded-xl bg-white/90"
                required
              />
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveService(i)}
                  className="ml-2 px-2 py-1 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200 transition"
                  title="Remove this service"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddService}
            className="w-full py-2 border border-gray-300 rounded-xl bg-white/90 text-blue-600"
          >
            + Add Another Service
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Registering..." : "Register Carwash"}
        </button>

        <div className="text-gray-700 text-sm mt-4 text-center">
          Already have a carwash account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/carwashlogin")}
          >
            Log In
          </span>
        </div>
      </form>
    </>
  );
}