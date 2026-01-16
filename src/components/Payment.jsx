const CheckoutForm = ({ amount, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !cardComplete) return;

    setLoading(true);
    setMessage("");

    try {
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

      const { clientSecret } = await res.json();

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
    } catch {
      setMessage("Payment failed. ❌");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        className="p-3 border rounded-xl"
        onChange={(e) => {
          setCardComplete(e.complete);
          if (e.error) setMessage(e.error.message);
        }}
      />

      <button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>

      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
};
