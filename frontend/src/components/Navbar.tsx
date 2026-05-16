'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from './ThemeProvider';
import { Activity, Menu, X, Sun, Moon, LogOut, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
    navLinks.push({ name: 'Analysis', path: '/predict' });
    navLinks.push({ name: 'History', path: '/patients' });
    if (user?.role === 'admin') {
      navLinks.push({ name: 'Admin', path: '/admin' });
    }
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <Activity size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                DermAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className="ml-4 flex items-center space-x-4 border-l border-slate-200 dark:border-slate-700 pl-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      {user?.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                    </div>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="px-4 py-3">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.username}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md shadow-primary-600/20 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600 dark:bg-slate-800 dark:text-primary-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center px-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                        {user?.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                      </div>
                      <div>
                        <div className="text-base font-medium text-slate-800 dark:text-slate-200">{user?.username}</div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{user?.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 px-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-center items-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
