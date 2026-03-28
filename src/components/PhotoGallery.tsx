'use client';

import { Photo } from '@/types';
import { 
  Download, 
  Trash2, 
  Star, 
  Maximize2, 
  Play, 
  Pause,
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorage } from '@/hooks/useStorage';
import { cn } from '@/lib/utils';

interface PhotoGalleryProps {
  photos: Photo[];
  eventTitle: string;
}

export function PhotoGallery({ photos, eventTitle }: PhotoGalleryProps) {
  const { deletePhoto, updatePhoto, updateEvent } = useStorage();
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextPhoto = useCallback(() => {
    setSlideshowIndex(prev => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setSlideshowIndex(prev => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && slideshowIndex !== null) {
      interval = setInterval(nextPhoto, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slideshowIndex, nextPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (slideshowIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') {
        setSlideshowIndex(null);
        setIsPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideshowIndex, nextPhoto, prevPhoto]);

  const handleDownload = async (url: string, id: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `photo-${id}.jpg`;
    link.click();
  };

  const setAsCover = (url: string, eventId: string) => {
    updateEvent(eventId, { cover_image: url });
  };

  return (
    <>
      {photos.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => {
              setSlideshowIndex(0);
              setIsPlaying(true);
            }}
            className="flex items-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            <Play className="h-4 w-4" />
            <span>Play Slideshow</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-foreground/5"
            >
              <img
                src={photo.image_url}
                alt={photo.description || 'Memory photo'}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setSlideshowIndex(index)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="rounded-full bg-white/20 p-3 text-white backdrop-blur-xl">
                    <Maximize2 className="h-6 w-6" />
                  </div>
                </button>

                <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePhoto(photo.id, { is_favorite: !photo.is_favorite });
                    }}
                    className={cn(
                      "rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/20",
                      photo.is_favorite && "text-yellow-400"
                    )}
                  >
                    <Star className={cn("h-4 w-4", photo.is_favorite && "fill-current")} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAsCover(photo.image_url, photo.event_id);
                    }}
                    className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                    title="Set as cover"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(photo.image_url, photo.id);
                    }}
                    className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    <Download className="mr-1 inline h-3 w-3" />
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this photo?')) {
                        deletePhoto(photo.id);
                      }
                    }}
                    className="rounded-lg bg-red-500/20 px-2 py-1 text-[10px] font-bold text-red-400 backdrop-blur-md transition-colors hover:bg-red-500/40"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Slideshow Modal */}
      <AnimatePresence>
        {slideshowIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 text-white"
          >
            <div className="absolute top-4 left-4 flex flex-col">
              <h3 className="text-lg font-bold">{eventTitle}</h3>
              <p className="text-sm text-white/60">
                {slideshowIndex + 1} of {photos.length}
              </p>
            </div>

            <div className="absolute top-4 right-4 flex space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
              <button
                onClick={() => {
                  setSlideshowIndex(null);
                  setIsPlaying(false);
                }}
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                title="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <div className="max-h-[80vh] max-w-[90vw] overflow-hidden">
              <motion.img
                key={slideshowIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                src={photos[slideshowIndex].image_url}
                alt="Slideshow"
                className="h-full w-full object-contain"
              />
            </div>

            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {photos[slideshowIndex].description && (
              <div className="absolute bottom-10 left-0 right-0 px-4 text-center">
                <p className="mx-auto max-w-2xl text-lg text-white/80">
                  {photos[slideshowIndex].description}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
