import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router";
import useSocketStore from "../stores/socket.store";
import { io } from 'socket.io-client'
import AuctionCard from "../components/AuctionCard.jsx"
import useProductStore from "../stores/product.store.js"
import useAuctionStore from "../stores/auction.store.js"
import useBidStore from "../stores/bid.store.js"

const AuctionPage = () => {
  const { auctionId } = useParams()
  const [timeLeft, setTimeLeft] = useState(0)

  // --- Smaller Lots Carousel ---
  const carouselRef = useRef(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const {allAuction} = useAuctionStore()
  const {bidData} = useBidStore()
  // const lots = bidData.
 console.log('allAuction', bidData)
  const lots = [
    {
      title: "Patek Heritage '52",
      price: "$18,200",
      timeLeft: "59m 18s",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpFpbxMtXrk-gAQTJlnM-kPYDSICNwrJ_1E-rbxKyIspXOg5Nk4ECjL2O9VpcWgm-Xut2g7IAUSLSCI5y_c7Rc9shIbIVlgm3BdTCVQ9wSbdxeHX2TguhQFgohftgqge20yA1wgx6vQIsXEC0hx4a9TTW10-ZQ-Sm6PIsNMa4qz4EMzlHsXvKGhBIR31IqTHcsBLyl9lR2mC8vo8bq1zarp-rp6N6cLKMxsgj67vkdT83XGerTFOkXa3GjNgT880lh0_A_JcsEcVcq",
    },
    {
      title: "Royal Emerald Suite",
      price: "$32,500",
      timeLeft: "1h 44m",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7lNWJDmFn8e4aoRcuUAZrUzCFNtp6FMAzyu9zvjxHB-SflolrRjidTePqlBdkEm212h_7lQKkw2bMUX_uJyF_ghamrOsgpEhdFdPMDhOOaLXY7vVyX7cfIryPpfl5CaBezU8yzBQkPgLClVftaTZ9taQ9UoKvUNM7DtrD9OIKhetLjsaRFfBMEIkAfTzJ8eXjgyIHAqxNtI4oesSQ84AXvPa8P5Ta6r5fIls-UDa38RnKlBgFZ_RilSVqwNdeFe-zzwoM9RciG2dR",
    },
    {
      title: "Brutalist Vessel No.3",
      price: "$9,800",
      timeLeft: "3h 02m",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuARgMOZMmzVNrDz1n4_Y5rdr1efWWp2BraAsv5xYqoW7kg9mWdx_UwxsYkxHwgVqs4I3pIKE-2_7BkqdrNrRjum_NLj_mBIwtTlLt943SCKE2yD606kQOZHLNcnnSCt3q7rrwBcddrnFZEDj0kxiGHqkwn7nx1qNwgq3JLBx-Ys3SEzv0--LZq5t_oOOl9PXcuzAtbueKCwW12TH7332Xig3N-MuWUxtdFnFC5p44AuyQHijUsyH7Zr3uqJFBbtXpO9N82ftUSQr2fO",
    },
    {
      title: "Patek Heritage '52",
      price: "$18,200",
      timeLeft: "59m 18s",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpFpbxMtXrk-gAQTJlnM-kPYDSICNwrJ_1E-rbxKyIspXOg5Nk4ECjL2O9VpcWgm-Xut2g7IAUSLSCI5y_c7Rc9shIbIVlgm3BdTCVQ9wSbdxeHX2TguhQFgohftgqge20yA1wgx6vQIsXEC0hx4a9TTW10-ZQ-Sm6PIsNMa4qz4EMzlHsXvKGhBIR31IqTHcsBLyl9lR2mC8vo8bq1zarp-rp6N6cLKMxsgj67vkdT83XGerTFOkXa3GjNgT880lh0_A_JcsEcVcq",
    },
  ]

  const scrollToIndex = useCallback((index) => {
    const el = carouselRef.current
    if (!el) return
    const card = el.children[index]
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" })
    setCarouselIndex(index)
  }, [])

  const handlePrev = () => scrollToIndex(Math.max(carouselIndex - 1, 0))
  const handleNext = () => scrollToIndex(Math.min(carouselIndex + 1, lots.length - 1))

  // Sync dot with scroll position
  const handleCarouselScroll = useCallback(() => {
    const el = carouselRef.current
    if (!el) return
    const cardWidth = el.children[0]?.offsetWidth || 1
    const idx = Math.round(el.scrollLeft / (cardWidth + 24)) // 24 = gap-6
    setCarouselIndex(idx)
  }, [])

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-['Manrope'] min-h-screen">
      <main className=" pb-20 px-12 max-w-[1920px] mx-auto">
        <div className="flex items-center">
          <div className="font-headline text-4xl text-red my-8 mr-6">
            Populars
          </div>
          <div className="h-[1px] flex-grow bg-stone-200"></div>
        </div>
        {/* Hero Section & Sidebar Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 mb-24 w-full px-4 md:px-8">
          {/* Main Hero */}
          <div className="lg:col-span-5 group cursor-pointer relative overflow-hidden rounded-2xl shadow-xl h-full md:h-full">
            <div className="relative w-full h-full">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvgXMAB9rXZppdIyVFwnbyl0aZ1xuGdRyWrsI2Hi7htMsLJYlQfR592QAxC86WPGVIGhmZhNC8nPb7iqAx1b-eBsIhGfcsO94JMDxObkKctdlUfobrLqW0Kq4W-1pKvFQfQvzVDGvHs4MXapVj-uKodykXRnzDcygV6n9QyyhVsdVIDLi292kyP8F_WqdyIGCG_N__aZkNkfS7VM9pU60qM_SKUzdbdMmh_I08MZe1LeMt_9MkPHdGIRx5UPgClsTvSAOMTF1THQKv"
                alt="Luxury watch detail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Editorial Glass Overlay */} 
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/70 backdrop-blur-[24px] flex flex-col md:flex-row justify-between items-end md:items-center">
              <div className="max-w-xl text-left mx-2">
                <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-[#570000] mb-2 block font-semibold">
                  Premium Lot 041
                </span>
                <h1 className="font-['Noto_Serif'] text-5xl md:text-2xl text-black mb-4 leading-tight">
                  Golden Model <span className="italic">Signature</span>
                </h1>
                <p className="font-['Manrope'] text-dark-red text-bold text-3xl max-w-md">
                  $40000
                </p>
              </div>
              <div className="mt-8 md:mt-0 flex flex-col items-center">
                <div className="flex gap-4 mb-6">
                  {["Hrs", "Min", "Sec"].map((label, i) => (
                    <div key={label} className="text-center">
                      <span className="block font-['Noto_Serif'] text-2xl">
                        0{8 + i}
                      </span>
                      <span className="font-['Manrope'] text-[9px] uppercase tracking-widest text-stone-500">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="bg-gradient-to-r from-[#570000] to-[#800000] text-white px-10 py-4 rounded-sm font-['Manrope'] text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#570000]/20">
                  Join Auction
                </button>
              </div>
            </div>
          </div>

          {/* Smaller Lots Column — Arrow Carousel */}
          <div className="lg:col-span-7 relative flex flex-col gap-4">
            {/* Track */}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory h-full"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {lots.map((lot, idx) => (
                <div
                  key={idx}
                  className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-start"
                >
                  <AuctionCard
                    index={idx}
                    img={lot.img}
                    title={lot.title}
                    badge="Live"
                    price={lot.price}
                    timeLeft={`Time Left: ${lot.timeLeft}`}
                    aspectRatio="aspect-[4/5]"
                  />
                </div>
              ))}
            </div>

            {/* Controls: Arrows + Dots */}
            <div className="flex items-center justify-between mt-2 px-1">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {lots.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToIndex(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      carouselIndex === idx
                        ? "w-6 h-2 bg-[#570000]"
                        : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={carouselIndex === 0}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    carouselIndex === 0
                      ? "border-stone-200 text-stone-300 cursor-not-allowed"
                      : "border-[#570000] text-[#570000] hover:bg-red hover:text-white active:scale-95"
                  }`}
                  aria-label="Previous"
                >
                  <span className="material-symbols-outlined text-[18px]"><img src="https://www.svgrepo.com/show/382820/pointer-left.svg" alt="arrow back" className="w-8 hover:w-12"/></span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={carouselIndex === lots.length - 1}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    carouselIndex === lots.length - 1
                      ? "border-stone-200 text-stone-300 cursor-not-allowed"
                      : "border-[#570000] text-[#570000] hover:bg-red hover:text-white active:scale-95"
                  }`}
                  aria-label="Next"
                >
                  <span className="material-symbols-outlined text-[18px]"><img src="https://www.svgrepo.com/show/382819/pointer-right.svg" alt="arrow forward" className="w-8 hover:w-12"/></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeout */}
        <section className="mt-20">
          <div className="flex flex-col gap-2 mb-12">
            <div className="flex items-center gap-6">
              <h2 className="font-['Noto_Serif'] text-4xl text-red">Timeout</h2>
              <div className="h-[1px] flex-grow bg-stone-200"></div>
              <div className="dropdown dropdown-center">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn m-1 bg-dark-red text-white tracking-widest "
                >
                  Categories
                </div>
                <ul
                  tabIndex="-1"
                  className="dropdown-content menu bg-white text-dark-red rounded-box z-1 w-40 p-2 shadow-sm"
                >
                  <li>
                    <a>Electronics</a>
                  </li>
                  <li>
                    <a>Toys</a>
                  </li>
                  <li>
                    <a>Collectibles</a>
                  </li>
                  <li>
                    <a>Home and living</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-label text-s text-primary ml-1">
              Time Left: less than 1 hour
            </div>
          </div>
          <div className="text-l font-semibold uppercase tracking-widest text-stone-600 mb-10 block">
            Category :
          </div>
        </section>

        {/* Asymmetric Product Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 text-left">
          {[
            {
              cat: "Horology",
              title: "Patek Philippe Nautilus",
              price: "$124,000",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAab-LYdPJSgC7hQNOR9TGu6dsPEbTfVW-E-3uaIrFj7yYPs6_-ma7InV3JqnW86lz8ErR7ce1qwfqxJIHRVRI7Pa05roiqhNjr1r6mqsTL2t2HIxrjBS1fGtSaXWyTmNIE7e6zz-eQH1Be1IPnZuYG0M6wdTURCMZw-tXOKkfIzHHLoiqeimjQBaAaqOVtnZQns2kfxqBv6bnIDha9D0tfqMQCVYp0rmXvHzGfOKPdH_cxY_6_lVpzYpIJ8Zkh2npJcWs45RRDI3yA",
            },
            {
              cat: "Jewelry",
              title: "Emerald Teardrop Earrings",
              price: "$45,000",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuAvm231iZr8vdySwn-kOte7I8FAZWRf2jZRJkTU8vDYgXT3E9mZGbYFV9_CAgoW6N6XLV15_OHLq06GyCMtN-3m6Jv2skc2A0d7g0wRFi0ITn8-TEMrEsrZxdNb-sEaizWSQ4T5g7t5BLzDsrqzZkuSWOKPcEA20CeRV-lD33sBnIgp8cUssEmNGamSEKA_et0tRwgUINpvfweDHNgvZ5Ztmhlx1McOG-JLoqD3IckFZ4I3OJ7oc5fw8PVy6tNSGkZWDRdUuYwaLa",
              shift: true,
            },
            {
              cat: "Design",
              title: "Brutalist Alabaster Vessel",
              price: "$8,200",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuARgMOZMmzVNrDz1n4_Y5rdr1efWWp2BraAsv5xYqoW7kg9mWdx_UwxsYkxHwgVqs4I3pIKE-2_7BkqdrNrRjum_NLj_mBIwtTlLt943SCKE2yD606kQOZHLNcnnSCt3q7rrwBcddrnFZEDj0kxiGHqkwn7nx1qNwgq3JLBx-Ys3SEzv0--LZq5t_oOOl9PXcuzAtbueKCwW12TH7332Xig3N-MuWUxtdFnFC5p44AuyQHijUsyH7Zr3uqJFBbtXpO9N82ftUSQr2fO",
            },
          ].map((product, i) => (
            <AuctionCard
              key={i}
              index={i}
              img={product.img}
              title={product.title}
              cat={product.cat}
              badge={`Lot #${812 + i}`}
              price={product.price}
              timeLeft="Time Left: 50m 30s"
              aspectRatio="aspect-[4/5]"
              onJoin={() => {}}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default AuctionPage;
