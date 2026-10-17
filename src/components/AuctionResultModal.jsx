import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useBidStore from "../stores/bid.store.js";
import { apiGetUserById } from "../api/apiMain.js";

export default function AuctionResultModal({ currentUserId, auctionId }) {
  const { winner, clearWinner } = useBidStore();
  const hasShownRef = useRef(false);
  const [winnerUsername, setWinnerUsername] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const getUserById = async (id) => {
    const resp = await apiGetUserById(id);
    setWinnerUsername(resp.data.responses.username);
  }

  // Fetch winner's username when a winner is set
  useEffect(() => {
    if (!winner) return;

    if (!hasShownRef.current) {
      hasShownRef.current = true;
    }

    // Only fetch if there's actually a winner (not a no-bid close)
    if (winner.winnerId) {
      setLoadingUser(true);
      try {
        getUserById(winner.winnerId);
      } catch (error) {
        console.log('error at get id', error)
      } finally {
        setLoadingUser(false);
      }
    }
  }, [winner]);

  // Reset guard when winner is cleared
  useEffect(() => {
    if (!winner) {
      hasShownRef.current = false;
      setWinnerUsername(null);
    }
  }, [winner]);

  if (!winner || !hasShownRef.current) return null;

  const isWinner = winner.winnerId === currentUserId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) clearWinner();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden bg-base-300"
      >
        {isWinner ? (
          <WinnerContent
            amount={winner.amount}
            bidId={winner.bidId}
            auctionId={auctionId}
            onClose={clearWinner}
          />
        ) : (
          <LoserContent
            winnerUsername={winnerUsername}
            loadingUser={loadingUser}
            onClose={clearWinner}
          />
        )}
      </div>
    </div>
  );
}

function WinnerContent({ amount, bidId, auctionId, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="px-8 pt-10 pb-8 text-center">
      <p
        className="text-xs font-semibold tracking-widest uppercase mb-2"
        style={{ color: "#000000" }}
      >
        Congratulations
      </p>

      <h2
        className="text-3xl font-bold text-black mb-2"
        style={{ fontFamily: "Georgia, serif" }}
      >
        You won!
      </h2>

       <div className="flex justify-center mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        >
          🏆
        </div>
      </div>

      <p className="text-sm mb-8 text-black">
        Your bid was the highest and met the reserve price.
      </p>

      <div
        className="rounded-xl px-6 py-5 mb-3 bg-[#5a0000]/15"
      >
        <p
          className="text-xs uppercase tracking-widest mb-1 text-black"
        >
          Winning bid
        </p>
        <p className="text-4xl font-bold" style={{ color: "#000000" }}>
          {amount.toLocaleString()} <span className="text-xl">฿</span>
        </p>
      </div>

      <p className="text-xs mb-8 text-black">
        Bid ref: {bidId}
      </p>

      <button
        onClick={() => {
          onClose();
          navigate(`/payment/${auctionId}/${bidId}`);
        }}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95"
        style={{
          background:
            "linear-gradient(135deg, rgb(122, 0, 0) 0%, #450a0a 100%)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Continue
      </button>
    </div>
  );
}

function LoserContent({ winnerUsername, loadingUser, onClose }) {
  return (
    <div className="px-8 pt-10 pb-8 text-center">
      <div className="flex justify-center mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          🔔
        </div>
      </div>

      <p
        className="text-xs font-semibold tracking-widest uppercase mb-2 text-black"
      >
        Auction ended
      </p>

      <h2
        className="text-3xl font-bold text-black mb-2"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Better luck next time
      </h2>

      <p className="text-sm mb-6 text-black">
        This auction has closed. You didn't place the winning bid.
      </p>

      {/* Winner callout */}
      <div
        className="rounded-xl px-5 py-4 mb-8"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-1 text-white"
        >
          Won by
        </p>
        {loadingUser ? (
          <div className="flex items-center justify-center gap-2 mt-1">
            <div
              className="w-4 h-4 rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                borderTopColor: "rgba(255,255,255,0.4)",
              }}
            />
            <span
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Loading...
            </span>
          </div>
        ) : (
          <p className="text-lg font-semibold text-white">
            {winnerUsername ?? "Another bidder"}
          </p>
        )}
      </div>

      <p className="text-xs mb-8 text-black">
        Any bids you placed have been released and no charge will be made to
        your account.
      </p>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95"
        style={{
          background: "rgba(122,0,0,0.8)",
          color: "rgba(255,255,255, 1)",
          border: "1px solid rgba(122,0,0,0.12)",
          cursor: "pointer",
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
