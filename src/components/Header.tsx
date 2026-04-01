import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface HeaderProps {
  cartCount: number;
  onViewCart: () => void;
  onNavigate: (view: string) => void;
}

export default function Header({ cartCount, onViewCart, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Home', 'Shop', 'Watches', 'Headphones', 'Earpods', 'About Us', 'Contact'];

  const handleNavClick = (view: string) => {
    onNavigate(view.toLowerCase());
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-lg md:text-xl font-bold tracking-tighter cursor-pointer"
          onClick={() => handleNavClick('home')}
        >
          CALYX<span className="text-brand">BOX</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="text-sm font-medium hover:text-brand transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-6">
          <button className="hidden sm:block p-2 hover:bg-tea-green-900 rounded-full transition-colors">
            <Search size={20} />
          </button>

          <button className="p-2 hover:bg-tea-green-900 rounded-full transition-colors">
            <User size={20} />
          </button>
          
          {/* Mobile Cart Icon */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onViewCart}
            className="md:hidden w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center relative"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-charcoal-brown text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Desktop Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewCart}
            className="hidden md:flex bg-brand text-white px-5 py-2.5 rounded-full items-center space-x-2 font-medium shadow-lg shadow-brand/20"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-brand text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="block w-full text-left text-lg font-medium hover:text-brand transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
