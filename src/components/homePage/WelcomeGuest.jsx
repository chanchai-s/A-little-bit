import React from 'react'
import blackwatches from '../../assets/blackwatches.jpeg'
import {useNavigate} from "react-router"
import { motion } from 'framer-motion'

function WelcomeGuest() {
  const navigate = useNavigate();
  const hdnNavLogin=()=>{
    navigate("/login")
  }
  const hdnNavRegister=()=>{
    navigate("/register")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div>
      <section className="relative h-[80vh] min-h-[600px] flex items-center px-6 md:px-12 overflow-hidden">
        <motion.div 
          className="bg-home-bg absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            className="w-full h-full object-cover opacity-30"
            alt="expansive minimalist white gallery room"
            src={blackwatches}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent"></div>
        </motion.div>
        <motion.div 
          className="relative z-10 max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={itemVariants} className="font-['Manrope'] uppercase tracking-[0.2em] bg-gradient-to-r from-[#570000] to-[#800000] bg-clip-text text-transparent mb-4 block font-semibold text-sm">Curated Excellence</motion.span>
          <motion.h1 variants={itemVariants} className="font-['Noto_Serif'] text-6xl md:text-8xl text-[#1c1b1b] leading-tight">Join the Thrill</motion.h1>
          <motion.h1 variants={itemVariants} className="font-['Noto_Serif'] text-6xl md:text-8xl text-[#1c1b1b] leading-tight mb-10">of the Bid</motion.h1>
          <motion.div variants={itemVariants} className="flex gap-4">
            <button onClick={hdnNavRegister} className="bg-gradient-to-r from-[#570000] to-[#800000] text-white px-10 py-4 rounded-sm font-['Manrope'] uppercase tracking-widest text-xs hover:shadow-lg shadow-[#570000]/30 transition-all active:scale-95 duration-200">
              Register
            </button>
            <button onClick={hdnNavLogin} className="bg-white border border-stone-200 text-[#1c1b1b] px-10 py-4 rounded-sm font-['Manrope'] uppercase tracking-widest text-xs hover:bg-stone-50 transition-all active:scale-95 duration-200 shadow-sm">
              Login
            </button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default WelcomeGuest