'use client';

import { useEffect, useState } from 'react';
import { Card } from './components/card';
import { LatestOrders } from './components/orders';
import { UserStats } from './components/users';
import { ResponseRate } from './components/responses';
import { getDashboardStats, DashboardStats } from '../../actions/actions';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl font-bold">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="border-2 border-black bg-[#FF6B6B] px-4 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
            Notifications
          </button>
          <div className="h-10 w-10 rounded-full border-2 border-black bg-[#4ECDC4]"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`} 
          color="#FFD166" 
        />
        <Card 
          title="New Customers" 
          value={stats?.totalCustomers?.toLocaleString() || '0'} 
          color="#06D6A0" 
        />
        <Card 
          title="Order Volume" 
          value={stats?.totalOrders?.toLocaleString() || '0'} 
          color="#118AB2" 
        />
        <Card 
          title="Conversion Rate" 
          value={stats?.conversionRate || '0%'} 
          color="#EF476F" 
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LatestOrders orders={stats?.recentOrders || []} />
        </div>
        
        <div className="space-y-6">
          <UserStats users={stats?.recentUsers || []} />
          <ResponseRate />
        </div>
      </div>
    </div>
  );
}