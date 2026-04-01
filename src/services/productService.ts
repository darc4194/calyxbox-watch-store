import { supabase } from '../lib/supabase';
import { Product, Category, Subcategory } from '../types';

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

  async getCategories(): Promise<Category[]> {
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (catError) {
      console.error('Error fetching categories:', catError);
      return [];
    }

    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('*')
      .order('name');

    if (subError) {
      console.error('Error fetching subcategories:', subError);
      return categories.map(c => ({ ...c, subcategories: [] }));
    }

    return categories.map(category => ({
      ...category,
      subcategories: subcategories.filter(s => s.category_id === category.id)
    }));
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

  async addCategory(name: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      return null;
    }

    return data as Category;
  },

  async addSubcategory(name: string, categoryId: string): Promise<Subcategory | null> {
    const { data, error } = await supabase
      .from('subcategories')
      .insert([{ name, category_id: categoryId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding subcategory:', error);
      return null;
    }

    return data as Subcategory;
  }
};
