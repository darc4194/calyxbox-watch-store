import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'h1',
    title: 'Calyx Pro Headphones',
    price: 35000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    category: 'Headphones',
    stock: 24,
    description: "Engineered for the sonic purist, the Calyx Pro Headphones deliver a studio-grade soundstage in a portable form factor. Featuring active noise cancellation and 40-hour battery life.",
    colors: ["#020402", "#3c433b", "#647a67"],
    sizes: ["Standard"],
    specs: [
      { label: "Driver", value: "40mm Beryllium" },
      { label: "Battery", value: "40 Hours" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Charging", value: "USB-C Fast Charge" }
    ],
    reviews: [
      { author: "James K.", text: "The noise cancellation is actually better than my Sony's. Incredible value.", rating: 5 },
      { author: "Sarah M.", text: "Beautiful design, though the case is a bit larger than expected.", rating: 4 }
    ],
    thumbnails: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1599666505327-7758b44a9985?auto=format&fit=crop&q=80&w=400"
    ],
    ethos: {
      text: "The Calyx Pro represents the pinnacle of audio engineering. Every component, from the beryllium drivers to the memory foam cushions, is selected for acoustic transparency and long-term comfort.",
      highlights: [
        { label: "Acoustics", value: "Beryllium Drivers" },
        { label: "Comfort", value: "Memory Foam Cushions" }
      ]
    }
  },
  {
    id: 'w1',
    title: 'Calyx Watch Series 5',
    price: 45000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    category: 'Watches',
    stock: 15,
    description: "The ultimate companion for your health and productivity. Featuring a sapphire crystal display and aerospace-grade titanium casing.",
    colors: ["#1f241f", "#c5efcb", "#647a67"],
    sizes: ["40mm", "44mm"],
    specs: [
      { label: "Display", value: "LTPO OLED Retina" },
      { label: "Battery", value: "Up to 36 hours" },
      { label: "Water Resistance", value: "50m (WR50)" },
      { label: "Chip", value: "S9 SiP with 64-bit dual-core" }
    ],
    reviews: [
      { author: "Michael T.", text: "The titanium finish is stunning. Best smartwatch I've owned.", rating: 5 }
    ],
    thumbnails: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1544117518-30dd5ff7a4b0?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400"
    ],
    ethos: {
      text: "The Series 5 is more than a watch; it's a statement of precision. Built with aerospace-grade titanium and a sapphire crystal face, it's designed to withstand the rigors of daily life.",
      highlights: [
        { label: "Durability", value: "Aerospace Titanium" },
        { label: "Display", value: "Sapphire Crystal" }
      ]
    }
  },
  {
    id: 'e1',
    title: 'Calyx Buds Ultra',
    price: 22000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1588423770574-91993ca06f42?auto=format&fit=crop&q=80&w=800',
    category: 'Earpods',
    stock: 42,
    description: "Immersive sound, zero distractions. Our most advanced earpods yet with adaptive noise cancellation and spatial audio.",
    colors: ["#ffffff", "#020402", "#c5efcb"],
    sizes: ["Standard"],
    specs: [
      { label: "Audio", value: "Spatial Audio" },
      { label: "ANC", value: "Adaptive Hybrid" },
      { label: "Battery", value: "6 Hours (30 total)" },
      { label: "Connectivity", value: "Bluetooth 5.3" }
    ],
    reviews: [
      { author: "Emma L.", text: "The spatial audio is a game changer for movies.", rating: 5 }
    ],
    thumbnails: [
      "https://images.unsplash.com/photo-1588423770574-91993ca06f42?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400"
    ],
    ethos: {
      text: "Buds Ultra redefine personal audio. By combining custom-built drivers with advanced computational audio, we've created an experience that feels like you're in the front row.",
      highlights: [
        { label: "Audio", value: "Computational Spatial" },
        { label: "ANC", value: "Adaptive Hybrid" }
      ]
    }
  },
  {
    id: 'w2',
    title: 'Calyx Classic Silver',
    price: 28000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
    category: 'Watches',
    stock: 8,
    description: "Timeless design meets modern technology. A classic analog look with smart features hidden beneath the surface.",
    colors: ["#E6E6E6", "#020402"],
    sizes: ["42mm"],
    specs: [
      { label: "Material", value: "316L Stainless Steel" },
      { label: "Glass", value: "Mineral Crystal" },
      { label: "Movement", value: "Swiss Quartz Hybrid" },
      { label: "Battery", value: "2 Years" }
    ],
    ethos: {
      text: "The Classic Silver is for those who appreciate the heritage of watchmaking but don't want to sacrifice modern convenience.",
      highlights: [
        { label: "Material", value: "Stainless Steel" },
        { label: "Movement", value: "Hybrid Quartz" }
      ]
    }
  }
];
