'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import FileUpload from '@/components/FileUpload';
import ConfidenceGauge from '@/components/ConfidenceGauge';
import { User, Calendar, FileText, AlertTriangle, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PredictPage() {
  const [file, setFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    if (!patientName.trim()) {
      setError('Patient name is required.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_name', patientName);
    if (patientAge) formData.append('patient_age', patientAge);
    if (notes) formData.append('notes', notes);

    try {
      const response = await api.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPatientName('');
    setPatientAge('');
    setNotes('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Run Analysis</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Upload a dermoscopic image for AI-powered skin lesion classification.</p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="upload-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column: Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Patient Information</h2>
              
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center">
                  <AlertTriangle size={18} className="mr-2" />
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Patient Name *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="block w-full pl-10 sm:text-sm border-slate-300 dark:border-slate-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 py-3 transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="patientAge" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Age (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      id="patientAge"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="block w-full pl-10 sm:text-sm border-slate-300 dark:border-slate-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 py-3 transition-colors"
                      placeholder="45"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Clinical Notes (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="block w-full pl-10 sm:text-sm border-slate-300 dark:border-slate-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-900 py-3 transition-colors"
                      placeholder="Lesion location, changes noticed, etc."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Upload */}
            <div className="flex flex-col">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 flex-grow flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Dermoscopic Image</h2>
                <FileUpload onFileSelect={setFile} selectedFile={file} />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !file || !patientName}
                className="mt-6 w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with VGG16...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Run Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Result Header */}
            <div className={`px-6 py-8 sm:p-10 text-center ${
              result.result === 'Malignant' 
                ? 'bg-gradient-to-b from-red-50 to-white dark:from-red-900/20 dark:to-slate-800' 
                : 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800'
            }`}>
              <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
                result.result === 'Malignant' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
              }`}>
                {result.result === 'Malignant' ? <ShieldAlert size={40} /> : <CheckCircle size={40} />}
              </div>
              
              <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase">Analysis Result</h2>
              <p className={`mt-2 text-4xl sm:text-5xl font-extrabold ${
                result.result === 'Malignant' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {result.result}
              </p>
              
              <div className="mt-8 flex justify-center">
                <ConfidenceGauge confidence={result.confidence} isMalignant={result.result === 'Malignant'} />
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
              
              {/* Details Left */}
              <div className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Patient Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</dt>
                    <dd className="mt-1 text-sm text-slate-900 dark:text-white font-medium">{result.patient_name}</dd>
                  </div>
                  {result.patient_age && (
                    <div>
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Age</dt>
                      <dd className="mt-1 text-sm text-slate-900 dark:text-white">{result.patient_age}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Date of Analysis</dt>
                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{new Date(result.created_at).toLocaleString()}</dd>
                  </div>
                </dl>
              </div>

              {/* Details Right */}
              <div className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Model Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Risk Level</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.risk_level === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        result.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {result.risk_level}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Inference Time</dt>
                    <dd className="mt-1 text-sm text-slate-900 dark:text-white">{result.inference_time_ms} ms</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Engine Mode</dt>
                    <dd className="mt-1 text-sm text-slate-900 dark:text-white capitalize">{result.model_mode}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-700 flex justify-center space-x-4">
              <Link 
                href="/dashboard"
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Analyze Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
