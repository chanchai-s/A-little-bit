import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiGetAllBid, apiGetBidById } from "../api/apiMain";

const useBidStore = create()(
  persist((set, get) => ({
    bidData: [],
    newBid: [],
    winner: null,
    bids: [],
    currentHighestBid: null,
    setNewBid: (newPrice) => {
      set((state) => ({
        newBid:
          typeof newPrice === "function" ? newPrice(state.newBid) : newPrice,
      }));
    },
    getAllBid: async () => {
      const resp = await apiGetAllBid();
      const responses = Array.isArray(resp.data.responses)
        ? resp.data.responses
        : [];
      //   console.log("resp", resp.data.responses);
      set({ bidData: responses });
      // console.log('getAllBid', resp.data.responses)
    },
    getBidById: async (bidId) => {
      const resp = await apiGetBidById(bidId);
      // console.log('apiGetBidById', resp)
    },
    // Actions
    setConnected: (status) => set({ isConnected: status }),

    setBidHistory: (bids) => {
      const bidHistory = Array.isArray(bids) ? bids : [];
      console.log('setBidhistoty')
       set({
        bids: bidHistory,
        currentHighestBid: bidHistory[0] ?? null, // assume sorted desc from DB
        isBidsLoading: false,
      })
    },
     

      addBid: (bid) => {
        console.log("add bid", bid)
        set((state) => ({
          bids: [bid, ...(state.bids ?? [])],
          currentHighestBid: bid,
        }));
        console.log("currentHighestBid", get().currentHighestBid);
      },

    setWinner: (winner) => {
      set({ winner });
      console.log("winner from zustand:", get().winner);
    },
    clearWinner: () => set({ winner: null }),

          reset: () =>
            set({ bids: [], winner: null, currentHighestBid: null, status: "idle" }),
  }),
  { name: 'bid-storage' }
)

);

export default useBidStore;
