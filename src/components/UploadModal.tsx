'use client';

import { useState, useRef } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { X, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

interface SelectedFile {
  file: File;
  preview: string;
  description: string;
}

export function UploadModal({ isOpen, onClose, eventId }: UploadModalProps) {
  const { addPhotos } = useStorage();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      description: ''
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(selectedFiles[index].preview);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setSelectedFiles(prev => prev.map((f, i) => i === index ? { ...f, description } : f));
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    try {
      const photosToUpload = await Promise.all(
        selectedFiles.map(async (sf) => {
          const base64 = await readFileAsDataURL(sf.file);
          return {
            url: base64,
            description: sf.description
          };
        })
      );

      await addPhotos(eventId, photosToUpload);
      
      // Reset and close
      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-background shadow-2xl"
        >
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-bold">Upload Photos</h2>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-foreground/5">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-6">
            {selectedFiles.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex h-64 cursor-pointer flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02] transition-colors hover:bg-foreground/[0.04]"
              >
                <div className="rounded-full bg-foreground/5 p-4">
                  <Upload className="h-8 w-8 text-foreground/40" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground/80">Click or drag photos here</p>
                  <p className="text-sm text-foreground/40 text-foreground/60">Supports JPG, PNG, WEBP</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {selectedFiles.map((sf, index) => (
                  <div key={index} className="flex space-x-4 rounded-xl border p-3">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img src={sf.preview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex-grow">
                      <textarea
                        value={sf.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        placeholder="Add a description..."
                        className="h-full w-full resize-none border-none bg-transparent text-sm focus:ring-0"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-foreground/10 hover:bg-foreground/5"
                >
                  <Plus className="h-5 w-5 text-foreground/40" />
                  <span className="text-sm font-medium text-foreground/40">Add More</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 border-t p-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground/60 hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex items-center space-x-2 rounded-lg bg-foreground px-6 py-2 text-sm font-bold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Photos` : ''}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
