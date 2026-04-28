import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AuctionCard — reusable card ที่ใช้ Framer Motion
 *
 * Props:
 *   img        — URL รูปภาพ
 *   title      — ชื่อสินค้า
 *   cat        — หมวดหมู่ (optional)
 *   badge      — ข้อความใน badge เช่น "Live" หรือ "Lot #812"
 *   price      — ราคาปัจจุบัน string เช่น "$18,200"
 *   timeLeft   — string เช่น "59m 18s"
 *   onJoin     — function เมื่อกดปุ่ม Join
 *   index      — index สำหรับ stagger entrance animation
 *   aspectRatio — tailwind class เช่น "aspect-[4/5]" (default)
 */
const AuctionCard = ({
  img,
  title,
  description,
  cat,
  badge = "Live",
  price,
  timeLeft,
  auctionDetail,
  onJoin,
  index = 0,
  aspectRatio = "aspect-[4/5]",
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="w-full flex flex-col cursor-pointer"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      {/* ── Flip Container ─────────────────────────────────────────────── */}
      <div
        className="relative w-full"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <motion.div
          className="relative w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── FRONT ─────────────────────────────────────────────── */}
          <div
            className={`relative overflow-hidden rounded-2xl ${aspectRatio} w-full`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {img && (
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover"
              />
              // <ProductImageSlide images={img} />
            )}

            {/* Dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Badge */}
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse block" />
              <span className="font-['Manrope'] text-[9px] uppercase tracking-widest text-[#570000] font-bold">
                {badge}
              </span>
            </div>

            {/* Bottom hint */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
              <span className="text-white/50 text-[10px] font-['Manrope'] tracking-widest uppercase">
                hover to reveal
              </span>
            </div>
          </div>

          {/* ── BACK ──────────────────────────────────────────────── */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-2xl ${aspectRatio} w-full flex flex-col justify-between p-6`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundColor: "#f7f7f7",
              // background: "linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #570000 100%)",
            }}
          >
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-20" // ปรับความจางที่นี่ (0-100)
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <div className="relative z-10">
              {/* {cat && (
                <p className="text-black text-[10px] uppercase tracking-widest font-['Manrope'] mb-2">
                  {cat}
                </p>
              )}
              <h3 className="font-['Noto_Serif'] text-2xl text-dark-red leading-snug mb-4">
                {title}
              </h3> */}
              <p className="text-grey text-[10px] uppercase tracking-widest font-['Manrope'] mb-1">
                product detail
              </p>
              <p className="font-['Noto_Serif'] text-lg text-gray/50 leading-snug mb-4 font-extralight">{description}</p>
              <div className="h-px bg-white/20 mb-4" />
              {/* <p className="text-black text-[10px] uppercase tracking-widest font-['Manrope'] mb-1">
                Current Bid
              </p>
              <p className="font-['Noto_Serif'] text-3xl text-red font-bold tracking-wide">
                {price}
              </p> */}
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              {/* {timeLeft && (
                <p className="text-white/60 text-[11px] font-['Manrope'] tracking-widest">
                  {timeLeft}
                </p>
              )} */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin?.();
                }}
                className="w-full bg-white text-[#570000] font-['Manrope'] text-xs uppercase tracking-widest py-3 rounded-sm font-bold shadow-xl hover:bg-dark-red hover:text-white transition-colors"
              >
                Join Auction →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Info below card ────────────────────────────────────────────── */}
      <div className="mt-4 px-3 flex justify-between items-start">
        <div className="flex flex-col flex-1 min-w-0">
          {cat && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1 block">
              {cat}
            </span>
          )}
          <h3 className="font-['Noto_Serif'] text-lg leading-snug text-[#1c1b1b] truncate mb-2 hover:text-2xl hover:text-dark-red"
            onClick={(e) => {
              e.stopPropagation();
              onJoin?.();
            }}>
            {title}
          </h3>
          {timeLeft && (
            <span className="text-[11px] text-[#570000] mt-1.5 font-['Manrope'] tracking-wide">
              {timeLeft}
            </span>
          )}
        </div>
        {auctionDetail && (
          <div className="text-right shrink-0">
            <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">
              Current Bid
            </p>
            <p className="font-['Noto_Serif'] text-lg text-[#800000] font-semibold tracking-wider">
              {auctionDetail.startingPrice}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuctionCard;
