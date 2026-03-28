'use client';

import { useState, useMemo } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { SearchBar } from '@/components/SearchBar';
import { EventCard } from '@/components/EventCard';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { data, loading, mounted } = useStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredEvents = useMemo(() => {
    let result = [...data.events];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description?.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [data.events, searchQuery, sortBy]);

  if (!mounted || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archive</h1>
          <p className="text-foreground/60">Manage and explore your captured memories.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="h-10 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {filteredEvents.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02]">
          <div className="rounded-full bg-foreground/5 p-4">
            <LayoutGrid className="h-8 w-8 text-foreground/40" />
          </div>
          <div className="text-center">
            <h3 className="font-medium">No events found</h3>
            <p className="text-sm text-foreground/60">
              {searchQuery ? "Try adjusting your search query." : "Start by creating your first memory."}
            </p>
          </div>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
