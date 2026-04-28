import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  apiGetAllAuction,
  apiCreateAuction,
  apiGetAuctionById,
  apiUpdateAuction,
  apiDeleteAuction,
  apiGetAcutionByProductId,
  apiGetPopularAuction
} from "../api/apiMain.js";
import { connect } from "socket.io-client";

const useAuctionStore = create()(
  persist(
    (set, get) => ({
      allAuction: null,
      popularAuction:null,
      auctionById: [],
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
        // console.log("getAllAuction", resp.data.responses);
        // console.log("apiGetAllAuction",apiGetAllAuction)
        set({ allAuction: resp.data.responses });
        return resp.data.responses;
      },
      createAuction: async (body) => {
        await apiCreateAuction(body);
        // console.log("apiCreateAuction", apiCreateAuction);
        const resp = await apiGetAllAuction();
        set({ allAuction: resp.data.responses });
        return resp.data.responses;
      },
      getAuctionById: async (auctionId) => {
        console.log("auctionidddd", typeof auctionId);
        const resp = await apiGetAuctionById(auctionId);
        // console.log("getAuctionById", resp.data.responses);
        set({ auctionById: resp.data.responses });
        return resp.data.responses;
      },
      getAuctionByProductId: async (productId) => {
        const resp = await apiGetAcutionByProductId(productId);
        // console.log("getAuctionByProductId", resp.data.responses);
      },
      getPopularAuction:async ()=>{
        const resp = await apiGetPopularAuction();
        set({popularAuction:resp.data.responses})
        console.log('getPopularAuction', resp.data.responses)
      },

      updateAuction: async (auctionId) => {
        const resp = await apiUpdateAuction(auctionId);
        // console.log("apiUpdateAuction", apiUpdateAuction);
        set({ allAuction: resp.data.responses });
        return resp.data.responses;
      },
      deleteAuction: async (auctionId) => {
        const resp = await apiDeleteAuction(auctionId);
        // console.log("apiDeleteAuction", apiDeleteAuction);
        set({ allAuction: resp.data.responses });
        return resp.data.responses;
      },
      clearAuctionById: () => {
        console.log('clear')
        set({auctionById:[]})
      }
    }),
    {
      name: "auction-storage",
    },
  ),
);
export default useAuctionStore;
