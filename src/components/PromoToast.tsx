import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function PromoToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-24 right-6 z-40 w-80 glass p-4 rounded-xl shadow-xl flex items-start space-x-4"
        >
          <div className="flex-1">
            <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Flash Sale</p>
            <p className="text-sm font-semibold mb-3">Get 10% off your first order!</p>
            <button className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-brand/90 transition-colors">
              Shop Now
            </button>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
