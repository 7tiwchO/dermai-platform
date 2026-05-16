'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfidenceGaugeProps {
  confidence: number; // 0.0 to 1.0
  isMalignant: boolean;
}

export default function ConfidenceGauge({ confidence, isMalignant }: ConfidenceGaugeProps) {
  const [value, setValue] = useState(0);
  const percentage = Math.round(confidence * 100);

  useEffect(() => {
    // Animate to value on mount
    const timeout = setTimeout(() => {
      setValue(percentage);
    }, 300);
    return () => clearTimeout(timeout);
  }, [percentage]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const color = isMalignant ? 'text-red-500' : 'text-emerald-500';
  const trackColor = 'text-slate-200 dark:text-slate-700';

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-40 h-40">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className={trackColor}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={color}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
          Confidence
        </span>
      </div>
    </div>
  );
}
