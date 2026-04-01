import { Phone, X } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-carbon-black text-white pt-16 pb-8 relative overflow-hidden">
      {/* Black Friday Specials Floating Badge */}
      <div className="absolute top-4 right-4 md:right-12 z-10">
        <motion.div 
          initial={{ rotate: 5, scale: 0.9 }}
          animate={{ rotate: -5, scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
          className="bg-brand text-white p-4 rounded-xl shadow-2xl max-w-[180px] relative"
        >
          <div className="absolute -top-2 -right-2 bg-white text-brand rounded-full p-1 shadow-md">
            <X size={12} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Black Friday</p>
          <p className="text-lg font-black uppercase leading-none mb-2">Specials</p>
          <p className="text-xs font-medium mb-1">From Ksh 649</p>
          <p className="text-[10px] underline cursor-pointer">Click to view</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div className="space-y-6">
            <div className="text-xl font-bold tracking-tighter">
              CALYX<span className="text-brand">BOX</span>
            </div>
            <p className="text-dusty-olive text-sm leading-relaxed max-w-md">
              Premium tech accessories for the modern lifestyle. Quality, style, and performance in every box. Your achievement deserves to be celebrated in style.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Company</h4>
            <ul className="space-y-4 text-sm text-dusty-olive">
              <li><a href="#" className="hover:text-brand transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Privacy policy</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Get in touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-dusty-olive">
                <Phone size={18} className="text-dusty-olive/60" />
                <span>+254-798-800-060</span>
              </div>
              <a 
                href="#" 
                className="flex items-center space-x-3 text-sm text-dusty-olive hover:text-brand transition-colors"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                  alt="WhatsApp" 
                  className="w-5 h-5 opacity-60"
                />
                <span>WhatsApp Group</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-[10px] text-dusty-olive/60">
          <div>Copyright 2026 © Autumn Agency. All Rights Reserved.</div>
          <button 
            onClick={onAdminClick}
            className="hover:text-brand transition-colors uppercase tracking-widest font-bold"
          >
            Admin Access
          </button>
        </div>
      </div>
    </footer>
  );
}
