// components/Payment.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load your publishable key (from Stripe dashboard)
const stripePromise = loadStripe("pk_test_51MZ6Y2SDD3K3hYx1zYk3Vh3bJ6jFz8Yz7Q9Z1X9Z1X9Z1X9Z1X9Z1X9Z1X9Z1X9Z1");

const CheckoutForm = ({ amount, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1️⃣ Create PaymentIntent on backend
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

      // 2️⃣ Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful! ✅");
      }
    } catch (err) {
      console.error(err);
      setMessage("Payment failed. ❌");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded-xl" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

const Payment = ({ amount, bookingId }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} bookingId={bookingId} />
    </Elements>
  );
};

export default Payment;
