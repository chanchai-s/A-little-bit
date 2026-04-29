import { Link, NavLink } from 'react-router'
import auction_sold from '../../assets/auction_sold.jpeg'
import useUserStore from "../../stores/user.store.js";
import { motion } from 'framer-motion';

function WelcomeUser() {
  const { user } = useUserStore();

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
            src={auction_sold}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent"></div>
        </motion.div>
        
        <div className="flex justify-between items-start gap-70 w-full">
          <motion.div 
            className="relative z-10 max-w-4xl ml-4 md:ml-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={itemVariants} className="font-['Manrope'] uppercase tracking-[0.3em] text-[#800000] mb-4 block text-sm font-bold">
              Exclusive Member
            </motion.span>
            <motion.h1 variants={itemVariants} className="font-['Noto_Serif'] text-5xl md:text-7xl text-[#1c1b1b] leading-tight">
              Welcome back to
            </motion.h1>
            <motion.h1 variants={itemVariants} className="font-['Noto_Serif'] text-5xl md:text-7xl bg-gradient-to-r from-[#570000] to-[#800000] bg-clip-text text-transparent leading-tight mb-6">
              A Little Bid
            </motion.h1>
            <motion.div variants={itemVariants} className="flex items-center gap-4 mt-8">
              <div className="h-[1px] w-12 bg-[#800000]"></div>
              <p className="font-['Noto_Serif'] text-3xl md:text-4xl text-[#1c1b1b] italic">
                {user?.username}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default WelcomeUser