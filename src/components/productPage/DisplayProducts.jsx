import React, { useEffect } from "react";
import useAuctionStore from "../../stores/auction.store.js";
import useBidStore from "../../stores/bid.store.js";
import useProductStore from "../../stores/product.store.js";
import TimeCountdown from "../TimeCountdown.jsx";
import AuctionCard from "../AuctionCard.jsx";
import { useNavigate } from "react-router";

function DisplayProducts({ displayProducts, allCategories }) {
  const navigate = useNavigate();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const getProductsById = useProductStore((state) => state.getProductsById);
  const allAuction = useAuctionStore((state) => state.allAuction);
  const auctionById = useAuctionStore((state) => state.auctionById);
  console.log("allAuction", allAuction);
  const getAllAuction = useAuctionStore((state) => state.getAllAuction);
  const { bidData, getAllBid } = useBidStore();

  const hdlJoinClick = (id) => {
    try {
      if (!id) return alert("no auction");
      getAuctionById(id);
      navigate(`/auction_bid/${id}`);
      // getProductsById(auctionById.productId);
    } catch (error) {
      console.log(error.message);
    }
  };
  const hldPriceLoading = (lastBid, auction) => {
    if (!allAuction || !bidData) {
      return <div>Loading auctions...</div>;
    } else if (lastBid) {
      return `$${lastBid?.amount}`;
    }
    return `$${auction?.startingPrice}`;
  };

  useEffect(() => {
    getAllBid();
    getAllAuction();
  }, []);

  return (
    <>
      {displayProducts.map((i, idx) => {
        const category = allCategories.find((cat) => cat.id === i.categoryId);
        console.log('i.id', i.id)
        const auction = allAuction?.find((a) => a.productId === i.id);
        console.log("auction",auction);
        const lastBid = bidData?.findLast((b) => b.auctionId === auction?.id);
        console.log("lastBid", i.name, lastBid);
        const auctionId = auction?.id;
        return (
          <AuctionCard
            key={i.id}
            index={idx}
            img={i.images?.[0]?.imageUrl}
            title={i.name}
            cat={category?.name}
            description={i.description}
            badge={auction?.status}
            price={hldPriceLoading(lastBid, auction)}
            timeLeft={<TimeCountdown product={i} />}
            auctionDetail={auction}
            onJoin={() => hdlJoinClick(auctionId)}
          />
        );
      })}
    </>
  );
}

export default DisplayProducts;
