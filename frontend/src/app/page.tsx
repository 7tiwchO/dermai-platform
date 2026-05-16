'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, ArrowRight, Upload, Search, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 dark:bg-primary-600/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary-400/20 dark:bg-secondary-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8"
          >
            <Activity className="w-4 h-4 mr-2" />
            VGG16 AI Model Active
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Advanced AI for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
              Skin Cancer Detection
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed"
          >
            Upload a dermoscopic image and get an instant, AI-powered analysis with high confidence to assist in early detection of melanoma and benign lesions.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
            >
              How it works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              State-of-the-Art Diagnostics
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform utilizes a highly trained Convolutional Neural Network (VGG16) to provide accurate preliminary assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Optimized TFLite inference engine delivers prediction results in milliseconds, enabling rapid screening workflows.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">High Accuracy</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Trained on a robust dataset with extensive data augmentation, our model distinguishes between benign and malignant lesions reliably.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Detailed Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Comprehensive dashboard tracks patient history, confidence distributions, and provides actionable statistical insights over time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple 3-Step Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-slate-200 via-primary-300 to-slate-200 dark:from-slate-700 dark:via-primary-700 dark:to-slate-700 -z-10 transform -translate-y-1/2"></div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-lg z-10">
                <Upload className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Upload Image</h3>
              <p className="text-slate-600 dark:text-slate-400">Securely upload a clear dermoscopic image of the skin lesion.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-lg z-10">
                <Search className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. AI Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400">Our VGG16 model analyzes the visual features in milliseconds.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-lg z-10">
                <Activity className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Instant Results</h3>
              <p className="text-slate-600 dark:text-slate-400">View detailed prediction results with confidence scores and risk levels.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
