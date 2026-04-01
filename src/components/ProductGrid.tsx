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
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-brand" size={40} />
          <p className="text-xs font-bold uppercase tracking-widest text-dusty-olive/60">Fetching products...</p>
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
