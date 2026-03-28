'use client';

import { useStorage } from '@/hooks/useStorage';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Timeline() {
  const { data, loading } = useStorage();

  const sortedEvents = useMemo(() => {
    return [...data.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.events]);

  const eventsByYear = useMemo(() => {
    const years: { [key: string]: typeof sortedEvents } = {};
    sortedEvents.forEach(event => {
      const year = new Date(event.date).getFullYear().toString();
      if (!years[year]) years[year] = [];
      years[year].push(event);
    });
    return Object.entries(years).sort((a, b) => b[0].localeCompare(a[0]));
  }, [sortedEvents]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-foreground/60">Chronological history of your captured life moments.</p>
      </div>

      <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:h-full before:w-[2px] before:bg-foreground/5 sm:before:left-1/2 sm:before:-translate-x-1/2">
        {eventsByYear.map(([year, events]) => (
          <div key={year} className="space-y-8">
            <div className="relative z-10 mx-auto w-fit rounded-full bg-foreground px-4 py-1 text-sm font-bold text-background">
              {year}
            </div>
            
            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col sm:flex-row ${index % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'}`}
                >
                  <div className={`w-full sm:w-[45%] ${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                    <Link href={`/event/${event.id}`}>
                      <div className="group rounded-2xl border bg-card p-4 transition-all hover:bg-foreground/[0.02] hover:shadow-md">
                        <div className="flex items-center space-x-2 text-xs font-bold text-foreground/40 mb-2 sm:justify-inherit">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <h3 className="text-lg font-bold group-hover:underline">{event.title}</h3>
                        {event.description && (
                          <p className="mt-2 text-sm text-foreground/60 line-clamp-2">{event.description}</p>
                        )}
                        <div className={`mt-4 flex items-center text-sm font-medium text-foreground/80 ${index % 2 === 0 ? 'sm:justify-end' : 'sm:justify-start'}`}>
                          <span>View memory</span>
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="absolute left-[8px] top-6 h-[8px] w-[8px] rounded-full bg-foreground/20 ring-4 ring-background sm:left-1/2 sm:-translate-x-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
