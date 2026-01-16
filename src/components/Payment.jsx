// components/Payment.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Hardcoded Stripe test publishable key
const stripePromise = loadStripe(
  "pk_test_51SVdYfCPqWok7xUbvcckNxRl6mP0Tg2W2QGjGuyN9onWBPgrBVGqngvUFHbD5NvPDLVk6soVbM36gRlHUXNLdZSQ00VoZWxU1A"
);

const CheckoutForm = ({ amount, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!cardComplete) {
      setMessage("Please complete your card details.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Create PaymentIntent on backend
      const res = await fetch(
        "https://car4wash-back.vercel.app/api/stripe/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount, bookingId }),
        }
      );

      const data = await res.json();
      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        setMessage("Failed to get client secret from server.");
        setLoading(false);
        return;
      }

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) setMessage(result.error.message);
      else if (result.paymentIntent?.status === "succeeded")
        setMessage("Payment successful! ✅");
    } catch (err) {
      console.error(err);
      setMessage("Payment failed. ❌");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        className="p-3 border rounded-xl"
        options={{
          style: {
            base: { fontSize: "16px", color: "#333" },
            invalid: { color: "red" },
          },
        }}
        onChange={(e) => {
          setCardComplete(e.complete);
          setMessage(e.error ? e.error.message : "");
        }}
      />

      <button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>

      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
};

const Payment = ({ amount, bookingId }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm amount={amount} bookingId={bookingId} />
  </Elements>
);

export default Payment;
