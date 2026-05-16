'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import StatsCard from '@/components/StatsCard';
import { Activity, FileImage, ShieldAlert, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/patients/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm('WARNING: Are you sure you want to delete ALL your history? This cannot be undone.')) return;
    try {
      await api.delete('/patients');
      fetchStats();
    } catch (err) {
      console.error('Failed to clear history', err);
      alert('Failed to clear history');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.username}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Here is an overview of your recent diagnostic activity.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/predict"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Activity className="mr-2 -ml-1 h-5 w-5" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Analyses" 
          value={stats?.total || 0} 
          icon={<FileImage size={24} />} 
          colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard 
          title="Malignant Detected" 
          value={stats?.malignant || 0} 
          icon={<ShieldAlert size={24} />} 
          colorClass="text-red-600 bg-red-100 dark:bg-red-900/30"
        />
        <StatsCard 
          title="Benign Detected" 
          value={stats?.benign || 0} 
          icon={<CheckCircle size={24} />} 
          colorClass="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatsCard 
          title="Avg Confidence" 
          value={stats?.avg_confidence ? `${(stats.avg_confidence * 100).toFixed(1)}%` : '0%'} 
          icon={<Activity size={24} />} 
          colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Analyses</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleClearHistory}
                disabled={!stats?.recent || stats.recent.length === 0}
                className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear History
              </button>
              <Link href="/patients" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {stats?.recent && stats.recent.length > 0 ? (
              stats.recent.map((record: any) => (
                <div key={record.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      record.result === 'Malignant' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {record.result === 'Malignant' ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {record.patient_name}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center mt-1">
                        <Clock size={14} className="mr-1" /> 
                        {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      record.result === 'Malignant' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {record.result}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(record.confidence * 100).toFixed(1)}% Conf
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <FileImage size={48} className="mx-auto mb-4 opacity-50" />
                <p>No recent analyses found.</p>
                <Link href="/predict" className="mt-4 inline-block text-primary-600 hover:text-primary-500 font-medium">
                  Run your first analysis
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Analysis</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Need a rapid assessment? Go directly to the analysis tool.
            </p>
            <Link
              href="/predict"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 transition-colors"
            >
              Upload Image
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-6">
            <h2 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-2">Model Status</h2>
            <div className="flex items-center">
              <span className="flex h-3 w-3 relative mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">VGG16 TFLite Engine Active</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              System is ready for high-speed inference.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
