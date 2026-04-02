import ProductCard from './ProductCard';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onProductClick: (product: Product) => void;
  isLoading?: boolean;
}

export default function ProductGrid({ title, products, onAddToCart, onBuyNow, onProductClick, isLoading }: ProductGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h2 className="text-xl font-light lowercase tracking-wide inline-block relative">
          {title}
          <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-brand"></span>
        </h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer">
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart} 
                onBuyNow={onBuyNow}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
