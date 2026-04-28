import React, { useEffect } from "react";
import DisplayProducts from "../components/productPage/DisplayProducts.jsx";
import useProductStore from "../stores/product.store.js";
import useAuctionStore from "../stores/auction.store.js";
import useBidStore from "../stores/bid.store.js";
import useUserStore from "../stores/user.store.js";

function ActiveBid() {
  const allProducts = useProductStore((state) => state.allProducts);
  const user = useUserStore((state) => state.user);
  const allCategories = useProductStore((state) => state.allCategories);
  const getAllProducts = useProductStore((state) => state.getAllProducts);
  const getCategories = useProductStore((state) => state.getCategories);
  const clearAuctionById = useAuctionStore((state) => state.clearAuctionById);
  const clearProductById = useProductStore((state) => state.clearProductById);
  const bidData = useBidStore((state) => state.bidData);
  const allAuction = useAuctionStore((state) => state.allAuction);
  const getAllBid = useBidStore((state) => state.getAllBid);
  const getAllAuction = useAuctionStore((state) => state.getAllAuction);

  if (!bidData || !allAuction || !allProducts || !allCategories) {
    return <div>Loading...</div>;
  }

  // 2. Find all bids made by the current user
  const userBids = bidData.filter((bid) => bid.bidderId === user.id);
  // 3. Extract unique Auction IDs from those bids
  const userAuctionIds = [...new Set(userBids.map((bid) => bid.auctionId))];
  // 4. Filter allAuction to get the auctions the user participated in
  const filteredAuctions = allAuction.filter((auction) =>
    userAuctionIds.includes(auction.id),
  );
  // 5. Get the products associated with those filtered auctions
  const displayProducts = allProducts.filter((product) =>
    filteredAuctions.some((auction) => auction.productId === product.id),
  );

  console.log("displayProducts", !displayProducts);
  const hldNoActiveBid = () => {
    if (displayProducts.length === 0) {
      return <div className="flex justify-center items-center align-middle h-full w-full grow min-h-[calc(100vh-360px)]"><h1>Let's take a littile bid</h1></div>;
    }
    return (
      <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-10">
        <DisplayProducts
          displayProducts={displayProducts}
          allCategories={allCategories}
        />
      </div>
    );
  };

  useEffect(() => {
    getAllBid();
    getCategories();
    getAllAuction();
    getAllProducts(); // <--- Crucial: The list will be empty without this
    clearAuctionById();
    clearProductById();
  }, []);

  return <>{hldNoActiveBid()}</>;
}

export default ActiveBid;
