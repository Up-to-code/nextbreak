'use client'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  BarChart2,
  Bell,
  LogOut
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #1234', time: '2 min ago', read: false },
    { id: 2, text: 'Inventory low on Product X', time: '1 hour ago', read: true }
  ])

  // Mock data
  const stats = [
    { name: 'Today Sales', value: '$2,450', change: '+12%' },
    { name: 'Total Orders', value: '184', change: '+5%' },
    { name: 'New Customers', value: '32', change: '+8%' },
    { name: 'Inventory', value: '87%', change: '-3%' }
  ]

  const recentOrders = [
    { id: '#1234', customer: 'John Doe', date: '2023-11-15', status: 'Shipped', total: '$120' },
    { id: '#1233', customer: 'Jane Smith', date: '2023-11-14', status: 'Processing', total: '$85' },
    { id: '#1232', customer: 'Bob Johnson', date: '2023-11-14', status: 'Delivered', total: '$230' }
  ]

  const toggleNotificationRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-black p-4 shadow-[0_4px_0_0_#000]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter">BRUTAL COMMERCE</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 border-4 border-black bg-white hover:bg-yellow-100">
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white"></span>
                )}
              </button>
            </div>
            
            <div className="w-10 h-10 bg-black text-white border-4 border-black flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r-4 border-black min-h-screen p-4">
          <nav className="space-y-1 mt-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 font-extrabold uppercase border-4 flex items-center gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-3 font-extrabold uppercase border-4 flex items-center gap-3 ${
                activeTab === 'products'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <Package size={18} />
              Products
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 font-extrabold uppercase border-4 flex items-center gap-3 ${
                activeTab === 'orders'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <ShoppingBag size={18} />
              Orders
            </button>
            
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full text-left px-4 py-3 font-extrabold uppercase border-4 flex items-center gap-3 ${
                activeTab === 'customers'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <Users size={18} />
              Customers
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-3 font-extrabold uppercase border-4 flex items-center gap-3 ${
                activeTab === 'analytics'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <BarChart2 size={18} />
              Analytics
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 font-extrabold uppercase border-4 flex items-center gap-3 ${
                activeTab === 'settings'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              <Settings size={18} />
              Settings
            </button>
          </nav>
          
          <button className="w-full mt-8 px-4 py-3 bg-red-500 text-white font-extrabold uppercase border-4 border-black flex items-center justify-center gap-2 hover:bg-red-600">
            <LogOut size={18} />
            Log Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2">ADMIN DASHBOARD</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                    <h3 className="font-bold text-gray-600 uppercase text-sm">{stat.name}</h3>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-2xl font-black">{stat.value}</span>
                      <span className={`text-sm font-bold ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recent Orders */}
              <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-black uppercase">RECENT ORDERS</h3>
                  <button className="px-3 py-1 bg-black text-white text-sm font-bold uppercase border-2 border-black">
                    View All
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-4 border-black">
                        <th className="text-left py-2 px-4 font-black uppercase">Order ID</th>
                        <th className="text-left py-2 px-4 font-black uppercase">Customer</th>
                        <th className="text-left py-2 px-4 font-black uppercase">Date</th>
                        <th className="text-left py-2 px-4 font-black uppercase">Status</th>
                        <th className="text-left py-2 px-4 font-black uppercase">Total</th>
                        <th className="text-left py-2 px-4 font-black uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={index} className="border-b-2 border-gray-200 hover:bg-yellow-50">
                          <td className="py-3 px-4 font-bold">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4">{order.date}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs font-bold uppercase ${
                              order.status === 'Shipped' ? 'bg-green-200 text-green-800' :
                              order.status === 'Processing' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-blue-200 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold">{order.total}</td>
                          <td className="py-3 px-4">
                            <button className="px-2 py-1 bg-black text-white text-xs font-bold uppercase border-2 border-black hover:bg-gray-800">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_#000]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase">PRODUCT MANAGEMENT</h2>
                <button className="px-4 py-2 bg-black text-white font-bold uppercase border-4 border-black hover:bg-gray-800">
                  Add Product
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-black">
                      <th className="text-left py-2 px-4 font-black uppercase">ID</th>
                      <th className="text-left py-2 px-4 font-black uppercase">Product</th>
                      <th className="text-left py-2 px-4 font-black uppercase">Stock</th>
                      <th className="text-left py-2 px-4 font-black uppercase">Price</th>
                      <th className="text-left py-2 px-4 font-black uppercase">Status</th>
                      <th className="text-left py-2 px-4 font-black uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <tr key={item} className="border-b-2 border-gray-200 hover:bg-yellow-50">
                        <td className="py-3 px-4 font-bold">#{item}00</td>
                        <td className="py-3 px-4 font-bold">Product {item}</td>
                        <td className="py-3 px-4">{Math.floor(Math.random() * 100)}</td>
                        <td className="py-3 px-4 font-bold">${(Math.random() * 100).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-bold uppercase">
                            Active
                          </span>
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button className="px-2 py-1 bg-blue-500 text-white text-xs font-bold uppercase border-2 border-black hover:bg-blue-600">
                            Edit
                          </button>
                          <button className="px-2 py-1 bg-red-500 text-white text-xs font-bold uppercase border-2 border-black hover:bg-red-600">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications Dropdown */}
          {notifications.length > 0 && (
            <div className="fixed right-4 top-20 w-72 bg-white border-4 border-black z-50 shadow-[4px_4px_0_0_#000]">
              <div className="p-3 border-b-4 border-black bg-yellow-100">
                <h3 className="font-black uppercase">NOTIFICATIONS</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b-2 border-black ${notification.read ? 'bg-white' : 'bg-yellow-50'}`}
                    onClick={() => toggleNotificationRead(notification.id)}
                  >
                    <p className="font-bold">{notification.text}</p>
                    <p className="text-xs text-gray-600">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-black text-white text-center text-sm font-bold uppercase">
                Mark All as Read
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}