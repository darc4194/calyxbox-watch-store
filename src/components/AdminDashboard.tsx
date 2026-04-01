import { 
  ArrowLeft, Plus, Trash2, Save, X, Loader2, Image as ImageIcon, Tag, 
  LayoutDashboard, Package, List, LogOut, ShoppingBag, Users, BarChart3, 
  Settings, Truck, Ticket, Search, Filter, ChevronRight, MoreVertical,
  CheckCircle2, Clock, TruckIcon, XCircle, RefreshCcw, Bell, Moon, Sun,
  Smartphone, Monitor, CreditCard, DollarSign, TrendingUp, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, FormEvent, useMemo } from 'react';
import { Product, Order, Customer, Voucher, Category, Subcategory } from '../types';
import { adminService } from '../services/adminService';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onBack: () => void;
  onProductsChange?: () => void;
}

type Tab = 'dashboard' | 'orders' | 'products' | 'customers' | 'marketing' | 'shipping' | 'settings' | 'users';

export default function AdminDashboard({ onBack, onProductsChange }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appName, setAppName] = useState('Calyxbox Admin');
  const [tempColor, setTempColor] = useState('');
  const [tempSize, setTempSize] = useState('');
  
  // Data State
  const [stats, setStats] = useState({ totalSales: 0, revenue: 0, activeOrders: 0, customerCount: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form States
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<Omit<Product, 'id'>>({
    title: '', price: 0, rating: 5, image: '', category: '', subcategory: '', description: '',
    colors: [], sizes: [], thumbnails: [], specs: [], stock: 0,
    ethos: { text: '', highlights: [] }
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    const [fetchedStats, fetchedOrders, fetchedProducts, fetchedCategories, fetchedCustomers, fetchedVouchers] = await Promise.all([
      adminService.getDashboardStats(),
      adminService.getOrders(),
      adminService.getProducts(),
      adminService.getCategories(),
      adminService.getCustomers(),
      adminService.getVouchers()
    ]);

    setStats(fetchedStats);
    setOrders(fetchedOrders);
    setProducts(fetchedProducts);
    setCategories(fetchedCategories);
    setCustomers(fetchedCustomers);
    setVouchers(fetchedVouchers);
    
    if (fetchedCategories.length > 0 && !productFormData.category) {
      setProductFormData(prev => ({ ...prev, category: fetchedCategories[0].name }));
    }
    setIsLoading(false);
  };

  const addThumbnail = () => {
    setProductFormData(prev => ({
      ...prev,
      thumbnails: [...(prev.thumbnails || []), '']
    }));
  };

  const updateThumbnail = (index: number, value: string) => {
    const newThumbnails = [...(productFormData.thumbnails || [])];
    newThumbnails[index] = value;
    setProductFormData(prev => ({ ...prev, thumbnails: newThumbnails }));
  };

  const removeThumbnail = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      thumbnails: (prev.thumbnails || []).filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    if (!tempColor || productFormData.colors?.includes(tempColor)) return;
    setProductFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), tempColor]
    }));
    setTempColor('');
  };

  const removeColor = (color: string) => {
    setProductFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c !== color)
    }));
  };

  const addSize = () => {
    if (!tempSize || productFormData.sizes?.includes(tempSize)) return;
    setProductFormData(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), tempSize]
    }));
    setTempSize('');
  };

  const removeSize = (size: string) => {
    setProductFormData(prev => ({
      ...prev,
      sizes: (prev.sizes || []).filter(s => s !== size)
    }));
  };

  const addSpec = () => {
    setProductFormData(prev => ({
      ...prev,
      specs: [...(prev.specs || []), { label: '', value: '' }]
    }));
  };

  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...(productFormData.specs || [])];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setProductFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const removeSpec = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== index)
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onBack();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const success = await adminService.updateOrderStatus(orderId, status);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    
    const cleanedData = {
      ...productFormData,
      thumbnails: productFormData.thumbnails?.filter(t => t.trim() !== '') || [],
      // Remove ethos if it's empty to avoid database errors if column doesn't exist
      ethos: (productFormData.ethos?.text || productFormData.ethos?.highlights?.length) ? productFormData.ethos : undefined
    };

    if (editingProductId) {
      const success = await adminService.updateProduct(editingProductId, cleanedData);
      if (success) {
        setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...cleanedData } : p));
        setIsAddingProduct(false);
        setEditingProductId(null);
        setProductFormData({
          title: '', price: 0, rating: 5, image: '', category: categories[0]?.name || '', subcategory: '', description: '',
          colors: [], sizes: [], thumbnails: [], specs: [], stock: 0,
          ethos: { text: '', highlights: [] }
        });
        if (onProductsChange) onProductsChange();
      } else {
        setFormError('Failed to update product.');
      }
    } else {
      const result = await adminService.addProduct(cleanedData);
      if (result) {
        setProducts([result, ...products]);
        setIsAddingProduct(false);
        setProductFormData({
          title: '', price: 0, rating: 5, image: '', category: categories[0]?.name || '', subcategory: '', description: '',
          colors: [], sizes: [], thumbnails: [], specs: [], stock: 0,
          ethos: { text: '', highlights: [] }
        });
        if (onProductsChange) onProductsChange();
      } else {
        setFormError('Failed to publish product. Please check your database connection and try again.');
      }
    }
    setIsLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setIsLoading(true);
    const success = await adminService.deleteProduct(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (onProductsChange) onProductsChange();
    }
    setIsLoading(false);
  };

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsLoading(true);
    const result = await adminService.addCategory(newCategory.trim());
    if (result) {
      setCategories([...categories, result].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory('');
      setIsAddingCategory(false);
      if (onProductsChange) onProductsChange();
    }
    setIsLoading(false);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            o.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // UI Components
  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        {trend && (
          <div className={`flex items-center space-x-1 text-[10px] font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex bg-[#FBFBFD] ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-40 transition-all"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tighter"
            >
              CALYX<span className="text-brand">BOX</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isOpen={isSidebarOpen} />
          <SidebarItem icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} isOpen={isSidebarOpen} badge={stats.activeOrders} />
          <SidebarItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} isOpen={isSidebarOpen} />
          <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} isOpen={isSidebarOpen} />
          <SidebarItem icon={Ticket} label="Marketing" active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} isOpen={isSidebarOpen} />
          <SidebarItem icon={Truck} label="Shipping" active={activeTab === 'shipping'} onClick={() => setActiveTab('shipping')} isOpen={isSidebarOpen} />
          <div className="pt-4 pb-2 border-t border-gray-50 mt-4">
            <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isOpen={isSidebarOpen} />
            <SidebarItem icon={Users} label="Staff" active={activeTab === 'users'} onClick={() => setActiveTab('users')} isOpen={isSidebarOpen} />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold uppercase tracking-widest text-[10px] ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-full transition-colors lg:hidden">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-bold tracking-tight capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand w-64 transition-all"
              />
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-full relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-50 rounded-full"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-brand/20">
              GM
            </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <Loader2 className="animate-spin text-brand" size={48} />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Syncing with cloud...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard title="Total Revenue" value={`Ksh ${stats.revenue.toLocaleString()}`} icon={DollarSign} trend={12} color="bg-blue-500" />
                      <StatCard title="Active Orders" value={stats.activeOrders} icon={Activity} trend={-5} color="bg-orange-500" />
                      <StatCard title="Total Sales" value={stats.totalSales} icon={ShoppingBag} trend={8} color="bg-brand" />
                      <StatCard title="Customers" value={stats.customerCount} icon={Users} trend={15} color="bg-purple-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Recent Orders */}
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold italic serif">Recent Orders</h3>
                          <button onClick={() => setActiveTab('orders')} className="text-brand text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
                        </div>
                        <div className="space-y-6">
                          {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                  <ShoppingBag size={20} className="text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{order.customer_name}</p>
                                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{order.product_name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm">Ksh {order.total_amount}</p>
                                <StatusBadge status={order.status} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Products */}
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold italic serif">Top Products</h3>
                          <button onClick={() => setActiveTab('products')} className="text-brand text-xs font-bold uppercase tracking-widest hover:underline">Manage</button>
                        </div>
                        <div className="space-y-6">
                          {products.slice(0, 5).map(product => (
                            <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                              <div className="flex items-center space-x-4">
                                <img src={product.image} alt={product.title} className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                  <p className="font-bold text-sm">{product.title}</p>
                                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{product.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm">Ksh {product.price}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${product.stock < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                  {product.stock} in stock
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex bg-white p-1 rounded-2xl border border-gray-100">
                          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(status => (
                            <button 
                              key={status}
                              onClick={() => setStatusFilter(status)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Order ID</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Customer</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Product</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Amount</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</th>
                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-6 font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</td>
                              <td className="px-8 py-6">
                                <p className="font-bold text-sm">{order.customer_name}</p>
                                <p className="text-xs text-gray-400">{order.email}</p>
                              </td>
                              <td className="px-8 py-6">
                                <p className="font-bold text-sm">{order.product_name}</p>
                                <p className="text-xs text-gray-400">{order.product_variant}</p>
                              </td>
                              <td className="px-8 py-6 font-bold text-sm">Ksh {order.total_amount}</td>
                              <td className="px-8 py-6">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center space-x-2">
                                  <select 
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                    className="bg-gray-50 border-none rounded-lg text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-brand"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="returned">Returned</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => setIsAddingProduct(true)}
                          className="bg-brand text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center space-x-2 shadow-lg shadow-brand/20"
                        >
                          <Plus size={16} />
                          <span>New Product</span>
                        </button>
                        <button 
                          onClick={() => setIsAddingCategory(true)}
                          className="bg-white border border-gray-100 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center space-x-2 hover:bg-gray-50 transition-colors"
                        >
                          <Tag size={16} />
                          <span>Add Category</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  const { id, ...rest } = product;
                                  setProductFormData(rest);
                                  setEditingProductId(id);
                                  setIsAddingProduct(true);
                                }}
                                className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 hover:text-brand shadow-sm"
                              >
                                <Save size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-50 shadow-sm"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-bold text-sm truncate">{product.title}</h4>
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-brand">Ksh {product.price}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${product.stock < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                {product.stock} in stock
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'customers' && (
                  <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Customer</th>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Contact</th>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Orders</th>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Total Spent</th>
                          <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Last Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {customers.map(customer => (
                          <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-gray-400">
                                  {customer.name.charAt(0)}
                                </div>
                                <p className="font-bold text-sm">{customer.name}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm">{customer.email}</p>
                              <p className="text-xs text-gray-400">{customer.phone}</p>
                            </td>
                            <td className="px-8 py-6 font-bold text-sm">{customer.total_orders}</td>
                            <td className="px-8 py-6 font-bold text-sm text-brand">Ksh {customer.total_spent.toLocaleString()}</td>
                            <td className="px-8 py-6 text-xs text-gray-400">
                              {new Date(customer.last_order_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-2xl space-y-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                      <h3 className="text-xl font-bold italic serif">General Settings</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Application Name</label>
                          <input 
                            type="text" 
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Store Currency</label>
                          <select className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium">
                            <option>Ksh (Kenyan Shilling)</option>
                            <option>USD (US Dollar)</option>
                          </select>
                        </div>
                      </div>
                      <button className="bg-brand text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand/20">
                        Save Changes
                      </button>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                      <h3 className="text-xl font-bold italic serif">Appearance</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <Moon size={20} className="text-gray-600" />
                          <div>
                            <p className="font-bold text-sm">Dark Mode</p>
                            <p className="text-xs text-gray-400">Toggle system-wide dark theme</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-brand' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingProduct(false)}
              className="absolute inset-0 bg-carbon-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Form Side */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold italic serif">
                    {editingProductId ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button 
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProductId(null);
                      setProductFormData({
                        title: '', price: 0, rating: 5, image: '', category: categories[0] || '', description: '',
                        colors: [], sizes: [], thumbnails: [], specs: [], stock: 0,
                        ethos: { text: '', highlights: [] }
                      });
                    }} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {formError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600">
                    <XCircle size={20} />
                    <p className="text-xs font-bold uppercase tracking-widest">{formError}</p>
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Product Title</label>
                      <input 
                        required
                        type="text" 
                        value={productFormData.title}
                        onChange={(e) => setProductFormData({...productFormData, title: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium" 
                        placeholder="e.g. Premium Wireless Headphones"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Category</label>
                      <select 
                        value={productFormData.category}
                        onChange={(e) => setProductFormData({...productFormData, category: e.target.value, subcategory: ''})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Subcategory</label>
                      <select 
                        value={productFormData.subcategory}
                        onChange={(e) => setProductFormData({...productFormData, subcategory: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium"
                      >
                        <option value="">None</option>
                        {categories.find(c => c.name === productFormData.category)?.subcategories?.map(sub => (
                          <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Price (Ksh)</label>
                      <input 
                        required
                        type="number" 
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({...productFormData, price: Number(e.target.value)})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium" 
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Initial Stock</label>
                      <input 
                        required
                        type="number" 
                        value={productFormData.stock}
                        onChange={(e) => setProductFormData({...productFormData, stock: Number(e.target.value)})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium" 
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Main Product Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="url" 
                        value={productFormData.image}
                        onChange={(e) => setProductFormData({...productFormData, image: e.target.value})}
                        className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium" 
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  {/* Product Gallery */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Gallery (Thumbnails)</h4>
                      <button 
                        type="button"
                        onClick={addThumbnail}
                        className="text-brand text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1 hover:underline"
                      >
                        <Plus size={14} />
                        <span>Add Image</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {productFormData.thumbnails?.map((thumb, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="relative flex-1">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                              type="url" 
                              value={thumb}
                              onChange={(e) => updateThumbnail(index, e.target.value)}
                              className="w-full p-3 pl-10 bg-white border-none rounded-xl focus:ring-2 focus:ring-brand transition-all text-xs" 
                              placeholder="Thumbnail URL..."
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeThumbnail(index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Variations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colors */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Color Variations</h4>
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          value={tempColor}
                          onChange={(e) => setTempColor(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                          className="flex-1 p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-brand transition-all text-xs" 
                          placeholder="e.g. #000000 or Black"
                        />
                        <button 
                          type="button"
                          onClick={addColor}
                          className="p-3 bg-brand text-white rounded-xl shadow-lg shadow-brand/20"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productFormData.colors?.map((color, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            <div 
                              className="w-3 h-3 rounded-full border border-gray-200" 
                              style={{ 
                                backgroundColor: color.startsWith('#') || color.startsWith('rgb') ? color : color.toLowerCase() 
                              }}
                            ></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{color}</span>
                            <button type="button" onClick={() => removeColor(color)} className="text-gray-400 hover:text-red-500">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Size Variations</h4>
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          value={tempSize}
                          onChange={(e) => setTempSize(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                          className="flex-1 p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-brand transition-all text-xs" 
                          placeholder="e.g. XL, 44mm, etc."
                        />
                        <button 
                          type="button"
                          onClick={addSize}
                          className="p-3 bg-brand text-white rounded-xl shadow-lg shadow-brand/20"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productFormData.sizes?.map((size, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{size}</span>
                            <button type="button" onClick={() => removeSize(size)} className="text-gray-400 hover:text-red-500">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Technical Specs */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Technical Specifications</h4>
                      <button 
                        type="button"
                        onClick={addSpec}
                        className="text-brand text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1 hover:underline"
                      >
                        <Plus size={14} />
                        <span>Add Attribute</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {productFormData.specs?.map((spec, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input 
                            type="text" 
                            value={spec.label}
                            onChange={(e) => updateSpec(index, 'label', e.target.value)}
                            className="flex-1 p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-brand transition-all text-xs" 
                            placeholder="Label (e.g. Material)"
                          />
                          <input 
                            type="text" 
                            value={spec.value}
                            onChange={(e) => updateSpec(index, 'value', e.target.value)}
                            className="flex-1 p-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-brand transition-all text-xs" 
                            placeholder="Value (e.g. Titanium)"
                          />
                          <button 
                            type="button"
                            onClick={() => removeSpec(index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Description</label>
                    <textarea 
                      required
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium min-h-[120px]" 
                      placeholder="Describe the product features and benefits..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>Publish Product</span>
                  </button>
                </form>
              </div>

              {/* Preview Side */}
              <div className="hidden md:block w-[320px] bg-gray-50 p-12 border-l border-gray-100">
                <div className="sticky top-0 space-y-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Live Preview</h3>
                  <div className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-xl">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                      {productFormData.image ? (
                        <img src={productFormData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={48} className="text-gray-200" />
                      )}
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm truncate">{productFormData.title || 'Product Title'}</h4>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-brand">Ksh {productFormData.price || '0'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {productFormData.stock || '0'} in stock
                        </p>
                      </div>

                      {/* Preview Variations */}
                      {(productFormData.colors?.length > 0 || productFormData.sizes?.length > 0) && (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          {productFormData.colors?.length > 0 && (
                            <div className="flex gap-1">
                              {productFormData.colors.map((c, i) => (
                                <div 
                                  key={i} 
                                  className="w-4 h-4 rounded-full border border-gray-200" 
                                  style={{ backgroundColor: c.startsWith('#') || c.startsWith('rgb') ? c : c.toLowerCase() }}
                                ></div>
                              ))}
                            </div>
                          )}
                          {productFormData.sizes?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {productFormData.sizes.map((s, i) => (
                                <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 bg-gray-100 rounded uppercase tracking-tighter">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Preview Thumbnails */}
                      {productFormData.thumbnails?.length > 0 && (
                        <div className="flex gap-2 pt-4 border-t border-gray-100 overflow-x-auto pb-2">
                          {productFormData.thumbnails.filter(t => t).map((t, i) => (
                            <img key={i} src={t} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingCategory(false)}
              className="absolute inset-0 bg-carbon-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 md:p-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold italic serif">New Category</h2>
                <button onClick={() => setIsAddingCategory(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Category Name</label>
                  <input 
                    required
                    type="text" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium" 
                    placeholder="e.g. Accessories"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  <span>Add Category</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function SidebarItem({ icon: Icon, label, active, onClick, isOpen, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${active ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-500 hover:bg-gray-50'}`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
        {isOpen && <span className="text-xs font-bold uppercase tracking-widest">{label}</span>}
      </div>
      {isOpen && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white text-brand' : 'bg-brand/10 text-brand'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const styles = {
    pending: 'bg-orange-50 text-orange-600 border-orange-100',
    shipped: 'bg-blue-50 text-blue-600 border-blue-100',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
    returned: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
}

function MenuIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}
