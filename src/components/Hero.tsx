import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1920"
          alt="Premium Tech & Style"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r md:from-white/95 md:via-white/80 md:to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl text-center md:text-left"
        >
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-tea-green-100 md:text-brand font-bold text-sm uppercase tracking-[0.2em] mb-4"
          >
            Exclusive Deal 40% Off
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl md:text-6xl font-bold leading-tight mb-6 text-white md:text-black"
          >
            Your one-stop shop for <span className="text-tea-green-100 md:text-brand">premium</span> tech and audio gear.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-brand text-white px-10 py-4 rounded-full font-bold shadow-2xl shadow-brand/30 hover:bg-tea-green-100 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Order Now
            </motion.button>
            <button className="flex items-center space-x-2 font-bold text-white md:text-dusty-olive hover:text-brand transition-colors group uppercase tracking-wider text-sm">
              <span>Learn More</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
