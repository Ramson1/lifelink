// =============================================================================
// LifeLink Group — Shared media catalog
//
// A single source of truth for the studio-graded photos + video loops that now
// live under public/gallery/. Any page or section can import these groups to
// style the site with real LifeLink media (galleries, slideshows, strips) and
// feed them into the fullscreen media viewer.
//
// Kept in sync with supabase/migrations/0009_gallery_media.sql (same captions
// and categories). Captions are used as alt text and lightbox captions.
// =============================================================================

export type MediaType = "image" | "video";

export interface MediaItem {
  /** Public path, e.g. /gallery/gallery-01.jpg or /gallery/gallery-video-01.mp4 */
  src: string;
  type: MediaType;
  caption: string;
  category: string;
}

const PHOTO_CAPTIONS: [caption: string, category: string][] = [
  ["Members in plenary at a LifeLink empowerment session", "events"],
  ["Attendees networking during a LifeLink group session", "community"],
  ["Group photo of LifeLink participants outside the venue", "community"],
  ["LifeLink team in branded apparel at a company event", "events"],
  ["Interactive learning session with LifeLink members", "training"],
  ["A full house at a LifeLink community gathering", "community"],
  ["LifeLink members engaged in an open discussion", "events"],
  ["Welcoming guests at a LifeLink event", "community"],
  ["LifeLink participants at a briefing session", "training"],
  ["Fellowship and refreshments at a LifeLink meet-up", "community"],
  ["LifeLink group meeting in progress", "events"],
  ["Members capturing memories at a LifeLink function", "community"],
  ["Group photo with LifeLink leadership", "partnerships"],
  ["LifeLink attendees celebrating at a special event", "events"],
  ["A warm handshake between LifeLink hosts and guests", "partnerships"],
  ["LifeLink members in traditional attire at an event", "community"],
  ["Celebrating milestones together at LifeLink", "events"],
  ["A speaker addressing the LifeLink audience", "training"],
  ["LifeLink participants listening attentively", "training"],
  ["Group interaction at a LifeLink outreach", "community"],
  ["The LifeLink team at a team-building session", "events"],
  ["A networking moment at a LifeLink function", "partnerships"],
  ["LifeLink members enjoying a shared meal", "community"],
  ["Dining and fellowship at a LifeLink event", "community"],
  ["A candid portrait from the LifeLink community", "general"],
  ["A LifeLink gathering with a lively atmosphere", "events"],
  ["Members collaborating at a LifeLink workshop", "training"],
  ["The LifeLink community in session", "community"],
  ["Group photo celebrating LifeLink togetherness", "community"],
  ["LifeLink participants at a media session", "events"],
  ["A highlight from a LifeLink celebration", "events"],
  ["LifeLink members in conversation", "community"],
  ["Team photo at the LifeLink venue", "partnerships"],
  ["A LifeLink audience during a presentation", "training"],
  ["Engaged attendees at a LifeLink program", "events"],
  ["LifeLink group enjoying an event highlight", "community"],
  ["Fellowship among LifeLink members", "community"],
  ["The LifeLink team at a corporate function", "events"],
  ["Guests mingling at a LifeLink gathering", "partnerships"],
  ["Leading worship and prayer at a LifeLink gathering", "community"],
  ["LifeLink executives in a corporate strategy meeting", "partnerships"],
  ["A presenter showcasing LifeLink services at a session", "training"],
];

const VIDEO_CAPTIONS: [caption: string, category: string][] = [
  ["Highlights from a LifeLink group event", "events"],
  ["Moments from a LifeLink community gathering", "community"],
  ["LifeLink members in session on camera", "training"],
  ["Celebration and fellowship at LifeLink", "events"],
  ["A behind-the-scenes look at a LifeLink event", "events"],
  ["LifeLink outreach and engagement", "community"],
  ["Guests and partners at a LifeLink function", "partnerships"],
  ["A short highlight reel from LifeLink", "events"],
];

const galleryPhotos: MediaItem[] = PHOTO_CAPTIONS.map(([caption, category], i) => ({
  src: `/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
  type: "image" as const,
  caption,
  category,
}));

const galleryVideos: MediaItem[] = VIDEO_CAPTIONS.map(([caption, category], i) => ({
  src: `/gallery/gallery-video-${String(i + 1).padStart(2, "0")}.mp4`,
  type: "video" as const,
  caption,
  category,
}));

/** Every piece of gallery media (42 photos + 8 videos). */
export const galleryMedia: MediaItem[] = [...galleryPhotos, ...galleryVideos];

export const photos = galleryPhotos;
export const videos = galleryVideos;

/** Photos only, cycling through categories so the strip feels varied. */
export const marqueePhotos: MediaItem[] = [
  galleryPhotos[3],
  galleryPhotos[0],
  galleryPhotos[15],
  galleryPhotos[12],
  galleryPhotos[17],
  galleryPhotos[33],
  galleryPhotos[20],
  galleryPhotos[37],
  galleryPhotos[28],
  galleryPhotos[13],
  galleryPhotos[4],
  galleryPhotos[26],
  galleryPhotos[40],
  galleryPhotos[41],
];

/** A curated mix of photos + a couple of video loops for the hero slideshow. */
export const slideshowMedia: MediaItem[] = [
  galleryPhotos[0],
  galleryVideos[0],
  galleryPhotos[16],
  galleryPhotos[33],
  galleryVideos[3],
  galleryPhotos[12],
  galleryPhotos[25],
  galleryVideos[4],
  galleryPhotos[18],
  galleryPhotos[37],
];

/** Partnership / corporate-facing media for the Partners page. */
export const partnershipMedia: MediaItem[] = galleryMedia.filter(
  (m) => m.category === "partnerships",
);

/** Training / empowerment media for the Services page. */
export const trainingMedia: MediaItem[] = galleryMedia.filter(
  (m) => m.category === "training" || m.category === "events",
);

/** Media filtered by one or more categories. */
export function mediaByCategory(...categories: string[]): MediaItem[] {
  return galleryMedia.filter((m) => categories.includes(m.category));
}
