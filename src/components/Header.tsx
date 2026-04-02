import { Search, User, ShoppingCart, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { Category, Subcategory } from '../types';

interface NavItem {
  name: string;
  view: string;
  subcategories?: Subcategory[];
}

interface HeaderProps {
  cartCount: number;
  onViewCart: () => void;
  onNavigate: (view: string) => void;
  categories?: Category[];
  isTransparent?: boolean;
}

export default function Header({ cartCount, onViewCart, onNavigate, categories = [], isTransparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  const baseNavItems: NavItem[] = [
    { name: 'Home', view: 'home' },
    { name: 'Shop', view: 'shop' }
  ];
  
  const footerNavItems: NavItem[] = [
    { name: 'About Us', view: 'about' },
    { name: 'Contact', view: 'contact' }
  ];

  // Hardcoded fallback to ensure requested categories always appear
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Watches', subcategories: [
      { id: 's1', name: 'Smart Watches', category_id: '1' },
      { id: 's2', name: 'Analog Watches', category_id: '1' },
      { id: 's3', name: 'Mens Watches', category_id: '1' },
      { id: 's4', name: 'Ladies Watches', category_id: '1' }
    ]},
    { id: '2', name: 'Headphones', subcategories: [
      { id: 's5', name: 'Wireless', category_id: '2' },
      { id: 's6', name: 'Gaming', category_id: '2' },
      { id: 's7', name: 'Sports', category_id: '2' }
    ]},
    { id: '3', name: 'Earpods', subcategories: [
      { id: 's8', name: 'Apple', category_id: '3' },
      { id: 's9', name: 'GalaxyBuds', category_id: '3' },
      { id: 's10', name: 'Oraimo', category_id: '3' }
    ]}
  ];

  const navItems: NavItem[] = [
    ...baseNavItems,
    ...displayCategories.map(c => ({ name: c.name, view: c.name.toLowerCase(), subcategories: c.subcategories })),
    ...footerNavItems
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view.toLowerCase());
    setIsMenuOpen(false);
    setHoveredCategory(null);
  };

  const activeItem = navItems.find(item => item.name === hoveredCategory);

  const headerClasses = isTransparent 
    ? "absolute top-0 left-0 z-50 w-full bg-transparent border-none lg:sticky lg:bg-white lg:border-b lg:border-gray-100 lg:shadow-sm"
    : "sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm";

  const textClasses = isTransparent 
    ? "text-white lg:text-gray-900" 
    : "text-gray-900";

  return (
    <header 
      className={headerClasses}
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className={`text-lg md:text-xl font-bold tracking-tighter cursor-pointer ${textClasses}`}
          onClick={() => handleNavClick('home')}
        >
          CALYX<span className="text-brand">BOX</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 h-full">
          {navItems.map((item) => (
            <div 
              key={item.name} 
              className="h-full flex items-center"
              onMouseEnter={() => setHoveredCategory(item.name)}
            >
              <button
                onClick={() => handleNavClick(item.view)}
                className={`text-sm font-medium transition-all py-2 h-full relative flex items-center ${
                  hoveredCategory === item.name ? 'text-brand' : 'text-gray-700 hover:text-brand'
                }`}
              >
                {item.name}
                {hoveredCategory === item.name && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                  />
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {hoveredCategory && activeItem && activeItem.subcategories && activeItem.subcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-50 py-12"
              onMouseEnter={() => setHoveredCategory(hoveredCategory)}
            >
              <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-12">
                {/* Subcategories Column */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold tracking-tight flex items-center group cursor-pointer" onClick={() => handleNavClick(activeItem.view)}>
                    {activeItem.name}
                    <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <div className="flex flex-col space-y-3">
                    {activeItem.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleNavClick(`${activeItem.view}/${sub.name.toLowerCase()}`)}
                        className="text-sm text-gray-500 hover:text-brand transition-colors text-left"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured Brands Column */}
                <div className="space-y-6 border-l border-gray-50 pl-12">
                  <h4 className="text-sm font-bold tracking-tight">Featured Brands</h4>
                  <div className="flex flex-col space-y-3">
                    <button className="text-sm text-gray-500 hover:text-brand transition-colors text-left">Premium Selection</button>
                    <button className="text-sm text-gray-500 hover:text-brand transition-colors text-left">New Arrivals</button>
                    <button className="text-sm text-gray-500 hover:text-brand transition-colors text-left">Best Sellers</button>
                  </div>
                </div>

                {/* Trending Column */}
                <div className="space-y-6 border-l border-gray-50 pl-12">
                  <h4 className="text-sm font-bold tracking-tight">Trending Now</h4>
                  <div className="flex flex-col space-y-3">
                    <button className="text-sm text-gray-500 hover:text-brand transition-colors text-left">Limited Edition</button>
                    <button className="text-sm text-gray-500 hover:text-brand transition-colors text-left">Exclusive Deals</button>
                    <button className="text-sm text-gray-500 hover:text-brand transition-colors text-left">Gift Ideas</button>
                  </div>
                </div>

                {/* Image/Promo Column */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <img 
                    src={`https://picsum.photos/seed/${activeItem.name.toLowerCase()}/600/450`} 
                    alt={activeItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                    <p className="text-white font-bold text-lg leading-tight">Shop the latest {activeItem.name}</p>
                    <p className="text-white/80 text-xs mt-1">Up to 30% Off</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-6">
          <button className={`hidden sm:block p-2 hover:bg-tea-green-900 rounded-full transition-colors ${textClasses}`}>
            <Search size={20} />
          </button>

          <button className={`p-2 hover:bg-tea-green-900 rounded-full transition-colors ${textClasses}`}>
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
            className={`lg:hidden p-2 hover:bg-gray-50/10 rounded-full transition-colors ${textClasses}`}
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
                <div key={item.name} className="space-y-2">
                  <button
                    onClick={() => handleNavClick(item.view)}
                    className="block w-full text-left text-lg font-medium hover:text-brand transition-colors"
                  >
                    {item.name}
                  </button>
                  {item.subcategories && item.subcategories.length > 0 && (
                    <div className="pl-4 space-y-2">
                      {item.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleNavClick(`${item.view}/${sub.name.toLowerCase()}`)}
                          className="block w-full text-left text-sm font-medium text-gray-500 hover:text-brand transition-colors"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
