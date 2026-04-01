import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export default function ProductGrid({ title, products, onAddToCart, onBuyNow }: ProductGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h2 className="text-xl font-light lowercase tracking-wide inline-block relative">
          {title}
          <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-brand"></span>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard 
              product={product} 
              onAddToCart={onAddToCart} 
              onBuyNow={onBuyNow}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
