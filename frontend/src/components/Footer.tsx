'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Terminal, Globe, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                <Activity size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                DermAI
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6">
              Advanced AI platform for early detection of skin cancer using deep learning and convolutional neural networks. Providing fast, reliable, and accessible preliminary screening for patients and medical professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">
                <span className="sr-only">Development</span>
                <Terminal size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Website</span>
                <Globe size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors">
                <span className="sr-only">Mail</span>
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/predict" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Run Analysis
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Medical Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} DermAI Platform. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 md:mt-0 flex items-center">
            Built with <Heart size={14} className="text-red-500 mx-1 animate-pulse" /> for medical advancement
          </p>
        </div>
      </div>
    </footer>
  );
}
