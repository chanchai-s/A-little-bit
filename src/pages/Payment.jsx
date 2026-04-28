import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// 2. ใส่ Publishable Key ของคุณที่นี่
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/success",
      },
    });

    if (error) setMessage(error.message);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-4">
        <h3 className="font-['Newsreader'] text-2xl italic text-[#7a0009]">
          Secure Checkout
        </h3>
        <button
          onClick={onClose}
          type="button"
          className="material-symbols-outlined text-stone-400 hover:text-black"
        >
          close
        </button>
      </div>

      {/* Stripe จะวาดช่องกรอกบัตรตรงนี้ */}
      <PaymentElement />

      {message && (
        <div className="text-red-600 text-[10px] font-bold uppercase mt-2">
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#9e1b1b] text-white py-5 px-8 font-bold text-xs tracking-widest uppercase hover:bg-[#7a0009] transition-colors duration-300 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Authorize & Pay Now"}
      </button>
    </form>
  );
};

const Payment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const fetchPaymentIntent = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/payments/", {
        amount: 52950,
        currency: "thb",
      });

      setClientSecret(response.data.VITE_STRIPE_PUBLISHABLE_KEY);
    } catch (err) {
      console.error("Error fetching client secret:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-['Manrope'] selection:bg-[#9e1b1b] selection:text-white">
      {/* ส่วนเนื้อหาหลัก: โครงเดิมเป๊ะ */}
      <main
        className={`max-w-7xl mx-auto px-8 py-12 md:py-20 transition-all duration-500 ${isModalOpen ? "blur-md" : ""}`}
      >
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Order Content */}
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-[#59413e]/60 uppercase">
                <span>SUCCESS</span>
                <span className="material-symbols-outlined text-[12px]">
                  chevron_right
                </span>
                <span className="text-[#7a0009]">ORDER SUMMARY</span>
              </nav>
              <h1 className="text-5xl md:text-6xl font-['Newsreader'] italic tracking-tight">
                Order Summary
              </h1>
              <p className="text-[#59413e] text-lg leading-relaxed max-w-xl">
                Thank you for your successful bid. Please review the acquisition
                details below.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f5f3f0] p-6 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#59413e]/70 uppercase">
                  ORDER NUMBER
                </span>
                <span className="text-sm font-bold">#AU-77492-EE</span>
              </div>
              <div className="bg-[#f5f3f0] p-6 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#59413e]/70 uppercase">
                  DATE
                </span>
                <span className="text-sm font-bold">October 24, 2024</span>
              </div>
              <div className="bg-[#f5f3f0] p-6 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#59413e]/70 uppercase">
                  STATUS
                </span>
                <span className="text-sm font-bold text-[#9e1b1b]">
                  PENDING PAYMENT
                </span>
              </div>
            </div>

            {/* Product Detail Section */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-full md:w-1/2 aspect-[4/5] bg-[#e4e2df] overflow-hidden group rounded-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB5MGQKgyVyVarX-cAy3RKs_ynqVF_yqC00ExGMEiyYvBh3Ld57u6iTPvZT9nUBUyI2M44B1e6_ObWdYKX_irBx8ibk2EUalurPZ_e2UKL38HX1oZoGdDrdckqmg_PLAD6tN856NsRWeJmKM7RVaFs-nXX5SqWxwx92RouvJgrH0JN1EfdcDY9sRZcHYoz9eEOlxOx2UH2qNjEUGUx2SE9oifUmwEzJ_8r4F2c7T5QG_EGscL1dDtiB6s3e29GY7olUQypDEGhyD3L"
                  alt="Golden Model Sculpture"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-6 pt-4">
                <div>
                  <span className="text-xs font-bold tracking-[0.2em] text-[#59413e] uppercase">
                    LOT 442
                  </span>
                  <h2 className="text-4xl font-['Newsreader'] mt-2">
                    Golden Model
                  </h2>
                </div>
                <p className="text-[#59413e] leading-relaxed italic">
                  A striking exploration of contemporary abstraction and the
                  fluidity of memory. This piece captures light through its
                  rhythmic, curved surfaces.
                </p>
                <div className="pt-4 space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#59413e]/70 uppercase">
                    HAMMER PRICE
                  </span>
                  <div className="text-3xl font-['Newsreader'] text-[#4b3519]">
                    ฿45,000
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Payment cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  Shipping Address
                </h3>
                <div className="p-6 bg-white border border-[#8d706d]/10 space-y-1 rounded-sm">
                  <p className="font-bold">Julianne V. Sterling</p>
                  <p className="text-sm text-[#59413e]">
                    242 West 24th St, Apt 4B, Chelsea, NY 10011
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  Payment Method
                </h3>
                <div className="p-6 bg-white border border-[#8d706d]/10 flex items-start gap-4 rounded-sm">
                  <div className="w-10 h-6 bg-stone-800 rounded flex items-center justify-center text-[10px] text-white font-bold tracking-tighter">
                    SECURE
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold">Stripe Encryption</p>
                    <p className="text-sm text-[#59413e]">
                      PCI-DSS Compliant Gateway
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="w-full lg:w-[420px]">
            <div className="sticky top-32 bg-[#9e1b1b] text-white p-10 relative overflow-hidden rounded-sm shadow-xl">
              <div className="relative z-10 space-y-10">
                <h2 className="text-2xl font-['Newsreader'] italic">
                  Price Breakdown
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-xs opacity-70 uppercase tracking-widest">
                      Hammer Price
                    </span>
                    <span className="font-['Newsreader'] text-xl italic">
                      ฿45,000
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-xs opacity-70 uppercase tracking-widest">
                      Buyer's Premium
                    </span>
                    <span className="font-['Newsreader'] text-xl italic">
                      ฿6,750
                    </span>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <span className="text-[10px] font-bold tracking-[0.3em] opacity-60 uppercase">
                    TOTAL AMOUNT
                  </span>
                  <div className="text-6xl font-['Newsreader'] font-light tracking-tighter">
                    ฿52,950
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-white text-[#7a0009] py-5 px-8 font-bold text-xs tracking-widest uppercase flex items-center justify-between group hover:bg-[#f5f3f0] transition-colors"
                  >
                    Confirm & Pay
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. Pop-up Modal (ตัวคุมระบบ Stripe) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
           onClick={() => {
  setIsModalOpen(true);
  fetchPaymentIntent();
}}
          ></div>
          <div className="relative bg-white w-full max-w-md p-8 shadow-2xl rounded-sm">
            {clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: "flat" },
                }}
              >
                <CheckoutForm onClose={() => setIsModalOpen(false)} />
              </Elements>
            ) : (
              <div className="py-20 text-center text-[#7a0009] font-bold tracking-widest uppercase animate-pulse">
                Establishing Secure Link
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#efeeeb] w-full border-t border-[#e4e2df] flex flex-col items-center py-12 px-8 mt-24">
        <div className="mb-10 text-center space-y-2">
          <div className="font-['Newsreader'] text-lg text-stone-800 tracking-[0.3em] uppercase">
            Aureus Auctions
          </div>
          <div className="text-[10px] tracking-[0.5em] text-[#59413e]/60 font-bold uppercase">
            The Prestigious Curator
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {["Terms of Sale", "Privacy Policy", "Auction Rules"].map((link) => (
            <a
              key={link}
              className="text-[#59413e] text-xs tracking-widest uppercase hover:underline"
              href="#"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Payment;
