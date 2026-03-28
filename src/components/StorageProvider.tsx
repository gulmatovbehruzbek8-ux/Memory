'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Event, Photo, Tag, EventTag, MemoryData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'memory_archive_data';

const getInitialData = (): MemoryData => {
  return { events: [], photos: [], tags: [], event_tags: [] };
};

interface StorageContextType {
  data: MemoryData;
  loading: boolean;
  mounted: boolean;
  useLocal: boolean;
  addEvent: (event: Omit<Event, 'id' | 'created_at' | 'is_favorite'>) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addPhotos: (eventId: string, photos: { url: string, description?: string }[]) => Promise<Photo[]>;
  deletePhoto: (id: string) => Promise<void>;
  updatePhoto: (id: string, updates: Partial<Photo>) => Promise<void>;
  addTag: (name: string) => Promise<Tag>;
  linkTagToEvent: (eventId: string, tagId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MemoryData>(getInitialData());
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [useLocal, setUseLocal] = useState(!isSupabaseConfigured());

  const fetchData = useCallback(async () => {
    if (!useLocal && supabase) {
      try {
        const { data: events } = await supabase.from('events').select('*').order('date', { ascending: false });
        const { data: photos } = await supabase.from('photos').select('*');
        const { data: tags } = await supabase.from('tags').select('*');
        const { data: event_tags } = await supabase.from('event_tags').select('*');

        setData({
          events: events || [],
          photos: photos || [],
          tags: tags || [],
          event_tags: event_tags || []
        });
      } catch (error) {
        console.error('Error fetching from Supabase, falling back to local:', error);
        setUseLocal(true);
      }
    } else {
      // Local mode: load from localStorage on client side only
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setData(JSON.parse(stored));
          } catch (e) {
            console.error('Error parsing stored data:', e);
          }
        }
      }
    }
    setLoading(false);
    setMounted(true);
  }, [useLocal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (mounted && useLocal && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, useLocal, mounted]);

  const addEvent = async (event: Omit<Event, 'id' | 'created_at' | 'is_favorite'>) => {
    const newEvent: Event = {
      ...event,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      is_favorite: false
    };

    if (useLocal || !supabase) {
      setData(prev => ({ ...prev, events: [newEvent, ...prev.events] }));
      return newEvent;
    } else {
      const { data: result, error } = await supabase.from('events').insert([newEvent]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, events: [result, ...prev.events] }));
      return result;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    if (useLocal || !supabase) {
      setData(prev => ({
        ...prev,
        events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e)
      }));
    } else {
      const { error } = await supabase.from('events').update(updates).eq('id', id);
      if (error) throw error;
      setData(prev => ({
        ...prev,
        events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e)
      }));
    }
  };

  const deleteEvent = async (id: string) => {
    if (useLocal || !supabase) {
      setData(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== id),
        photos: prev.photos.filter(p => p.event_id !== id),
        event_tags: prev.event_tags.filter(et => et.event_id !== id)
      }));
    } else {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== id),
        photos: prev.photos.filter(p => p.event_id !== id),
        event_tags: prev.event_tags.filter(et => et.event_id !== id)
      }));
    }
  };

  const addPhotos = async (eventId: string, photos: { url: string, description?: string }[]) => {
    const newPhotos: Photo[] = photos.map(p => ({
      id: uuidv4(),
      event_id: eventId,
      image_url: p.url,
      description: p.description,
      is_favorite: false,
      created_at: new Date().toISOString()
    }));

    if (useLocal || !supabase) {
      setData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
      return newPhotos;
    } else {
      const { data: result, error } = await supabase.from('photos').insert(newPhotos).select();
      if (error) throw error;
      setData(prev => ({ ...prev, photos: [...prev.photos, ...result] }));
      return result;
    }
  };

  const deletePhoto = async (id: string) => {
    if (useLocal || !supabase) {
      setData(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }));
    } else {
      const { error } = await supabase.from('photos').delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({ ...prev, photos: prev.photos.filter(p => p.id !== id) }));
    }
  };

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    if (useLocal || !supabase) {
      setData(prev => ({
        ...prev,
        photos: prev.photos.map(p => p.id === id ? { ...p, ...updates } : p)
      }));
    } else {
      const { error } = await supabase.from('photos').update(updates).eq('id', id);
      if (error) throw error;
      setData(prev => ({
        ...prev,
        photos: prev.photos.map(p => p.id === id ? { ...p, ...updates } : p)
      }));
    }
  };

  const addTag = async (name: string) => {
    const existing = data.tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;

    const newTag: Tag = { id: uuidv4(), name };
    if (useLocal || !supabase) {
      setData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      return newTag;
    } else {
      const { data: result, error } = await supabase.from('tags').insert([newTag]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, tags: [...prev.tags, result] }));
      return result;
    }
  };

  const linkTagToEvent = async (eventId: string, tagId: string) => {
    const link: EventTag = { event_id: eventId, tag_id: tagId };
    if (useLocal || !supabase) {
      if (!data.event_tags.find(et => et.event_id === eventId && et.tag_id === tagId)) {
        setData(prev => ({ ...prev, event_tags: [...prev.event_tags, link] }));
      }
    } else {
      const { error } = await supabase.from('event_tags').insert([link]);
      if (error && error.code !== '23505') throw error; // Ignore duplicate links
      setData(prev => ({ ...prev, event_tags: [...prev.event_tags, link] }));
    }
  };

  return (
    <StorageContext.Provider value={{
      data,
      loading,
      mounted,
      useLocal,
      addEvent,
      updateEvent,
      deleteEvent,
      addPhotos,
      deletePhoto,
      updatePhoto,
      addTag,
      linkTagToEvent,
      refreshData: fetchData
    }}>
      {children}
    </StorageContext.Provider>
  );
}

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorageContext must be used within a StorageProvider');
  }
  return context;
};
