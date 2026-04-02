import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative w-full h-[600px] md:h-[600px] flex flex-col md:flex-row overflow-hidden">
      {/* Background Image (Mobile) / Left Side (Desktop) */}
      <div className="absolute inset-0 md:relative md:w-1/2 h-full bg-[#f8f8f8] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent z-10"></div>
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src="https://gclzimnozcxsttgghooh.supabase.co/storage/v1/object/public/Product%20Images/man-green-blazer-wearing-gold-colored-lion-ring-watch%20(1).jpg"
            alt="Premium Lifestyle Watch"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Mobile Overlay for text contrast */}
          <div className="absolute inset-0 bg-black/30 md:bg-black/5 z-10"></div>
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full h-full md:w-1/2 flex items-center px-6 md:px-16 md:bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="max-w-lg md:text-left"
        >
          <p className="text-brand md:text-brand font-bold text-sm uppercase tracking-wider mb-2 drop-shadow-sm md:drop-shadow-none">
            Exclusive Deal 40% Off
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6 text-white md:text-gray-900 drop-shadow-md md:drop-shadow-none">
            Your one-stop shop for <span className="text-brand">premium</span> tech and audio gear.
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-brand text-white px-8 py-4 rounded-full font-semibold shadow-xl shadow-brand/20 hover:bg-brand/90 transition-colors"
            >
              Order Now
            </motion.button>
            <button className="flex items-center space-x-2 font-medium text-white md:text-dusty-olive hover:text-brand transition-colors group drop-shadow-sm md:drop-shadow-none">
              <span>Learn More</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
