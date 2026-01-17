import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Payment from "../components/Payment"; // your Stripe component

export default function CarwashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carwash, setCarwash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedService, setSelectedService] = useState(null); // for booking modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  useEffect(() => {
    fetch(`https://car4wash-back.vercel.app/api/carwash/${id}`)
      .then((res) => res.json())
      .then(setCarwash)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const openBookingModal = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedService(null);
    setBookingDate("");
    setBookingTime("");
  };

  const handleBookingSuccess = () => {
    alert("Booking confirmed! 🎉");
    closeBookingModal();
    // Optional: refresh carwash or show success page
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!carwash) {
    return <p className="p-6">Carwash not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium transition"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl p-6 shadow">
          <h1 className="text-2xl font-bold mb-2">{carwash.businessName}</h1>
          <p className="text-gray-600 mb-6">{carwash.location?.address}</p>

          <h2 className="text-xl font-semibold mb-4">Services & Prices</h2>

          <div className="space-y-4 mb-8">
            {carwash.services?.map((service) => (
              <div
                key={service._id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-2xl"
              >
                <div>
                  <span className="font-medium block">{service.name}</span>
                  <span className="text-sm text-gray-600">
                    {service.duration ? `${service.duration} min` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{service.price} ₾</span>
                  <button
                    onClick={() => openBookingModal(service)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Photos Section */}
          <h2 className="text-xl font-semibold mb-4">Photos</h2>
          {carwash.images?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {carwash.images.map((url, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={url}
                    alt={`Carwash photo ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl shadow-sm transition-transform group-hover:scale-[1.02]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6 italic">
              No photos available yet
            </p>
          )}
        </div>
      </main>

      {/* Large Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={selectedImage}
              alt="Large view"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Book: {selectedService.name}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                  required
                />
              </div>

              <div className="text-lg font-semibold">
                Total: {selectedService.price} ₾
              </div>
            </div>

            {/* Stripe Payment Form */}
            <Payment
              amount={selectedService.price}
              bookingId="temp" // replace with real booking ID after creation
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={closeBookingModal}
                className="flex-1 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
              {/* Payment button is inside Payment component */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}