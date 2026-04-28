import { connect, io } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import useProductStore from "../stores/product.store.js";
import useAuctionStore from "../stores/auction.store.js";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import useSocketStore from "../stores/socket.store.js";
import useBidStore from "../stores/bid.store.js";
import useUserStore from "../stores/user.store.js";
import TimeCountdown from "../components/TimeCountdown.jsx";
import {
  connectSocket,
  joinAuctionRoom,
  leaveAuctionRoom,
  placeBid,
} from "../socket/socketService.js";
import Swal from "sweetalert2";
import AuctionResultModal from "../components/AuctionResultModal.jsx";
import { apiGetProductsById } from "../api/apiMain.js";
import ProductImageSlide from "../components/productPage/ProductImageSlide.jsx";

const AuctionBid = () => {
  // const [isLoading, setIsLoading] = useState(true)
  const { productById, allCategories, getProductsById } = useProductStore();
  const { auctionById, getAuctionById, setCurrentPrice, currentPrice } = useAuctionStore();
  console.log('auctionById.product.images', auctionById.product.images)
  const { socket, joinAuction, leaveAuction, connect } = useSocketStore();
  const {
    newBid,
    bidData,
    setNewBid,
    getAllBid,
    currentHighestBid,
    bids,
    setBidHistory,
    winner,
  } = useBidStore();
  // console.log('bidData', bidData)
  const { user, users, getAllUser } = useUserStore();
  const [isLoading, setIsLoading]= useState(true);
  const { id, categoryId, name, description, sellerId, updatedAt, images } =
    productById;
  const { auctionId } = useParams();
  const { register, handleSubmit, reset } = useForm();

  const filteredNewBid = newBid.filter((i) => i.auctionId === auctionById?.id);
  const filterCategoryName = allCategories.filter(
    (cate) => categoryId === cate.id,
  );

  const hdlOnSubmit = ({ amount }) => {
    const minRequiredPrice = currentHighestBid
      ? Number(currentHighestBid?.amount) + Number(auctionById?.minIncrement)
      : Number(auctionById?.startingPrice) + Number(auctionById?.minIncrement);

    if (!amount || Number(amount) <= 0 || Number(amount) < minRequiredPrice) {
      return alert(
        `Please enter a valid price: (Minimum Increment: ${auctionById?.minIncrement})`,
      );
    }

    placeBid(amount, auctionId);
    reset();
  };

  useEffect(() => {
    if(!auctionById) {
      return
    }
    connectSocket();
    joinAuctionRoom(auctionId);
    getAuctionById(auctionId);
    // getProductsById(auctionById?.productId);

    setIsLoading(false);
    
    console.log('auctionById', auctionById)
    console.log('auctionId', auctionId)
    if (!auctionById || String(auctionById?.id) !== String(auctionId)) {
      console.warn(
        `[AuctionBid] auctionId mismatch: expected ${auctionId}, got ${auctionById?.id}. Join cancelled.`,
      );
      return;
    }
    return () => {
      leaveAuctionRoom();
    };
  }, []);

  useEffect(() => {
    if (!auctionById?.bids) return; // ← guard: wait until data is real

    setBidHistory(auctionById.bids);
  }, [auctionById]);

  useEffect(() => {
  getAllUser();
}, [getAllUser]);

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-['Manrope'] antialiased min-h-screen">
      {/* {isLoading ? (
        <div>...Loading</div>
      ) : ( */}
        <main className="pt-12 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Image & Details */}
            <div className="lg:col-span-7 space-y-16">
              <div className="relative group">
                <div className="aspect-[4/5] md:aspect-[3/2] overflow-hidden rounded-lg bg-[#f6f3f2]">
                {/* {auctionById.product.images && auctionById.product.images> 0 && */}
                <ProductImageSlide images={auctionById?.product.images}/>
                {/* } */}
                </div>
                <button className="absolute bottom-6 right-6 bg-white/70 backdrop-blur-md p-3 rounded-full hover:bg-white transition-colors">
                  <span className="material-symbols-outlined">fullscreen</span>
                </button>
              </div>

              <div className="space-y-12">
                <div className="space-y-4">
                  <span className="font-['Manrope'] uppercase tracking-widest text-lg text-[#570000] font-bold">
                    {filterCategoryName[0]?.name}
                  </span>
                  <h1 className="text-5xl md:text-6xl font-['Noto_Serif'] text-[#1c1b1b] leading-tight">
                    {auctionById?.product.name}
                  </h1>
                  <p className="text-xl font-['Noto_Serif'] italic text-[#5e5e5e]">
                    {auctionById?.product.description}
                  </p>
                </div>

                <div className="max-w-none text-lg text-[#5a413d] leading-relaxed font-light space-y-4">
                  <p>{description}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Bidding Panel */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-8">
                <div className="bg-[#f6f3f2] p-8 md:p-10 rounded-lg border border-[#e2bfb9]/10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="font-['Manrope'] text-[12px] text-black mb-2 uppercase tracking-widest">
                        Current Bid
                      </p>
                      <p className="text-4xl font-['Noto_Serif'] text-dark-red font-bold tracking-wider">
                        {/* {filteredNewBid.length > 0 ? filteredNewBid[0].amount : auctionById?.startingPrice || 0} */}
                        {currentHighestBid
                          ? currentHighestBid.amount
                          : auctionById?.startingPrice}
                      </p>
                      <span className="text-[14px] text-primary mt-5 text-headline uppercase">
                        Highest Bidder:
                      </span>
                      <span className="text-[14px] text-secondary mt-3 text-headline uppercase font-bold mx-2">
                        {currentHighestBid
                          ? users.find(
                              (u) => u.id === currentHighestBid?.bidderId,
                            )?.username
                          : "No Bidder Yet"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-['Manrope'] text-[10px] text-stone-500 mb-2 uppercase tracking-widest">
                        Time Left
                      </p>
                      <p className="text-2xl font-['Noto_Serif'] text-[#1c1b1b]">
                        {auctionById?.product ? (
                          <TimeCountdown product={auctionById?.product} />
                        ) : (
                          "Loading timer..."
                        )}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(hdlOnSubmit)}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="font-['Manrope'] uppercase tracking-widest text-[10px] text-stone-500">
                          Your Bid
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 text-stone-400">
                            B
                          </span>
                          <input
                            type="number"
                            placeholder={
                              currentHighestBid
                                ? Number(currentHighestBid?.amount) +
                                  Number(auctionById?.minIncrement)
                                : Number(auctionById?.startingPrice) +
                                  Number(auctionById?.minIncrement)
                            }
                            {...register("amount")}
                            className="w-full bg-[#ebe7e7] border-none rounded-sm py-4 pl-8 pr-4 focus:ring-1 focus:ring-[#570000] focus:bg-white transition-all outline-none"
                          />
                        </div>
                        <div>
                          <button type="button">
                            Bid Increase: +200 +400 +600
                          </button>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-[#570000] to-[#800000] text-white font-['Manrope'] uppercase tracking-widest py-4 rounded-sm shadow-lg hover:scale-[1.01] active:scale-95 transition-all text-xs font-bold">
                        Place Bid
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[#f6f3f2]  text-stone-50 p-8 rounded-lg relative max-h-[300px]">
                  <div className="relative z-10 space-y-4">
                    <h3 className="font-['Noto_Serif'] text-xl text-left font-bold text-red">
                      Live Bid
                    </h3>
                    {/* <p className="text-xs text-stone-400 font-light leading-relaxed italic text-left">
                    "This specific canvas represents the pinnacle of 18th-century veduta painting. The 'ghostly' architecture is a signature mark of Guardi's later style."
                  </p> */}
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[200px]">
                      {bids
                        ? bids.map((e, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-4 pt-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-700">
                                  <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI9pSLzM2C7nGW835doACIRA-VV2iSSbtmcyioc8l2PFHVZbOgPD8AU6e1rUgyTzQNNFmR0LyUqDyfi8DSQjf0Nsh4xGxSg_yzBXa5qQPPyWl5MO-9QOufbyZ8HNMh77Kyu3yfUONSmw-jkrKydj4Pxr8uaode4P22rnLg5KnHe-9pakz6ndCVwAdgmqT_t02R-kaPe-qQwUl2zkokkDHwDDUaBaZiam4feZxuNbHupTPVsui7CU1XJOf9FA4Ip7JZiyGwD6U1FVYe"
                                    alt="Curator"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="text-left">
                                  <p className="text-[12px] font-bold font-['Manrope'] text-primary uppercase tracking-widest">
                                    {
                                      users?.find((i) => e.bidderId === i.id)
                                        .username
                                    }
                                    {/* {e.bidderId == user.id ? user.username : `User ${e.bidderId}`}  */}
                                  </p>
                                  <p className="text-[14px] text-stone-500 uppercase tracking-widest">
                                    {e.amount}
                                  </p>
                                </div>
                              </div>
                              <div className="text-[12px] text-stone-500 tracking-widest">
                                {new Date(e?.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          ))
                        : "Loading bid data..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              <AuctionResultModal currentUserId={user.id} />
      </main>
       {/* )} */}
    </div>
  );
};

export default AuctionBid;
