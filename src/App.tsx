import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import PromoToast from './components/PromoToast';
import ChatBubble from './components/ChatBubble';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import ProductPage from './components/ProductPage';
import ThankYouView from './components/ThankYouView';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { PRODUCTS as STATIC_PRODUCTS } from './constants';
import { Product, CartItem, Category } from './types';
import { adminService } from './services/adminService';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      adminService.getProducts(),
      adminService.getCategories()
    ]);
    
    // Merge fetched products with static ones for a richer experience during initial setup
    // but prioritize fetched products
    const allProducts = [...fetchedProducts];
    
    // Only add static products if they don't exist in the fetched list (by title to avoid duplicates)
    STATIC_PRODUCTS.forEach(sp => {
      if (!allProducts.find(p => p.title === sp.title)) {
        allProducts.push(sp);
      }
    });

    setProducts(allProducts);
    setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
      { id: '1', name: 'Watches', subcategories: [] },
      { id: '2', name: 'Headphones', subcategories: [] },
      { id: '3', name: 'Earpods', subcategories: [] }
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData().then(() => {
      // Seed subcategories if they don't exist
      adminService.seedSubcategories();
    });
  }, []);

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
    setCartItems([{ ...product, quantity: 1 }]);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    if (currentView === 'home' || currentView === 'shop') return products;
    if (currentView === 'admin') return [];
    return products.filter(p => p.category.toLowerCase() === currentView.toLowerCase());
  }, [currentView, products]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setCurrentView('thank-you');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {currentView !== 'admin' && (
        <Header 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onViewCart={() => setIsCartOpen(true)}
          onNavigate={handleNavigate}
          categories={categories}
        />
      )}

      <main className="flex-1">
        {currentView === 'admin' ? (
          session ? (
            <AdminDashboard 
              onBack={() => handleNavigate('home')} 
              onProductsChange={loadData}
            />
          ) : (
            <AdminLogin onBack={() => handleNavigate('home')} onSuccess={() => setCurrentView('admin')} />
          )
        ) : currentView === 'checkout' ? (
          <CheckoutView 
            items={cartItems} 
            onBack={() => setCurrentView('home')} 
            onComplete={handleOrderComplete}
          />
        ) : currentView === 'thank-you' ? (
          <ThankYouView onContinueShopping={() => handleNavigate('home')} />
        ) : currentView === 'product' && selectedProduct ? (
          <ProductPage 
            product={selectedProduct}
            allProducts={products}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            onNavigateToProduct={handleProductClick}
          />
        ) : (
          <>
            {currentView === 'home' && <Hero />}
            
            <div className="max-w-7xl mx-auto px-4 pt-16 -mb-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter border-b-4 border-brand inline-block pb-1">
                Featured Products
              </h2>
            </div>

            <ProductGrid 
              title=""
              products={filteredProducts}
              onAddToCart={addToCart}
              onBuyNow={buyNow}
              onProductClick={handleProductClick}
              isLoading={isLoading}
            />

            {currentView === 'home' && <FeaturedSection />}
          </>
        )}
      </main>

      {currentView !== 'admin' && (
        <>
          <Footer onAdminClick={() => handleNavigate('admin')} />
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
        </>
      )}
    </div>
  );
}
