export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  category: 'Watches' | 'Headphones' | 'Earpods';
}

export interface CartItem extends Product {
  quantity: number;
}
