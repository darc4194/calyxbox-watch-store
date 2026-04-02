import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURED_CARDS = [
  {
    title: "Money-Saving Bundles",
    description: "Get the best value with our curated tech sets.",
    image: "https://gclzimnozcxsttgghooh.supabase.co/storage/v1/object/public/Product%20Images/watch%20coll%20(1).jpg",
    color: "bg-tea-green-900"
  },
  {
    title: "Customized Watch Straps",
    description: "Personalize your style with premium materials.",
    image: "https://gclzimnozcxsttgghooh.supabase.co/storage/v1/object/public/Product%20Images/still-life-tech-device%20(1).jpg",
    color: "bg-dusty-olive-900"
  },
  {
    title: "Limited Edition Earpods",
    description: "Exclusive designs for the true audiophile.",
    image: "https://gclzimnozcxsttgghooh.supabase.co/storage/v1/object/public/Product%20Images/26763361_2111.i211.036.F.m012.c9.headphones%20black%20wireless%20realistic%20(1).jpg",
    color: "bg-carbon-black-900"
  }
];

export default function FeaturedSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      {FEATURED_CARDS.map((card, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -10 }}
          className={`${card.color} rounded-2xl p-8 flex flex-col h-[500px] relative overflow-hidden group`}
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">{card.title}</h3>
            <p className="text-dusty-olive mb-8 max-w-[200px]">{card.description}</p>
            <button className="bg-white text-brand px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-sm hover:bg-brand hover:text-white transition-all">
              <span>Buy now</span>
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-500">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-contain object-bottom"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      ))}
    </section>
  );
}
