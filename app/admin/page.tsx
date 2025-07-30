
import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Users, Package, TrendingUp, Eye, Plus, Search, Bell, Settings, BarChart3, Filter, Download, Edit, Trash2, Star, ArrowUp, ArrowDown, Calendar, CreditCard, Truck, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => (
  <div className={`${color} border-4 border-black p-6 hover:translate-x-2 hover:translate-y-2 transition-transform duration-200 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
    <div className="flex items-center justify-between mb-4">
      <div className="text-3xl font-black">{icon}</div>
      <div className={`px-3 py-1 ${change.startsWith('+') ? 'bg-green-400' : 'bg-red-400'} border-2 border-black font-bold text-sm`}>
        {change}
      </div>
    </div>
    <h3 className="font-black text-lg mb-2 uppercase">{title}</h3>
    <p className="text-2xl font-black">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [todaysSales, setTodaysSales] = useState(2847);
  const [revenue, setRevenue] = useState(18420);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Live updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTodaysSales(prev => prev + 1);
        setRevenue(prev => prev + Math.floor(Math.random() * 100) + 20);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: 'Today Sales', value: todaysSales.toString(), change: '+15%', icon: <ShoppingCart />, color: 'bg-green-400' },
    { title: 'Revenue', value: `$${revenue.toLocaleString()}`, change: '+8%', icon: <DollarSign />, color: 'bg-yellow-400' },
    { title: 'Customers', value: '1,234', change: '+12%', icon: <Users />, color: 'bg-blue-400' },
    { title: 'Products', value: '456', change: '+3%', icon: <Package />, color: 'bg-purple-400' }
  ];

  const users = [
    { id: 1, name: 'John Smith', email: 'john@example.com', orders: 12, spent: '$1,240', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', orders: 8, spent: '$890', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 15, spent: '$2,100', status: 'vip', joined: '2023-12-10' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', orders: 3, spent: '$350', status: 'new', joined: '2024-07-01' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', orders: 0, spent: '$0', status: 'inactive', joined: '2024-06-15' },
  ];

  const orders = [
    { id: '#B001', customer: 'John Smith', products: 3, amount: '$299', status: 'shipped', date: '2024-07-30', payment: 'paid' },
    { id: '#B002', customer: 'Sarah Wilson', products: 1, amount: '$79', status: 'processing', date: '2024-07-30', payment: 'paid' },
    { id: '#B003', customer: 'Mike Johnson', products: 5, amount: '$549', status: 'delivered', date: '2024-07-29', payment: 'paid' },
    { id: '#B004', customer: 'Emma Davis', products: 2, amount: '$149', status: 'pending', date: '2024-07-29', payment: 'pending' },
    { id: '#B005', customer: 'Tom Brown', products: 1, amount: '$99', status: 'cancelled', date: '2024-07-28', payment: 'refunded' },
  ];

  const products = [
    { id: 1, name: 'Wireless Headphones', price: '$99', stock: 23, sold: 145, rating: 4.8, category: 'Electronics' },
    { id: 2, name: 'Smart Watch', price: '$199', stock: 12, sold: 89, rating: 4.6, category: 'Electronics' },
    { id: 3, name: 'Phone Case', price: '$29', stock: 156, sold: 234, rating: 4.2, category: 'Accessories' },
    { id: 4, name: 'Laptop Stand', price: '$79', stock: 0, sold: 67, rating: 4.7, category: 'Office' },
    { id: 5, name: 'Bluetooth Speaker', price: '$149', stock: 34, sold: 123, rating: 4.5, category: 'Electronics' },
  ];

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
  ];

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'shipped': case 'delivered': case 'paid': return 'bg-green-400';
      case 'processing': case 'pending': return 'bg-yellow-400';
      case 'inactive': case 'cancelled': case 'refunded': return 'bg-red-400';
      case 'vip': return 'bg-purple-400';
      case 'new': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': case 'paid': return <CheckCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'processing': case 'pending': return <Clock size={16} />;
      case 'cancelled': case 'refunded': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <section>
        <h2 className="text-3xl font-black mb-6 uppercase tracking-wider border-l-4 border-black pl-4">
          TODAY'S OVERVIEW
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black text-white border-4 border-black p-6">
          <h3 className="text-xl font-black mb-4 uppercase tracking-wide text-yellow-400">
            QUICK ACTIONS
          </h3>
          <div className="space-y-3">
            {[
              { label: 'ADD PRODUCT', color: 'bg-green-500', icon: <Plus size={20} /> },
              { label: 'VIEW ORDERS', color: 'bg-blue-500', icon: <Eye size={20} /> },
              { label: 'CUSTOMERS', color: 'bg-purple-500', icon: <Users size={20} /> },
              { label: 'ANALYTICS', color: 'bg-orange-500', icon: <BarChart3 size={20} /> },
              { label: 'SETTINGS', color: 'bg-gray-600', icon: <Settings size={20} /> }
            ].map((action, index) => (
              <button key={index} className={`w-full ${action.color} text-white p-3 border-2 border-white font-black hover:translate-x-1 hover:translate-y-1 transition-transform duration-200 flex items-center space-x-2`}>
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border-4 border-black p-6">
          <h3 className="text-xl font-black mb-4 uppercase tracking-wide border-b-2 border-black pb-2">
            SALES CHART
          </h3>
          <div className="h-64 bg-gray-800 border-2 border-black flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="text-green-400 mx-auto mb-4" />
              <p className="text-white font-bold">SALES TRENDING UP</p>
              <p className="text-gray-400 text-sm">+23% from last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = (data: any[], columns: string[], title: string, actions: boolean = true) => (
    <div className="bg-white border-4 border-black">
      <div className="border-b-4 border-black p-6 bg-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-wide">{title}</h2>
          <div className="flex space-x-3">
            <button className="bg-blue-500 text-white px-4 py-2 border-2 border-black font-black hover:translate-x-1 hover:translate-y-1 transition-transform duration-200 flex items-center space-x-2">
              <Filter size={16} />
              <span>FILTER</span>
            </button>
            <button className="bg-green-500 text-white px-4 py-2 border-2 border-black font-black hover:translate-x-1 hover:translate-y-1 transition-transform duration-200 flex items-center space-x-2">
              <Download size={16} />
              <span>EXPORT</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              {actions && <th className="p-4 text-left font-black uppercase">SELECT</th>}
              {columns.map((column) => (
                <th key={column} className="p-4 text-left font-black uppercase tracking-wide">
                  {column}
                </th>
              ))}
              {actions && <th className="p-4 text-left font-black uppercase">ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className={`border-b-2 border-gray-200 hover:bg-gray-50 ${selectedRows.includes(row.id) ? 'bg-yellow-100' : ''}`}>
                {actions && (
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      className="w-4 h-4 border-2 border-black"
                    />
                  </td>
                )}
                {Object.entries(row)
                  .filter(([key]) => key !== 'id')
                  .map(([key, value]) => (
                    <td key={key} className="p-4 font-bold">
                      {key === 'status' || key === 'payment' ? (
                        <span className={`px-3 py-1 border-2 border-black font-black text-sm uppercase flex items-center space-x-1 ${getStatusColor(String(value))} w-fit`}>
                          {getStatusIcon(String(value))}
                          <span>{String(value)}</span>
                        </span>
                      ) : key === 'rating' ? (
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <span>{typeof value === 'number' || typeof value === 'string' ? value : ''}</span>
                        </div>
                      ) : key === 'stock' ? (
                        <span className={`font-black ${Number(value) === 0 ? 'text-red-500' : Number(value) < 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {typeof value === 'number' || typeof value === 'string' ? value : ''}
                        </span>
                      ) : (
                        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
                          ? String(value)
                          : null
                      )}
                    </td>
                  ))}
                {actions && (
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="bg-blue-400 text-black p-2 border-2 border-black hover:translate-x-1 hover:translate-y-1 transition-transform duration-200">
                        <Edit size={16} />
                      </button>
                      <button className="bg-red-400 text-black p-2 border-2 border-black hover:translate-x-1 hover:translate-y-1 transition-transform duration-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedRows.length > 0 && (
        <div className="border-t-4 border-black p-4 bg-yellow-100">
          <div className="flex items-center justify-between">
            <span className="font-black">{selectedRows.length} items selected</span>
            <div className="flex space-x-2">
              <button className="bg-red-500 text-white px-4 py-2 border-2 border-black font-black hover:translate-x-1 hover:translate-y-1 transition-transform duration-200">
                DELETE SELECTED
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 border-2 border-black font-black hover:translate-x-1 hover:translate-y-1 transition-transform duration-200">
                BULK EDIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black uppercase tracking-wider border-l-4 border-green-500 pl-4">
        ANALYTICS DASHBOARD
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Conversion Rate', value: '3.24%', change: '+0.8%', icon: <TrendingUp />, color: 'bg-green-400' },
          { title: 'Avg Order Value', value: '$127', change: '+12%', icon: <DollarSign />, color: 'bg-blue-400' },
          { title: 'Cart Abandonment', value: '68.5%', change: '-5%', icon: <ShoppingCart />, color: 'bg-red-400' },
          { title: 'Return Rate', value: '2.1%', change: '-0.3%', icon: <Package />, color: 'bg-yellow-400' }
        ].map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-4 border-black p-6">
          <h3 className="text-xl font-black mb-4 uppercase border-b-2 border-black pb-2">TOP CATEGORIES</h3>
          <div className="space-y-4">
            {[
              { name: 'Electronics', sales: '$12,340', percentage: 45, color: 'bg-blue-400' },
              { name: 'Accessories', sales: '$8,750', percentage: 32, color: 'bg-green-400' },
              { name: 'Office', sales: '$4,200', percentage: 15, color: 'bg-yellow-400' },
              { name: 'Home', sales: '$2,180', percentage: 8, color: 'bg-purple-400' }
            ].map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-black uppercase">{category.name}</p>
                  <p className="text-sm font-bold text-gray-600">{category.sales}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-3 bg-gray-200 border border-black">
                    <div className={`h-full ${category.color}`} style={{width: `${category.percentage}%`}}></div>
                  </div>
                  <span className="font-black text-sm w-8">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6">
          <h3 className="text-xl font-black mb-4 uppercase border-b-2 border-black pb-2">TRAFFIC SOURCES</h3>
          <div className="space-y-4">
            {[
              { source: 'Direct', visitors: '4,230', percentage: 38 },
              { source: 'Google', visitors: '3,120', percentage: 28 },
              { source: 'Social Media', visitors: '2,450', percentage: 22 },
              { source: 'Email', visitors: '1,340', percentage: 12 }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-2 border-gray-200 hover:border-black transition-colors">
                <div>
                  <p className="font-black uppercase">{source.source}</p>
                  <p className="text-sm font-bold text-gray-600">{source.visitors} visitors</p>
                </div>
                <div className="text-2xl font-black">{source.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-mono">
      {/* Header */}
      <header className="bg-black text-white border-b-4 border-black p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-black uppercase tracking-wider">⚡ E-STORE ADMIN</h1>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-white border-2 border-white">
              <input
                type="text"
                placeholder="Search everything..."
                className="px-4 py-2 text-black font-bold placeholder-gray-600 focus:outline-none w-64"
              />
              <button className="bg-yellow-400 text-black p-2 border-l-2 border-black hover:bg-yellow-500">
                <Search size={20} />
              </button>
            </div>
            <button className="bg-red-500 text-white p-2 border-2 border-white hover:bg-red-600 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center border border-black">8</span>
            </button>
            <button className="bg-blue-400 text-black px-4 py-2 border-2 border-white font-black hover:bg-blue-500">
              ADMIN
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 text-white border-b-4 border-black p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-2 overflow-x-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 font-black uppercase tracking-wide border-2 transition-all duration-200 whitespace-nowrap ${
                  activeSection === item.id
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-transparent text-white border-transparent hover:bg-white hover:text-black hover:border-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Render Active Section */}
        {activeSection === 'overview' && renderOverview()}
        
        {activeSection === 'orders' && renderTable(
          orders, 
          ['Order ID', 'Customer', 'Products', 'Amount', 'Status', 'Date', 'Payment'], 
          'ORDER MANAGEMENT'
        )}
        
        {activeSection === 'products' && renderTable(
          products, 
          ['Name', 'Price', 'Stock', 'Sold', 'Rating', 'Category'], 
          'PRODUCT INVENTORY'
        )}
        
        {activeSection === 'customers' && renderTable(
          users, 
          ['Name', 'Email', 'Orders', 'Spent', 'Status', 'Joined'], 
          'CUSTOMER DATABASE'
        )}
        
        {activeSection === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default Dashboard;