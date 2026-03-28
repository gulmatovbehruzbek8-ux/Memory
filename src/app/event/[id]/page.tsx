'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { formatDate } from '@/lib/utils';
import { 
  ArrowLeft, 
  Calendar, 
  Tag as TagIcon, 
  Plus, 
  Download, 
  FileText, 
  Play, 
  Trash2,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { PhotoGallery } from '@/components/PhotoGallery';
import { UploadModal } from '@/components/UploadModal';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, loading, mounted, deleteEvent, updateEvent } = useStorage();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const event = useMemo(() => data.events.find(e => e.id === id), [data.events, id]);
  const photos = useMemo(() => data.photos.filter(p => p.event_id === id), [data.photos, id]);
  const tags = useMemo(() => {
    const tagIds = data.event_tags.filter(et => et.event_id === id).map(et => et.tag_id);
    return data.tags.filter(t => tagIds.includes(t.id));
  }, [data.event_tags, data.tags, id]);

  if (!mounted || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Memory not found</h2>
        <Link href="/" className="text-foreground/60 hover:underline">Return to archive</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this memory and all its photos?')) {
      await deleteEvent(event.id);
      router.push('/');
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder(event.title);
    
    for (let i = 0; i < photos.length; i++) {
      const response = await fetch(photos[i].image_url);
      const blob = await response.blob();
      folder?.file(`photo-${i + 1}.jpg`, blob);
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title}.zip`;
    link.click();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('event-content');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${event.title}.pdf`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to archive</span>
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-foreground/60">
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              {tags.length > 0 && (
                <div className="flex items-center space-x-1.5">
                  <TagIcon className="h-4 w-4" />
                  <div className="flex gap-1">
                    {tags.map(tag => (
                      <span key={tag.id} className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs font-medium">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateEvent(event.id, { is_favorite: !event.is_favorite })}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
              event.is_favorite ? 'border-yellow-500 text-yellow-500' : 'hover:bg-foreground/5'
            }`}
          >
            <Star className={`h-5 w-5 ${event.is_favorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleDownloadAll}
            disabled={photos.length === 0}
            className="flex h-10 items-center space-x-2 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download ZIP</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex h-10 items-center space-x-2 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/20 text-red-500 transition-colors hover:bg-red-500/10"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div id="event-content" className="space-y-8">
        {event.description && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-foreground/80">{event.description}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gallery ({photos.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-2 rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-foreground/90"
              >
                <Plus className="h-4 w-4" />
                <span>Add Photos</span>
              </button>
            </div>
          </div>

          <PhotoGallery photos={photos} eventTitle={event.title} />
        </div>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        eventId={event.id} 
      />
    </div>
  );
}
