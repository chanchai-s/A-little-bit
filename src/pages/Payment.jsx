import { useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe.js";
import usePaymentStore from "../stores/payment.store.js";
import useAuctionStore from "../stores/auction.store.js";
import useBidStore from "../stores/bid.store.js";

export default function Payment() {
  const { auctionId, bidId } = useParams();
  const { clientSecret, loading, error, createCheckout, reset } =
    usePaymentStore();
  const { auctionById, getAuctionById } = useAuctionStore();
  const { winner, setWinner } = useBidStore();

  // Ensure we have product data for the routed auction
  useEffect(() => {
    if (!auctionById?.product || String(auctionById.id) !== String(auctionId)) {
      getAuctionById(auctionId);
    }
  }, [auctionId, auctionById, getAuctionById]);

  // Kick off checkout once we have everything we need
  useEffect(() => {
    if (clientSecret || loading || error) return;
    if (!auctionById?.product) return;
    if (!winner?.amount) return;

    console.log("[payment] firing createCheckout", {
      auctionId,
      bidId,
      productId: auctionById.product.id,
      productName: auctionById.product.name,
      price: winner.amount,
    });

    createCheckout(auctionId, bidId, {
      productId: auctionById.product.id,
      productName: auctionById.product.name,
      price: winner.amount,
    });
  }, [
    auctionId,
    bidId,
    auctionById,
    winner,
    clientSecret,
    loading,
    error,
    createCheckout,
  ]);

  // Diagnostic: figure out what (if anything) is blocking createCheckout
  const missing = [];
  if (!auctionById?.product) missing.push("auction/product data");
  if (!winner?.amount) missing.push("winner data");
  const idle = !loading && !error && !clientSecret;
  const stuck = idle && missing.length > 0;

  // Reset store when leaving the page
  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-['Manrope'] py-12 px-4">
      <main className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2">
          <nav className="text-[10px] tracking-[0.2em] font-bold text-[#59413e]/60 uppercase">
            Payment
          </nav>
          <h1 className="text-4xl font-['Newsreader'] italic">Complete your acquisition</h1>
          {auctionById?.product && winner?.amount && (
            <p className="text-[#59413e]">
              <span className="font-bold">{auctionById.product.name}</span>
              {" — ฿"}
              {Number(winner.amount).toLocaleString()}
            </p>
          )}
        </header>

        {loading && (
          <div className="bg-white p-12 rounded-sm shadow-sm text-center text-[#59413e]">
            Preparing checkout…
          </div>
        )}

        {error && (
          <div className="bg-white p-8 rounded-sm shadow-sm space-y-4">
            <p className="text-[#7a0009] font-bold">Could not start payment</p>
            <p className="text-sm text-[#59413e]">{error}</p>
            <Link
              to="/my_orders"
              className="inline-block text-xs font-bold uppercase tracking-widest text-[#7a0009] hover:underline"
            >
              ← Back to My Orders
            </Link>
          </div>
        )}

        {clientSecret && (
          <div className="bg-white p-2 rounded-sm shadow-sm">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {stuck && (
          <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-sm space-y-3 text-sm text-[#59413e]">
            <p className="font-bold text-yellow-800">⏳ Waiting on data</p>
            <p>The checkout cannot start until these arrive:</p>
            <ul className="list-disc list-inside text-xs">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>

            {import.meta.env.DEV && !winner?.amount && (
              <button
                type="button"
                onClick={() =>
                  setWinner({
                    amount: 100,
                    bidId: bidId ?? "test-bid-cuid",
                    winnerId: 0,
                  })
                }
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#7a0009] text-white hover:bg-[#9e1b1b] transition-colors"
              >
                🧪 Plant test winner (dev only)
              </button>
            )}

            <details className="text-xs">
              <summary className="cursor-pointer text-[#7a0009]">
                Debug snapshot
              </summary>
              <pre className="mt-2 p-2 bg-white rounded text-[10px] overflow-x-auto">
                {JSON.stringify(
                  {
                    auctionId,
                    bidId,
                    "auctionById.id": auctionById?.id ?? null,
                    "auctionById.product": auctionById?.product ?? null,
                    winner,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}
