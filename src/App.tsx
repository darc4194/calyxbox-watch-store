import { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import PromoToast from './components/PromoToast';
import ChatBubble from './components/ChatBubble';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const buyNow = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    if (currentView === 'home' || currentView === 'shop') return PRODUCTS;
    const category = currentView.charAt(0).toUpperCase() + currentView.slice(1);
    return PRODUCTS.filter(p => p.category.toLowerCase() === currentView.toLowerCase());
  }, [currentView]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onViewCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {currentView === 'checkout' ? (
          <CheckoutView 
            items={cartItems} 
            onBack={() => setCurrentView('home')} 
          />
        ) : (
          <>
            {currentView === 'home' && <Hero />}
            
            <ProductGrid 
              title={currentView === 'home' ? 'featured products' : `featured ${currentView}`}
              products={filteredProducts}
              onAddToCart={addToCart}
              onBuyNow={buyNow}
            />

            {currentView === 'home' && <FeaturedSection />}
          </>
        )}
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <PromoToast />
      <ChatBubble />
    </div>
  );
}
