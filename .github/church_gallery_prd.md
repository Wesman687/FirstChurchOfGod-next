# PRD: Church Website Gallery Redesign & People Mentions Integration

## Project Title
Enhanced Church Gallery with People Mentions

## URL
https://www.palatka-firstchurchofgod.org/gallery

## Objective
Redesign the church’s gallery to be:
- **Visually professional** and modern
- **Functionally enhanced** with people tagging and search
- **Admin-friendly** for image and metadata management
- **Community-engaged** with optional public uploads and approval flow

---

## Goals

### 1. Visual Redesign
- Create a **professional**, responsive, clean layout
- Grid or masonry-style photo arrangement
- Optional filters by year, event, or tag
- Lightbox view on click (with people mentions & description shown)
- Consistent with overall church site design and branding

### 2. People Mentions System
We want to integrate a `people_mentions` system, similar to what’s used with sermon videos.

#### Data Format
```json
{
  "name": "Person Name",
  "context": "e.g., 'Baptism event', 'Choir practice'",
  "start_time": null,
  "end_time": null,
  "mention_type": "picture",
  "media_url": "https://url-to-image.jpg",
  "date": "2025-08-01T00:00:00Z"
}
```

- Replace `video_id` with `media_url` (the image URL)
- `mention_type` will be `"picture"` for all image mentions

#### Functionality
- While **adding/editing images**, allow adding **multiple people mentions**
- **Auto-suggest existing names** from database while typing
- If the name is new, create it
- Save people mentions with the image’s metadata in Firestore
- Show list of people under each image when viewed

---

## Admin Features

### Upload/Edit Interface
- Allow drag-and-drop or file picker to upload images
- Fields:
  - Description (`desc`)
  - Category/tag (`gallery`)
  - Timestamp (`timeStamp`, auto-generated)
  - People Mentions (with search & create logic)
- Firebase upload logic example:
```ts
const docRef = await addDoc(collection(db, 'images'), {
  link: downloadURL,
  timeStamp: new Date(),
  gallery: filter,
  desc,
  peopleMentions: [ ... ]
})
```

### Approval Workflow
- Public users can optionally upload photos
- These go into a **pending approval queue**
- Admin panel for reviewing/approving/rejecting uploads
- Once approved, they’re added to the main gallery

---

## Public Features

- View gallery with filters (by tag/year/person)
- View image details (description, date, people in photo)
- Search by person name to show all photos they're tagged in
- Optional upload portal for members (with approval notice)

---

## Optional Future Enhancements

- Facial recognition auto-tagging (optional ML pipeline)
- Event tagging or smart album grouping
- PDF/zip download of albums by event or person
- Shareable links to individual images or galleries

---

## Tech Stack Notes

- Firebase Firestore + Storage
- Frontend: React (likely), continue integrating into Next.js app
- Existing data format for image uploads to be extended with:
  - `peopleMentions` array
- Leverage existing database of `person.name` for autosuggestions

---

## Summary

This upgrade will turn our static gallery into a dynamic, searchable archive that not only looks great but also connects our church family by highlighting the people in our ministry. It will be easy to manage, inclusive for public contributions, and future-proof for growth.