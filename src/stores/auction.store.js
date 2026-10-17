import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  apiGetAllAuction,
  apiCreateAuction,
  apiGetAuctionById,
  apiUpdateAuction,
  apiDeleteAuction,
  apiGetAcutionByProductId,
  apiGetPopularAuction,
} from "../api/apiMain.js";

const useAuctionStore = create()(
  persist(
    (set) => ({
      allAuction: [],
      popularAuction: [],
      auctionById: null,
      currentPrice: 0,
      endTime: 0,
      serverOffset: 0,
      setCurrentPrice: (newBid) => {
        set({
          currentPrice: newBid,
        });
      },
      syncTime: ({ endTime, serverTime }) => {
        const offset = serverTime - Date.now();
        set({ endTime, serverOffset: offset });
      },
      updateEndtime: (endTime) => {
        set({ endTime });
      },
      getAllAuction: async () => {
        const resp = await apiGetAllAuction();
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        // console.log("getAllAuction", resp.data.responses);
        // console.log("apiGetAllAuction",apiGetAllAuction)
        set({ allAuction: responses });
        return responses;
      },
      createAuction: async (body) => {
        await apiCreateAuction(body);
        // console.log("apiCreateAuction", apiCreateAuction);
        const resp = await apiGetAllAuction();
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        set({ allAuction: responses });
        return responses;
      },
      getAuctionById: async (auctionId) => {
        console.log("auctionidddd", typeof auctionId);
        const resp = await apiGetAuctionById(auctionId);
        const response = resp.data.responses ?? null;
        // console.log("getAuctionById", resp.data.responses);
        set({ auctionById: response });
        return response;
      },
      getAuctionByProductId: async (productId) => {
        await apiGetAcutionByProductId(productId);
        // console.log("getAuctionByProductId", resp.data.responses);
      },
      getPopularAuction: async () => {
        const resp = await apiGetPopularAuction();
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        set({ popularAuction: responses });
        console.log("getPopularAuction", resp.data.responses);
      },

      updateAuction: async (auctionId) => {
        const resp = await apiUpdateAuction(auctionId);
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        // console.log("apiUpdateAuction", apiUpdateAuction);
        set({ allAuction: responses });
        return responses;
      },
      deleteAuction: async (auctionId) => {
        const resp = await apiDeleteAuction(auctionId);
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        // console.log("apiDeleteAuction", apiDeleteAuction);
        set({ allAuction: responses });
        return responses;
      },
      clearAuctionById: () => {
        console.log("clear");
        set({ auctionById: null });
      },
    }),
    {
      name: "auction-storage",
    },
  ),
);
export default useAuctionStore;
