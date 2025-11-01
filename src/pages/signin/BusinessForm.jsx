import React, { useState } from "react";

export default function BusinessForm({ addBusiness, navigate }) {
  const [services, setServices] = useState([{ name: "", price: "" }]);
  const [businessData, setBusinessData] = useState({
    name: "",
    address: "",
    email: "",
    description: "",
  });

  const handleAddService = () => {
    setServices([...services, { name: "", price: "" }]);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleInputChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBusiness = {
      ...businessData,
      services,
      createdAt: new Date().toLocaleString(),
    };
    addBusiness(newBusiness);
    navigate("/dashboard");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Business Name"
        value={businessData.name}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Business Address"
        value={businessData.address}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Business Email"
        value={businessData.email}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      />
      <textarea
        name="description"
        placeholder="Business Description (e.g. premium car wash, detailing, etc.)"
        value={businessData.description}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        rows="3"
        required
      ></textarea>

      {/* Photos Placeholder */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Add photos of your carwash
        </label>
      </div>

      {/* Services Section */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Services You Offer
        </label>
        {services.map((service, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Service ${index + 1} name`}
              value={service.name}
              onChange={(e) => handleServiceChange(index, "name", e.target.value)}
              className="w-2/3 p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="₾ Price"
              value={service.price}
              onChange={(e) => handleServiceChange(index, "price", e.target.value)}
              className="w-1/3 p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddService}
          className="w-full border border-dashed border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition"
        >
          + Add Another Service
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition"
      >
        Register Business
      </button>
    </form>
  );
}
