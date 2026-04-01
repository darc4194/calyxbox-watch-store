import { Search, User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Category } from '../types';

interface HeaderProps {
  cartCount: number;
  onViewCart: () => void;
  onNavigate: (view: string) => void;
  categories?: Category[];
}

const MEGA_MENU_DATA: Record<string, any> = {
  'Watches': {
    sections: [
      {
        title: 'Categories',
        items: ['Smart Watches', 'Analog Watches', 'Mens Watches', 'Ladies Watches']
      }
    ],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    promo: 'Upto 50% Off Luxury Watches'
  },
  'Headphones': {
    sections: [
      {
        title: 'Type',
        items: ['Wireless', 'Gaming', 'Sports']
      }
    ],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    promo: 'New Arrivals: Calyx Pro Series'
  },
  'Earpods': {
    sections: [
      {
        title: 'Brands',
        items: ['Apple', 'Galaxy Buds', 'Oraimo']
      }
    ],
    image: 'https://images.unsplash.com/photo-1588423770574-91993ca06f42?auto=format&fit=crop&q=80&w=600',
    promo: 'Limited Edition Colors Available'
  }
};

export default function Header({ cartCount, onViewCart, onNavigate, categories = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const handleNavClick = (view: string) => {
    onNavigate(view.toLowerCase());
    setIsMenuOpen(false);
    setActiveMegaMenu(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm font-sans">
      {/* Top Bar - Macy's Style Promo */}
      <div className="bg-brand text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2 text-center">
        Free Shipping on Orders Over Ksh 50,000 | Limited Time Offers
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 md:pt-6 md:pb-4 flex flex-col justify-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div 
            className="text-2xl md:text-4xl font-black tracking-tighter cursor-pointer flex items-center"
            onClick={() => handleNavClick('home')}
          >
            <span className="text-brand">★</span>
            <span className="ml-1">CALYX</span>
            <span className="font-light">BOX</span>
          </div>

          {/* Search Bar - Macy's Style */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Search for products, brands and more"
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-6 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex flex-col items-center cursor-pointer group">
              <User size={24} className="group-hover:text-brand transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Sign In</span>
            </div>

            <div 
              className="flex flex-col items-center cursor-pointer group relative"
              onClick={onViewCart}
            >
              <div className="relative">
                <ShoppingCart size={24} className="group-hover:text-brand transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Bag</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation with Mega Menu */}
        <nav className="hidden lg:flex items-center justify-center space-x-10 mt-6">
          <button
            onClick={() => handleNavClick('home')}
            className="text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors border-b-2 border-transparent hover:border-brand pb-1"
          >
            Home
          </button>
          
          {categories.map((category) => (
            <div 
              key={category.id}
              className="relative group py-2"
              onMouseEnter={() => setActiveMegaMenu(category.name)}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                onClick={() => handleNavClick(category.name)}
                className="text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors flex items-center space-x-1 border-b-2 border-transparent group-hover:border-brand pb-1"
              >
                <span>{category.name}</span>
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {activeMegaMenu === category.name && MEGA_MENU_DATA[category.name] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full w-[800px] bg-white shadow-2xl border-t border-gray-100 p-8 flex space-x-12 z-[100] rounded-b-2xl"
                  >
                    <div className="flex-1 grid grid-cols-3 gap-8">
                      {MEGA_MENU_DATA[category.name].sections.map((section: any, idx: number) => (
                        <div key={idx} className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand border-b border-gray-100 pb-2">
                            {section.title}
                          </h4>
                          <ul className="space-y-2">
                            {section.items.map((item: string, i: number) => (
                              <li key={i}>
                                <button 
                                  onClick={() => handleNavClick(`${category.name}/${item}`)}
                                  className="text-xs text-gray-600 hover:text-brand hover:translate-x-1 transition-all"
                                >
                                  {item}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    
                    {/* Image & Promo Section */}
                    <div className="w-64 space-y-4">
                      <div className="aspect-[4/5] rounded-xl overflow-hidden relative group/img">
                        <img 
                          src={MEGA_MENU_DATA[category.name].image} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                            {MEGA_MENU_DATA[category.name].promo}
                          </p>
                        </div>
                      </div>
                      <button className="w-full py-3 border border-charcoal text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all">
                        Shop All {category.name}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <button
            onClick={() => handleNavClick('shop')}
            className="text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors border-b-2 border-transparent hover:border-brand pb-1"
          >
            Sale & Clearance
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="text-xl font-black tracking-tighter">
                <span className="text-brand">★</span> CALYXBOX
              </div>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {categories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand">{category.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {MEGA_MENU_DATA[category.name]?.sections.map((section: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{section.title}</p>
                        <ul className="space-y-1">
                          {section.items.slice(0, 3).map((item: string, i: number) => (
                            <li key={i} className="text-xs text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 space-y-4">
              <button className="w-full py-4 bg-brand text-white font-bold uppercase tracking-widest text-xs rounded-xl">
                Sign In / Join
              </button>
              <button className="w-full py-4 border border-gray-200 font-bold uppercase tracking-widest text-xs rounded-xl">
                Customer Service
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
