import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext";

export default function SignUp() {
  const [activeTab, setActiveTab] = useState("user");
  const [plan, setPlan] = useState("starter");
  const [services, setServices] = useState([{ name: "", price: "" }]);
  const [businessData, setBusinessData] = useState({
    name: "",
    address: "",
    email: "",
    description: "",
  });

  const { addBusiness } = useBusiness();
  const navigate = useNavigate();

  // Add another service field
  const handleAddService = () => {
    setServices([...services, { name: "", price: "" }]);
  };

  // Handle change for each service
  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  // Handle change for business inputs
  const handleInputChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  // On form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === "business") {
      const newBusiness = {
        ...businessData,
        plan,
        services,
        createdAt: new Date().toLocaleString(),
      };
      addBusiness(newBusiness); // Save business to context
    }

    navigate("/dashboard"); // Go to dashboard after submitting
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Car4wash</h1>
      <p className="text-gray-600 mb-6 text-center">
        Sign up as a user or register your business to start immediately.
      </p>

      {/* Tab Switch */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "user"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("user")}
        >
          User Sign-Up
        </button>

        <button
          className={`px-6 py-2 rounded-lg font-medium ${
            activeTab === "business"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("business")}
        >
          Register Business
        </button>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {activeTab === "user" ? (
          // USER SIGN-UP FORM
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>
        ) : (
          // BUSINESS REGISTRATION FORM
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

            {/* Pricing Plan */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Choose a Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="starter">Starter — ₾25/month</option>
                <option value="professional">Professional — ₾45/month</option>
                <option value="enterprise">Enterprise — Custom Pricing</option>
              </select>
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
                    onChange={(e) =>
                      handleServiceChange(index, "name", e.target.value)
                    }
                    className="w-2/3 p-3 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="₾ Price"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(index, "price", e.target.value)
                    }
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
        )}
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useBusiness } from "../context/BusinessContext"; // 👈 import

// export default function SignUp() {
//   const [activeTab, setActiveTab] = useState("user");
//   const [plan, setPlan] = useState("starter");
//   const [services, setServices] = useState([{ name: "", price: "" }]);
//   const [businessData, setBusinessData] = useState({
//     name: "",
//     address: "",
//     email: "",
//     description: "",
//   });

//   const { addBusiness } = useBusiness();
//   const navigate = useNavigate();

//   const handleAddService = () => {
//     setServices([...services, { name: "", price: "" }]);
//   };

//   const handleServiceChange = (index, field, value) => {
//     const updated = [...services];
//     updated[index][field] = value;
//     setServices(updated);
//   };

//   const handleChange = (e) => {
//     setBusinessData({ ...businessData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (activeTab === "business") {
//       const newBusiness = {
//         ...businessData,
//         plan,
//         services,
//       };
//       addBusiness(newBusiness); // 👈 save the business globally
//     }

//     navigate("/dashboard");
//   };
// {/* BUSINESS REGISTRATION FORM */}
// <form className="space-y-4" onSubmit={handleSubmit}>
//   <input
//     type="text"
//     name="name"
//     placeholder="Business Name"
//     onChange={handleChange}
//     className="w-full p-3 border border-gray-300 rounded-lg"
//     required
//   />
//   <input
//     type="text"
//     name="address"
//     placeholder="Business Address"
//     onChange={handleChange}
//     className="w-full p-3 border border-gray-300 rounded-lg"
//     required
//   />
//   <input
//     type="email"
//     name="email"
//     placeholder="Business Email"
//     onChange={handleChange}
//     className="w-full p-3 border border-gray-300 rounded-lg"
//     required
//   />
//   <textarea
//     name="description"
//     placeholder="Business Description (e.g. premium car wash, detailing, etc.)"
//     onChange={handleChange}
//     className="w-full p-3 border border-gray-300 rounded-lg"
//     rows="3"
//     required
//   ></textarea>

//   {/* Pricing Plan */}
//   <div>
//     <label className="block text-gray-700 font-medium mb-2">
//       Choose a Plan
//     </label>
//     <select
//       value={plan}
//       onChange={(e) => setPlan(e.target.value)}
//       className="w-full p-3 border border-gray-300 rounded-lg"
//     >
//       <option value="starter">Starter — $9/month</option>
//       <option value="professional">Professional — $19/month</option>
//       <option value="enterprise">Enterprise — Custom Pricing</option>
//     </select>
//   </div>

//   {/* Services Section */}
//   <div>
//     <label className="block text-gray-700 font-medium mb-2">
//       Services You Offer
//     </label>
//     {services.map((service, index) => (
//       <div key={index} className="flex gap-2 mb-2">
//         <input
//           type="text"
//           placeholder={`Service ${index + 1} name`}
//           value={service.name}
//           onChange={(e) =>
//             handleServiceChange(index, "name", e.target.value)
//           }
//           className="w-2/3 p-3 border border-gray-300 rounded-lg"
//           required
//         />
//         <input
//           type="number"
//           placeholder="₾ Price"
//           value={service.price}
//           onChange={(e) =>
//             handleServiceChange(index, "price", e.target.value)
//           }
//           className="w-1/3 p-3 border border-gray-300 rounded-lg"
//           required
//         />
//       </div>
//     ))}
//     <button
//       type="button"
//       onClick={handleAddService}
//       className="w-full border border-dashed border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition"
//     >
//       + Add Another Service
//     </button>
//   </div>

//   <button
//     type="submit"
//     className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition"
//   >
//     Register Business
//   </button>
// </form>
