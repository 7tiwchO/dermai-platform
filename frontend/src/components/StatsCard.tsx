'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp, 
  colorClass = "text-primary-500 bg-primary-100 dark:bg-primary-900/30" 
}: StatsCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start"
    >
      <div className={`p-3 rounded-xl mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        {trend && (
          <p className={`text-sm mt-1 flex items-center ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
            <span className="font-medium">{trendUp ? '↑' : '↓'} {trend}</span>
            <span className="text-slate-400 ml-1">vs last week</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
