import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[500px] md:h-[600px] flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 bg-[#f8f8f8] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent"></div>
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full h-full z-10"
        >
          <img
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1200"
            alt="Premium Lifestyle Watch"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </motion.div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full md:w-1/2 bg-white flex items-center px-6 py-12 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="max-w-lg"
        >
          <p className="text-brand font-bold text-sm uppercase tracking-wider mb-2">Exclusive Deal 40% Off</p>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
            Your one-stop shop for <span className="text-brand">premium</span> tech and audio gear.
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-brand text-white px-8 py-4 rounded-full font-semibold shadow-xl shadow-brand/20 hover:bg-tea-green-100 transition-colors"
            >
              Order Now
            </motion.button>
            <button className="flex items-center space-x-2 font-medium text-dusty-olive hover:text-brand transition-colors group">
              <span>Learn More</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
