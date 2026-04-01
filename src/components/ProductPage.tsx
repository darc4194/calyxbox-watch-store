import { motion } from 'motion/react';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, ChevronRight, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import ProductCard from './ProductCard';
import { useState } from 'react';

interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onNavigateToProduct: (product: Product) => void;
}

export default function ProductPage({ product, allProducts, onAddToCart, onBuyNow, onNavigateToProduct }: ProductPageProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [mainImage, setMainImage] = useState(product.image);

  const recommendedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-dusty-olive/60">
        <span>Shop</span>
        <ChevronRight size={10} />
        <span>{product.category}</span>
        <ChevronRight size={10} />
        <span className="text-charcoal">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:flex lg:space-x-20">
        {/* Left Column: Images & Left-side Info */}
        <div className="lg:w-3/5">
          <div className="sticky top-32">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/5] bg-light-grey rounded-3xl overflow-hidden mb-6"
            >
              <img 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4 mb-12">
              {product.thumbnails?.map((thumb, i) => (
                <button 
                  key={i}
                  onClick={() => setMainImage(thumb)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === thumb ? 'border-brand' : 'border-transparent'}`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

            {/* Technical Specifications (Desktop) */}
            <div className="hidden lg:block mt-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 border-b border-gray-100 pb-4">Technical Specifications</h2>
              <div className="grid grid-cols-1 gap-y-6">
                {product.specs?.map((spec, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-gray-50 pb-2">
                    <span className="text-[10px] font-bold text-dusty-olive/60 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-medium text-charcoal text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews (Desktop) */}
            <div className="hidden lg:block mt-20">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 border-b border-gray-100 pb-4">Customer Reviews</h2>
              <div className="space-y-10">
                {product.reviews?.map((review, i) => (
                  <div key={i} className="max-w-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{review.author}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={12} className={j < review.rating ? "fill-brand text-brand" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-dusty-olive italic leading-relaxed">"{review.text}"</p>
                  </div>
                ))}
                <button className="text-[10px] font-bold uppercase tracking-widest border-b border-charcoal pb-1 hover:text-brand hover:border-brand transition-colors">
                  View All Reviews
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:w-2/5 mt-12 lg:mt-0">
          <div className="lg:pt-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 uppercase leading-none">
              {product.title}
            </h1>
            <p className="text-dusty-olive text-sm mb-6 leading-relaxed max-w-md">
              {product.description}
            </p>
            
            <div className="flex items-center space-x-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-brand text-brand" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-xs font-bold text-dusty-olive/60 uppercase tracking-widest">({product.reviews?.length || 0} Reviews)</span>
            </div>

            <div className="flex items-baseline space-x-3 mb-10">
              <span className="text-3xl font-bold">Ksh {product.price.toLocaleString()}</span>
              <span className="text-xs text-dusty-olive/60 line-through">Ksh {(product.price * 1.2).toLocaleString()}</span>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 block mb-4">Choose Color</span>
              <div className="flex space-x-3">
                {product.colors?.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-brand p-0.5' : 'border-transparent'}`}
                  >
                    <div className="w-full h-full rounded-full border border-gray-100" style={{ backgroundColor: color }}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60">Select Size</span>
                <button className="text-[10px] font-bold uppercase tracking-widest underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg border text-xs font-bold transition-all ${selectedSize === size ? 'bg-brand text-white border-brand' : 'bg-white text-charcoal border-gray-100 hover:border-brand'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 mb-10">
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-light-grey text-charcoal py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-gray-200 transition-colors"
                >
                  <ShoppingBag size={20} />
                  <span>Add to Bag</span>
                </motion.button>
                <button className="w-16 h-16 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Heart size={24} className="text-charcoal" />
                </button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBuyNow(product)}
                className="w-full bg-brand text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand/20 flex items-center justify-center space-x-3"
              >
                <span>Buy Now</span>
              </motion.button>
            </div>

            {/* Info Cards */}
            <div className="space-y-4 mb-20">
              <div className="flex items-center space-x-4 p-4 bg-light-grey rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Truck size={20} className="text-brand" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Free Delivery</p>
                  <p className="text-[10px] text-dusty-olive">Orders over Ksh 50,000 qualify for free delivery.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-light-grey rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <RotateCcw size={20} className="text-brand" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">30 Days Return</p>
                  <p className="text-[10px] text-dusty-olive">Easy returns within 30 days of purchase.</p>
                </div>
              </div>
            </div>

            {/* Ethos Sidebar (Desktop) */}
            {product.ethos && (
              <div className="hidden lg:block p-10 bg-carbon-black rounded-[40px] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">The Ethos</h3>
                  <p className="text-sm text-dusty-olive leading-relaxed mb-10">
                    {product.ethos.text}
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    {product.ethos.highlights.map((highlight, i) => (
                      <div key={i}>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-brand block mb-2">{highlight.label}</span>
                        <p className="text-xs font-medium">{highlight.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technical Specs & Reviews (Mobile) */}
      <div className="lg:hidden px-4 py-12 space-y-16">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b border-gray-100 pb-4">Technical Specifications</h2>
          <div className="space-y-4">
            {product.specs?.map((spec, i) => (
              <div key={i} className="flex justify-between items-baseline border-b border-gray-50 pb-2">
                <span className="text-[10px] font-bold text-dusty-olive/60 uppercase tracking-widest">{spec.label}</span>
                <span className="text-xs font-medium text-charcoal">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b border-gray-100 pb-4">Customer Reviews</h2>
          <div className="space-y-8">
            {product.reviews?.map((review, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{review.author}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={10} className={j < review.rating ? "fill-brand text-brand" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-dusty-olive italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
        {product.ethos && (
          <div className="p-8 bg-carbon-black rounded-[32px] text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">The Ethos</h3>
              <p className="text-sm text-dusty-olive leading-relaxed mb-8">
                {product.ethos.text}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {product.ethos.highlights.map((highlight, i) => (
                  <div key={i}>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand block mb-1">{highlight.label}</span>
                    <p className="text-xs font-medium">{highlight.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand/10 rounded-full blur-3xl"></div>
          </div>
        )}
      </div>

      {/* Recommended Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 border-t border-gray-100">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand mb-2 block">Curated Selection</span>
            <h2 className="text-3xl font-bold tracking-tight uppercase leading-none">Recommended For You</h2>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest border-b border-charcoal pb-1 hover:text-brand hover:border-brand transition-colors">
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((p) => (
            <div key={p.id} onClick={() => onNavigateToProduct(p)} className="cursor-pointer">
              <ProductCard 
                product={p} 
                onAddToCart={onAddToCart} 
                onBuyNow={onBuyNow} 
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
