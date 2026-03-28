'use client';

import { useStorage } from '@/hooks/useStorage';
import { EventCard } from '@/components/EventCard';
import { PhotoGallery } from '@/components/PhotoGallery';
import { Star, Heart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Favorites() {
  const { data, loading } = useStorage();
  const [activeTab, setActiveTab] = useState<'events' | 'photos'>('events');

  const favoriteEvents = useMemo(() => data.events.filter(e => e.is_favorite), [data.events]);
  const favoritePhotos = useMemo(() => data.photos.filter(p => p.is_favorite), [data.photos]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <p className="text-foreground/60">Your most precious memories, all in one place.</p>
      </div>

      <div className="flex space-x-1 rounded-xl bg-foreground/5 p-1 w-fit">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'events' ? 'bg-background shadow-sm text-foreground' : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Events ({favoriteEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'photos' ? 'bg-background shadow-sm text-foreground' : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Photos ({favoritePhotos.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'events' ? (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {favoriteEvents.length === 0 ? (
              <EmptyState message="No favorite events yet. Click the star on any event to add it here." />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {favoritePhotos.length === 0 ? (
              <EmptyState message="No favorite photos yet. Hover over any photo and click the star to add it here." />
            ) : (
              <PhotoGallery photos={favoritePhotos} eventTitle="Favorite Photos" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[40vh] flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02]">
      <div className="rounded-full bg-foreground/5 p-4">
        <Heart className="h-8 w-8 text-foreground/40" />
      </div>
      <p className="text-center text-sm text-foreground/60 max-w-xs">{message}</p>
    </div>
  );
}
