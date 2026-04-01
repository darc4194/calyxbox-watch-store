export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  specs?: { label: string; value: string }[];
  reviews?: { author: string; text: string; rating: number }[];
  thumbnails?: string[];
  stock: number;
  ethos?: {
    text: string;
    highlights: { label: string; value: string }[];
  };
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  product_name: string;
  product_variant: string;
  quantity: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total_amount: number;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string;
}

export interface Voucher {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  expiry_date: string;
  is_active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
