import { ArrowLeft, CreditCard, Truck, ShieldCheck, Smartphone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent, ChangeEvent } from 'react';
import { CartItem } from '../types';
import { supabase } from '../lib/supabase';

interface CheckoutViewProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutView({ items, onBack, onComplete }: CheckoutViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<FormState>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 500;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.address.trim()) newErrors.address = 'Address/Area is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create order entries for each item in the cart
      const orderEntries = items.map(item => ({
        customer_name: form.fullName,
        phone: form.phone,
        email: form.email,
        city: form.city,
        address: form.address,
        country: 'Kenya',
        product_name: item.title,
        product_variant: (item.sizes && item.sizes.length > 0) ? item.sizes[0] : 'Default',
        quantity: item.quantity,
        notes: form.notes,
        status: 'pending'
      }));

      const { error } = await supabase
        .from('orders')
        .insert(orderEntries);

      if (error) throw error;

      setSubmitStatus('success');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err) {
      console.error('Error submitting order:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-500 hover:text-brand transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Shop</span>
      </button>

      <AnimatePresence>
        {submitStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-medium">Something went wrong. Please try again or contact support.</span>
          </motion.div>
        )}
        {submitStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center space-x-3 text-green-600"
          >
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">Order placed successfully! Redirecting...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center space-x-3 uppercase tracking-tight">
                <Truck size={24} className="text-brand" />
                <span>Shipping Details</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60">Step 1 of 2</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Full Names</label>
                <input 
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="e.g. John Doe" 
                  className={`w-full p-5 bg-light-grey border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium ${errors.fullName ? 'ring-2 ring-red-500' : ''}`} 
                />
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Phone Number</label>
                <input 
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  type="tel" 
                  placeholder="e.g. 0712 345 678" 
                  className={`w-full p-5 bg-light-grey border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium ${errors.phone ? 'ring-2 ring-red-500' : ''}`} 
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{errors.phone}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Email Address</label>
                <input 
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  type="email" 
                  placeholder="e.g. john@example.com" 
                  className={`w-full p-5 bg-light-grey border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium ${errors.email ? 'ring-2 ring-red-500' : ''}`} 
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Shipping City</label>
                <input 
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="e.g. Nairobi" 
                  className={`w-full p-5 bg-light-grey border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium ${errors.city ? 'ring-2 ring-red-500' : ''}`} 
                />
                {errors.city && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Town / Area</label>
                <input 
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="e.g. Westlands" 
                  className={`w-full p-5 bg-light-grey border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium ${errors.address ? 'ring-2 ring-red-500' : ''}`} 
                />
                {errors.address && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{errors.address}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Order Notes (Optional)</label>
                <textarea 
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Deliver to the back gate" 
                  rows={3}
                  className="w-full p-5 bg-light-grey border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium resize-none" 
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center space-x-3 uppercase tracking-tight">
                <CreditCard size={24} className="text-brand" />
                <span>Payment Method</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60">Step 2 of 2</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setPaymentMethod('mpesa')}
                className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'mpesa' ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-brand/50'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'mpesa' ? 'bg-brand text-white' : 'bg-light-grey text-dusty-olive'}`}>
                    <Smartphone size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm uppercase tracking-tight">M-Pesa</p>
                    <p className="text-[10px] text-dusty-olive">Pay via mobile money</p>
                  </div>
                </div>
                {paymentMethod === 'mpesa' && <CheckCircle2 size={20} className="text-brand" />}
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-brand/50'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-brand text-white' : 'bg-light-grey text-dusty-olive'}`}>
                    <CreditCard size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm uppercase tracking-tight">Credit Card</p>
                    <p className="text-[10px] text-dusty-olive">Visa, Mastercard, Amex</p>
                  </div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 size={20} className="text-brand" />}
              </button>
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="bg-light-grey p-8 rounded-[32px] sticky top-32">
            <h3 className="text-xl font-bold mb-8 uppercase tracking-tight">Order Summary</h3>
            <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-tight truncate">{item.title}</p>
                    <p className="text-[10px] text-dusty-olive">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-xs font-bold">
                    Ksh {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-8 space-y-4 mb-10">
              <div className="flex justify-between text-xs">
                <span className="text-dusty-olive font-medium uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-dusty-olive font-medium uppercase tracking-widest">Shipping</span>
                <span className="font-bold">Ksh {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl pt-6 border-t border-gray-200">
                <span className="font-bold uppercase tracking-tight">Total</span>
                <span className="font-bold text-brand">Ksh {total.toLocaleString()}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-brand text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm Order</span>
              )}
            </motion.button>
            
            <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] text-dusty-olive/60 font-bold uppercase tracking-widest">
              <ShieldCheck size={14} />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
