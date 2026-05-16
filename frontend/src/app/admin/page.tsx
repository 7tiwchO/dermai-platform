'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import StatsCard from '@/components/StatsCard';
import { Users, Database, ShieldAlert, Activity, Server } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchAdminStats = async () => {
        try {
          const res = await api.get('/admin/stats');
          setStats(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAdminStats();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-red-500 font-bold text-xl">Access Denied</p>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Control Panel</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">System-wide statistics and monitoring.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Users" 
          value={stats?.total_users || 0} 
          icon={<Users size={24} />} 
          colorClass="text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30"
        />
        <StatsCard 
          title="Active Today" 
          value={stats?.active_users_today || 0} 
          icon={<Activity size={24} />} 
          colorClass="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatsCard 
          title="Total Predictions" 
          value={stats?.total_predictions || 0} 
          icon={<Database size={24} />} 
          colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard 
          title="Storage Used" 
          value={`${stats?.storage_used_mb || 0} MB`} 
          icon={<Server size={24} />} 
          colorClass="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Logs */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent System Activity</h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
            {stats?.recent_activity?.map((log: any) => (
              <div key={log.id} className="p-4 flex items-start text-sm">
                <div className="min-w-0 flex-1">
                  <p className="text-slate-900 dark:text-white font-medium">{log.username || 'System'} <span className="text-slate-500 dark:text-slate-400 font-normal ml-2">{log.action}</span></p>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{log.details}</p>
                </div>
                <div className="text-slate-400 dark:text-slate-500 whitespace-nowrap ml-4">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">System Health</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">ML Engine</span>
                {stats?.model_loaded ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Online (TFLite)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Demo Mode
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-300">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Connected
                </span>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Positive Rate (Malignant)</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {stats?.total_predictions ? Math.round((stats.total_malignant / stats.total_predictions) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats?.total_predictions ? (stats.total_malignant / stats.total_predictions) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
