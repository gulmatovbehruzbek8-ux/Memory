# GEMINI CLI MASTER PROMPT

You are an expert full-stack engineer. Build a production-quality personal web application called **"Memory Archive"**.

The application is a private, elegant memory storage platform where users can create events and upload photos with optional descriptions.

Follow ALL requirements strictly. Do not skip features. Do not simplify unless explicitly stated.

---

# CORE OBJECTIVE

Create a full-stack web app with:

* Event catalogue (homepage)
* Event detail pages with photo galleries
* Upload, edit, delete functionality
* Clean, modern UI
* Persistent storage

---

# TECH STACK (MANDATORY)

Frontend:

* Next.js (App Router)
* React
* Tailwind CSS

Backend:

* Supabase (Database + Storage + Auth)

Other:

* TypeScript
* Use best practices and modular architecture

---

# DATA MODELS (STRICT)

Event:

* id (uuid)
* title (string, REQUIRED)
* description (string, optional)
* date (date, REQUIRED)
* cover_image (string, optional)
* created_at

Photo:

* id (uuid)
* event_id (foreign key)
* image_url (string)
* description (string, optional)
* created_at

Tag (for friends):

* id
* name

EventTags:

* event_id
* tag_id

---

# CORE FEATURES

## 1. EVENT CATALOGUE (Homepage)

* Display all events as cards
* Each card shows:

  * Title
  * Date
  * Cover image
* Sorting options:

  * Newest first
  * Oldest first
* Search bar (search by title + description)

---

## 2. CREATE EVENT

* Form fields:

  * Title (REQUIRED)
  * Description (optional)
  * Date (REQUIRED)
  * Tags (optional, multiple)
* Validate required fields

---

## 3. EVENT PAGE

* Displays:

  * Title
  * Description
  * Date
  * Tags

* Photo gallery:

  * Grid layout
  * Responsive

---

## 4. PHOTO MANAGEMENT

* Upload multiple images (drag & drop supported)
* Each image can have optional description
* Edit/delete images

---

## 5. DOWNLOAD FEATURES

* Download single image
* Download entire event as ZIP

---

## 6. FAVORITES

* Mark events as favorite
* Mark photos as favorite
* Create "Highlights" view

---

## 7. SLIDESHOW MODE

* Button to play slideshow of event photos
* Auto transitions

---

## 8. TIMELINE VIEW

* Display events chronologically

---

## 9. TAG SYSTEM

* Tag events with friend names
* Click tag → filter events

---

## 10. PRIVACY

* Basic authentication using Supabase
* Only logged-in user can access data

---

## 11. STORAGE

* Store images in Supabase Storage
* Store metadata in database

---

## 12. EXPORT

* Export event as PDF

---

## 13. UI/UX REQUIREMENTS

Design must be:

* Minimal
* Modern
* Smooth animations
* Dark mode support

Components:

* Card-based layout
* Modal for uploads
* Clean typography

---

# ROUTES

/ → Event catalogue
/create → Create event
/event/[id] → Event page
/favorites → Favorites
/timeline → Timeline view

---

# ADDITIONAL REQUIREMENTS

* Use reusable components
* Use proper folder structure
* Add loading states
* Add error handling
* Optimize image loading

---

# IMPORTANT RULES

* DO NOT skip features
* DO NOT leave placeholders
* DO NOT use fake data in final build
* Code must run without errors
* Include setup instructions

---

# OUTPUT FORMAT

1. Full project structure
2. All code files
3. Supabase setup guide
4. Environment variables example
5. How to run locally

---

# LOCAL DEVELOPMENT REQUIREMENT (CRITICAL)

The application MUST be fully usable locally before any hosting or deployment.

Implement the following:

## 1. LOCAL-FIRST FUNCTIONALITY

* The app must run entirely on localhost
* All features must work locally without deployment
* No dependency on production-only services

## 2. LOCAL ENVIRONMENT SETUP

* Provide a complete `.env.local` example
* Include clear instructions to connect to Supabase from local environment
* Ensure all API keys are configurable via environment variables

## 3. SUPABASE LOCAL/REMOTE COMPATIBILITY

* The app must work with:

  * Hosted Supabase project (default)
  * OR local Supabase (optional advanced setup)
* Include instructions for both options

## 4. LOCAL STORAGE FALLBACK (IMPORTANT)

If Supabase is not configured, implement a fallback mode:

* Store events and photos metadata in browser localStorage
* Store images temporarily using base64 or object URLs
* Clearly separate this as "development mode"

## 5. RUN INSTRUCTIONS (MANDATORY)

Provide exact steps:

* Install dependencies
* Start dev server
* Access app in browser

Example:

```bash
npm install
npm run dev
```

* App must run on [http://localhost:3000](http://localhost:3000)

## 6. ZERO-ERROR GUARANTEE

* The project MUST run without errors after setup
* No missing dependencies
* No undefined environment variables

## 7. TESTING CHECKLIST

Include a checklist:

* Create event works
* Upload images works
* Gallery displays correctly
* Download works
* Favorites work
* Search works

---

# FINAL GOAL

A fully functional, polished personal memory archive website ready to deploy.

Do not produce explanations. Produce only implementation.
