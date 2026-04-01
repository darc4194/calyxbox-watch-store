import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  items: CartItem[];
  onBack: () => void;
}

export default function CheckoutView({ items, onBack }: CheckoutViewProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 500;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-500 hover:text-brand transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Truck size={24} className="text-brand" />
              <span>Shipping Details</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand" />
              <input type="text" placeholder="Last Name" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand" />
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border-none rounded-xl md:col-span-2 focus:ring-2 focus:ring-brand" />
              <input type="text" placeholder="Phone Number" className="w-full p-4 bg-gray-50 border-none rounded-xl md:col-span-2 focus:ring-2 focus:ring-brand" />
              <input type="text" placeholder="Street Address" className="w-full p-4 bg-gray-50 border-none rounded-xl md:col-span-2 focus:ring-2 focus:ring-brand" />
              <input type="text" placeholder="City" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand" />
              <input type="text" placeholder="Postal Code" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand" />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <CreditCard size={24} className="text-brand" />
              <span>Payment Method</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-brand rounded-xl flex flex-col items-center justify-center space-y-2 bg-brand/5">
                <span className="font-bold text-sm">M-Pesa</span>
              </button>
              <button className="p-4 border-2 border-gray-100 rounded-xl flex flex-col items-center justify-center space-y-2 hover:border-brand/50 transition-colors">
                <span className="font-bold text-sm">Credit Card</span>
              </button>
              <button className="p-4 border-2 border-gray-100 rounded-xl flex flex-col items-center justify-center space-y-2 hover:border-brand/50 transition-colors">
                <span className="font-bold text-sm">PayPal</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-2xl sticky top-32">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.title} x {item.quantity}</span>
                  <span className="font-bold">Ksh {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-6 space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold">Ksh {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg pt-4 border-t border-gray-200">
                <span className="font-bold">Total</span>
                <span className="font-bold text-brand">Ksh {total.toLocaleString()}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand text-white py-4 rounded-xl font-bold shadow-lg shadow-brand/20"
            >
              Place Order
            </motion.button>
            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400">
              <ShieldCheck size={14} />
              <span>Secure Checkout Powered by Calyxbox</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
