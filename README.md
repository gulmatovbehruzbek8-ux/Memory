# Memory Archive

A private, elegant memory storage platform built with Next.js, Supabase, and Tailwind CSS.

## Features
- **Event Catalogue**: Modern, responsive grid of memories.
- **Photo Management**: Upload photos with descriptions, set cover images.
- **Gallery & Slideshow**: Immersive photo viewing experience.
- **Timeline View**: Browse your memories chronologically.
- **Favorites**: Star your favorite events and individual photos.
- **Exports**: Download event photos as ZIP or export event summary as PDF.
- **Local Fallback**: Works entirely offline using `localStorage` if Supabase is not configured.
- **Dark Mode**: Smooth theme transitions for comfortable viewing.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
If you want to use Supabase for persistent storage across devices:
1. Refer to `SUPABASE_SETUP.md` for project configuration.
2. Create `.env.local` using the template in `.env.local.example`.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## Testing Checklist
- [ ] Create a new event with title, date, and description.
- [ ] Add tags to an event during creation.
- [ ] Upload multiple photos to an event with descriptions.
- [ ] Set a photo as the event's cover image.
- [ ] Star/Favorite events and photos.
- [ ] Check the Favorites page.
- [ ] Check the Timeline view.
- [ ] Use the Search bar to find an event.
- [ ] Download an individual photo.
- [ ] Download all photos in an event as a ZIP.
- [ ] Export an event summary as a PDF.
- [ ] Toggle Dark/Light mode.
- [ ] Play the slideshow.
