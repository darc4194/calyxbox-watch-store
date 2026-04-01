import { supabase } from '../lib/supabase';
import { Product, Order, Customer, Voucher, Category, Subcategory } from '../types';

export const adminService = {
  // Analytics
  async getDashboardStats() {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status, created_at');
    
    const { count: activeCustomers, error: customersError } = await supabase
      .from('orders')
      .select('email', { count: 'exact', head: true });

    if (ordersError || customersError) {
      console.error('Error fetching dashboard stats:', ordersError || customersError);
      return { totalSales: 0, revenue: 0, activeOrders: 0, customerCount: 0 };
    }

    const revenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'shipped').length;

    return {
      totalSales: orders.length,
      revenue,
      activeOrders,
      customerCount: activeCustomers || 0
    };
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data as Order[];
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  },

  // Products
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

  async updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      return false;
    }

    return true;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  },

  // Categories
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
  },

  // Customers (Derived from orders for simplicity)
  async getCustomers(): Promise<Customer[]> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      console.error('Error fetching customer data:', error);
      return [];
    }

    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
      const existing = customerMap.get(order.email);
      if (existing) {
        existing.total_orders += 1;
        existing.total_spent += order.total_amount || 0;
        if (new Date(order.created_at) > new Date(existing.last_order_at)) {
          existing.last_order_at = order.created_at;
        }
      } else {
        customerMap.set(order.email, {
          id: order.email,
          name: order.customer_name,
          email: order.email,
          phone: order.phone,
          total_orders: 1,
          total_spent: order.total_amount || 0,
          last_order_at: order.created_at
        });
      }
    });

    return Array.from(customerMap.values());
  },

  // Vouchers
  async getVouchers(): Promise<Voucher[]> {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*');

    if (error) {
      console.error('Error fetching vouchers:', error);
      return [];
    }

    return data as Voucher[];
  },

  async addVoucher(voucher: Omit<Voucher, 'id'>): Promise<boolean> {
    const { error } = await supabase
      .from('vouchers')
      .insert([voucher]);

    if (error) {
      console.error('Error adding voucher:', error);
      return false;
    }

    return true;
  }
};
