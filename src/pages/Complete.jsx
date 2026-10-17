import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { apiConfirmCheckout } from "../api/apiMain.js";

export default function Complete() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState({ loading: true, status: null, error: null });

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, status: "MISSING_SESSION", error: null });
      return;
    }
    apiConfirmCheckout(sessionId)
      .then((resp) => setState({ loading: false, status: resp.data.status, error: null }))
      .catch((err) => setState({
        loading: false,
        status: null,
        error: err?.response?.data?.message ?? err.message,
      }));
  }, [sessionId]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-sm text-center">
          <p className="animate-pulse text-[#59413e] font-bold uppercase tracking-widest text-xs">Confirming payment...</p>
        </div>
      </div>
    );
  }

  if (state.error || state.status === "FAILED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-sm text-center space-y-6">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-3xl font-['Newsreader'] italic text-[#7a0009]">Payment Issue</h1>
          <p className="text-[#59413e] leading-relaxed">
            {state.error || "There was an issue verifying your payment. Please contact support."}
          </p>
          <Link
            to="/my_orders"
            className="inline-block bg-[#59413e] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#4a3532] transition-colors"
          >
            Check Order History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6] px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-sm text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-['Newsreader'] italic text-[#7a0009]">Payment received</h1>
        <p className="text-[#59413e] leading-relaxed">
          Thank you. Your acquisition has been confirmed and the seller has
          been notified.
        </p>

        {sessionId && (
          <p className="text-[10px] tracking-widest uppercase text-[#59413e]/60 break-all">
            Ref: {sessionId}
          </p>
        )}

        <Link
          to="/my_orders"
          className="inline-block bg-[#7a0009] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#9e1b1b] transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}