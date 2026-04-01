import { motion } from 'motion/react';
import { Category } from '../types';

interface CategorySectionProps {
  categories: Category[];
  onCategoryClick: (categoryName: string) => void;
}

export default function CategorySection({ categories, onCategoryClick }: CategorySectionProps) {
  // Filter out categories that don't have a good image or just use placeholders
  const categoryImages: Record<string, string> = {
    'Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    'Earpods': 'https://images.unsplash.com/photo-1588423770574-91993ca06f42?auto=format&fit=crop&q=80&w=800'
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter border-b-4 border-brand inline-block pb-1">
          Shop By Category
        </h2>
        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand transition-colors">
          View All Categories
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.slice(0, 3).map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onCategoryClick(category.name)}
            className="group cursor-pointer relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <img 
              src={categoryImages[category.name] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <p className="text-brand text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Explore</p>
              <h3 className="text-white text-3xl font-black uppercase tracking-tighter mb-4 group-hover:translate-x-2 transition-transform">
                {category.name}
              </h3>
              <div className="w-12 h-1 bg-brand group-hover:w-full transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
