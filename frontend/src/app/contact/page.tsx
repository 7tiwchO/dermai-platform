'use client';

import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Get in Touch</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Have questions about the DermAI platform or need technical support? Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Contact Information</h3>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <Mail size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Email Us</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">For general inquiries and support.</p>
                  <a href="mailto:support@dermai.platform" className="mt-2 inline-block font-medium text-primary-600 hover:text-primary-500">support@dermai.platform</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Phone size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Call Us</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">Mon-Fri from 9am to 6pm.</p>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <MapPin size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Office Location</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">Come say hello at our AI research lab.</p>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">100 Tech Innovation Way<br/>San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h3>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" id="name" className="mt-1 block w-full border-slate-300 dark:border-slate-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 py-3 px-4 shadow-sm" placeholder="John Doe" required />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" id="email" className="mt-1 block w-full border-slate-300 dark:border-slate-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 py-3 px-4 shadow-sm" placeholder="john@example.com" required />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <textarea id="message" rows={4} className="mt-1 block w-full border-slate-300 dark:border-slate-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 py-3 px-4 shadow-sm" placeholder="How can we help you?" required></textarea>
            </div>
            
            <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
              <Send size={18} className="mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
