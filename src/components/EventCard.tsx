'use client';

import Link from 'next/link';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, Star, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStorage } from '@/hooks/useStorage';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { updateEvent } = useStorage();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateEvent(event.id, { is_favorite: !event.is_favorite });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md"
    >
      <Link href={`/event/${event.id}`}>
        <div className="aspect-[4/3] w-full overflow-hidden bg-foreground/5">
          {event.cover_image ? (
            <img
              src={event.cover_image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Calendar className="h-10 w-10 text-foreground/10" />
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="line-clamp-1 font-semibold tracking-tight">{event.title}</h3>
            <button
              onClick={toggleFavorite}
              className={`transition-colors hover:text-yellow-500 ${event.is_favorite ? 'text-yellow-500' : 'text-foreground/20'}`}
            >
              <Star className={`h-4 w-4 ${event.is_favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center text-xs text-foreground/50">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(event.date)}
          </div>
          
          {event.description && (
            <p className="mt-2 line-clamp-2 text-sm text-foreground/70">
              {event.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
