export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  cover_image?: string;
  is_favorite: boolean;
  created_at: string;
}

export interface Photo {
  id: string;
  event_id: string;
  image_url: string;
  description?: string;
  is_favorite: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface EventTag {
  event_id: string;
  tag_id: string;
}

export interface MemoryData {
  events: Event[];
  photos: Photo[];
  tags: Tag[];
  event_tags: EventTag[];
}
