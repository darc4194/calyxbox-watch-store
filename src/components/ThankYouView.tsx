import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ThankYouViewProps {
  onContinueShopping: () => void;
}

export default function ThankYouView({ onContinueShopping }: ThankYouViewProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle size={48} className="text-brand" />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-brand/20 rounded-full -z-10"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight uppercase">Order Received!</h1>
          <p className="text-dusty-olive leading-relaxed">
            Thank you for choosing Calyxbox. Your premium tech gear is being prepared for shipment. We've sent a confirmation email with your order details.
          </p>
        </div>

        <div className="bg-light-grey p-6 rounded-3xl space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-dusty-olive font-medium">Order Number</span>
            <span className="font-bold">#CX-{Math.floor(Math.random() * 1000000)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dusty-olive font-medium">Estimated Delivery</span>
            <span className="font-bold">2-3 Business Days</span>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinueShopping}
            className="w-full bg-brand text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand/20 flex items-center justify-center space-x-3"
          >
            <ShoppingBag size={20} />
            <span>Continue Shopping</span>
          </motion.button>
          
          <button 
            onClick={onContinueShopping}
            className="text-xs font-bold uppercase tracking-widest text-dusty-olive hover:text-brand transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Track your order</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
