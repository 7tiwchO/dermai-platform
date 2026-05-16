'use client';

import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

export default function FileUpload({ onFileSelect, selectedFile, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, BMP, WEBP).');
      return;
    }
    
    if (file.size > 16 * 1024 * 1024) {
      alert('File size exceeds 16MB limit.');
      return;
    }

    onFileSelect(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : error 
              ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
              : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden mb-4 border border-slate-200 dark:border-slate-700 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors z-10"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
              <FileImage className="w-4 h-4 mr-2" />
              {selectedFile?.name}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {(selectedFile?.size || 0) / 1024 / 1024 < 1 
                ? `${Math.round((selectedFile?.size || 0) / 1024)} KB` 
                : `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
              <UploadCloud size={32} />
            </div>
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              PNG, JPG, BMP, WEBP up to 16MB
            </p>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 pointer-events-none">
              Select Image
            </button>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
