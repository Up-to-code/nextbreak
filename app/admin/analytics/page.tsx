'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats, DashboardStats } from '../../../actions/actions';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getDashboardStats();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl font-bold">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Analytics</h1>
        <p className="text-gray-600">View detailed insights about your business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-black">${analytics?.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="h-12 w-12 rounded-lg border-2 border-black bg-[#FFD166] flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-black">{analytics?.totalCustomers?.toLocaleString() || '0'}</p>
            </div>
            <div className="h-12 w-12 rounded-lg border-2 border-black bg-[#06D6A0] flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-black">{analytics?.totalOrders?.toLocaleString() || '0'}</p>
            </div>
            <div className="h-12 w-12 rounded-lg border-2 border-black bg-[#118AB2] flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-black">{analytics?.conversionRate || '0%'}</p>
            </div>
            <div className="h-12 w-12 rounded-lg border-2 border-black bg-[#EF476F] flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4">Order Status Breakdown</h2>
          <div className="space-y-3">
            {analytics?.ordersByStatus && Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'in_progress' ? 'bg-yellow-500' :
                    status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                </div>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {analytics?.recentOrders?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  order.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
} 