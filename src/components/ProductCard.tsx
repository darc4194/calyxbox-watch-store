import { Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
    >
      {/* Top: Image & Wishlist */}
      <div className="relative aspect-square bg-ultra-light rounded-md mb-4 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Middle: Rating & Title */}
      <div className="mb-2">
        <h3 className="font-medium text-sm md:text-base line-clamp-1 group-hover:text-brand transition-colors mb-1">
          {product.title}
        </h3>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={10} 
                className={i < Math.floor(product.rating) ? "fill-brand text-brand" : "fill-gray-200 text-gray-200"} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Price & Buy Now */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="font-bold text-sm md:text-base">
          Ksh {product.price.toLocaleString()}
        </div>
        <button
          onClick={() => onBuyNow(product)}
          className="text-[10px] md:text-xs font-medium border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-brand hover:text-white hover:border-brand transition-all"
        >
          Buy now
        </button>
      </div>
    </motion.div>
  );
}
