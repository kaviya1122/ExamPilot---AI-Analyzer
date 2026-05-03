/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploaderProps {
  onFilesChange: (files: { data: string; mimeType: string; name: string }[]) => void;
}

export default function FileUploader({ onFilesChange }: FileUploaderProps) {
  const [files, setFiles] = useState<{ data: string; mimeType: string; name: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const newFiles = [...files, { data: result, mimeType: file.type, name: file.name }];
      setFiles(newFiles);
      onFilesChange(newFiles);
    };
    reader.readAsDataURL(file);
  }, [files, onFilesChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(handleFile);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4
          ${isDragging ? 'border-primary bg-indigo-50/50' : 'border-border bg-slate-50/50 hover:bg-slate-50 hover:border-primary/30'}
        `}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            selectedFiles.forEach(handleFile);
          }}
        />
        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary border border-border">
          <Upload size={28} />
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-800">Upload Examination Assets</p>
          <p className="text-xs text-text-muted mt-1">PDF or image files spanning multiple sessions</p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {files.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-primary">
                  <FileText size={16} />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 truncate flex-1">{file.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-opacity"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-start gap-3 p-4 bg-indigo-50/30 border border-indigo-100 rounded-xl text-[11px] text-slate-600 leading-relaxed font-medium">
        <AlertCircle size={16} className="shrink-0 text-primary" />
        <p>Optimal pattern recognition occurs with high-resolution scans. Historical dataset (3+ years) recommended for reliability.</p>
      </div>
    </div>
  );
}
