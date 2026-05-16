'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Cpu, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            About DermAI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Bridging the gap between artificial intelligence and dermatological diagnostics.
          </motion.p>
        </div>

        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <ShieldCheck className="w-6 h-6 text-primary-500 mr-3" />
            Our Mission
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <p>
              Skin cancer is one of the most common types of cancer globally. Early detection is absolutely critical for successful treatment, dramatically increasing survival rates.
            </p>
            <p>
              DermAI was built to provide an accessible, rapid, and accurate preliminary screening tool using state-of-the-art Deep Learning technology. While not a replacement for a professional medical diagnosis, it serves as a powerful assisting tool for both individuals seeking preliminary assessments and medical professionals looking for a second AI-driven opinion.
            </p>
          </div>
        </motion.section>

        {/* Technology Stack Grid */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">The Technology Behind DermAI</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 p-8 rounded-2xl border border-blue-100 dark:border-slate-700"
            >
              <Brain className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">VGG16 Architecture</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The core prediction engine uses VGG16, a deep Convolutional Neural Network (CNN). By utilizing Transfer Learning with ImageNet weights, the model leverages deep feature extraction capabilities fine-tuned specifically for dermoscopic lesion patterns.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 p-8 rounded-2xl border border-emerald-100 dark:border-slate-700"
            >
              <Database className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Extensive Dataset</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Trained on a robust dataset of over 6,500 curated images, balanced between Benign and Malignant cases. Extensive data augmentation techniques (rotations, shifts, flips) were applied to ensure model robustness and generalization.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 p-8 rounded-2xl border border-orange-100 dark:border-slate-700"
            >
              <Cpu className="w-10 h-10 text-orange-600 dark:text-orange-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">TFLite Optimization</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The heavy neural network is converted to TensorFlow Lite format. This quantization reduces the model size significantly and accelerates inference speed, allowing rapid real-time predictions directly on the server without needing expensive GPUs.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-slate-800 dark:to-slate-800/80 p-8 rounded-2xl border border-purple-100 dark:border-slate-700"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 font-bold text-xl">
                {'</>'}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Modern Full-Stack</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Built with a high-performance FastAPI Python backend for asynchronous request handling and ML inference, paired with a dynamic, responsive Next.js and Tailwind CSS frontend for a seamless user experience.
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
