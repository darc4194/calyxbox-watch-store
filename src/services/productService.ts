import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data as Product[];
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data.map(c => c.name);
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return null;
    }

    return data as Product;
  },

  async addCategory(name: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .insert([{ name }]);

    if (error) {
      console.error('Error adding category:', error);
      return false;
    }

    return true;
  }
};
