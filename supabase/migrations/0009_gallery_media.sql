-- =============================================================================
-- LifeLink Group — Media Gallery (studio-graded photos + videos)
-- Migration: 0009_gallery_media.sql
--
-- 1. Adds a `media_type` column to lifelink_gallery ('image' | 'video').
-- 2. Seeds the curated, professionally colour-graded gallery media that now
--    lives in the repo under public/gallery/ (42 photos + 8 video loops).
--
-- All media is served from the site's public folder, e.g.
--   /gallery/gallery-01.jpg ... /gallery/gallery-42.jpg
--   /gallery/gallery-video-01.mp4 ... /gallery/gallery-video-08.mp4
-- (commit these files with the repo as usual).
--
-- Safe to run multiple times: only inserts rows whose image_url is not already
-- present. Re-running will NOT create duplicates.
-- =============================================================================

alter table lifelink_gallery
  add column if not exists media_type text not null default 'image';

insert into lifelink_gallery (image_url, media_type, caption, category, sort_order, is_active)
select v.image_url, v.media_type, v.caption, v.category, v.sort_order, v.is_active
from (values
  -- Photos -------------------------------------------------------------------
  ('/gallery/gallery-01.jpg','image','Members in plenary at a LifeLink empowerment session','events',1,true),
  ('/gallery/gallery-02.jpg','image','Attendees networking during a LifeLink group session','community',2,true),
  ('/gallery/gallery-03.jpg','image','Group photo of LifeLink participants outside the venue','community',3,true),
  ('/gallery/gallery-04.jpg','image','LifeLink team in branded apparel at a company event','events',4,true),
  ('/gallery/gallery-05.jpg','image','Interactive learning session with LifeLink members','training',5,true),
  ('/gallery/gallery-06.jpg','image','A full house at a LifeLink community gathering','community',6,true),
  ('/gallery/gallery-07.jpg','image','LifeLink members engaged in an open discussion','events',7,true),
  ('/gallery/gallery-08.jpg','image','Welcoming guests at a LifeLink event','community',8,true),
  ('/gallery/gallery-09.jpg','image','LifeLink participants at a briefing session','training',9,true),
  ('/gallery/gallery-10.jpg','image','Fellowship and refreshments at a LifeLink meet-up','community',10,true),
  ('/gallery/gallery-11.jpg','image','LifeLink group meeting in progress','events',11,true),
  ('/gallery/gallery-12.jpg','image','Members capturing memories at a LifeLink function','community',12,true),
  ('/gallery/gallery-13.jpg','image','Group photo with LifeLink leadership','partnerships',13,true),
  ('/gallery/gallery-14.jpg','image','LifeLink attendees celebrating at a special event','events',14,true),
  ('/gallery/gallery-15.jpg','image','A warm handshake between LifeLink hosts and guests','partnerships',15,true),
  ('/gallery/gallery-16.jpg','image','LifeLink members in traditional attire at an event','community',16,true),
  ('/gallery/gallery-17.jpg','image','Celebrating milestones together at LifeLink','events',17,true),
  ('/gallery/gallery-18.jpg','image','A speaker addressing the LifeLink audience','training',18,true),
  ('/gallery/gallery-19.jpg','image','LifeLink participants listening attentively','training',19,true),
  ('/gallery/gallery-20.jpg','image','Group interaction at a LifeLink outreach','community',20,true),
  ('/gallery/gallery-21.jpg','image','The LifeLink team at a team-building session','events',21,true),
  ('/gallery/gallery-22.jpg','image','A networking moment at a LifeLink function','partnerships',22,true),
  ('/gallery/gallery-23.jpg','image','LifeLink members enjoying a shared meal','community',23,true),
  ('/gallery/gallery-24.jpg','image','Dining and fellowship at a LifeLink event','community',24,true),
  ('/gallery/gallery-25.jpg','image','A candid portrait from the LifeLink community','general',25,true),
  ('/gallery/gallery-26.jpg','image','A LifeLink gathering with a lively atmosphere','events',26,true),
  ('/gallery/gallery-27.jpg','image','Members collaborating at a LifeLink workshop','training',27,true),
  ('/gallery/gallery-28.jpg','image','The LifeLink community in session','community',28,true),
  ('/gallery/gallery-29.jpg','image','Group photo celebrating LifeLink togetherness','community',29,true),
  ('/gallery/gallery-30.jpg','image','LifeLink participants at a media session','events',30,true),
  ('/gallery/gallery-31.jpg','image','A highlight from a LifeLink celebration','events',31,true),
  ('/gallery/gallery-32.jpg','image','LifeLink members in conversation','community',32,true),
  ('/gallery/gallery-33.jpg','image','Team photo at the LifeLink venue','partnerships',33,true),
  ('/gallery/gallery-34.jpg','image','A LifeLink audience during a presentation','training',34,true),
  ('/gallery/gallery-35.jpg','image','Engaged attendees at a LifeLink program','events',35,true),
  ('/gallery/gallery-36.jpg','image','LifeLink group enjoying an event highlight','community',36,true),
  ('/gallery/gallery-37.jpg','image','Fellowship among LifeLink members','community',37,true),
  ('/gallery/gallery-38.jpg','image','The LifeLink team at a corporate function','events',38,true),
  ('/gallery/gallery-39.jpg','image','Guests mingling at a LifeLink gathering','partnerships',39,true),
  ('/gallery/gallery-40.jpg','image','Leading worship and prayer at a LifeLink gathering','community',40,true),
  ('/gallery/gallery-41.jpg','image','LifeLink executives in a corporate strategy meeting','partnerships',41,true),
  ('/gallery/gallery-42.jpg','image','A presenter showcasing LifeLink services at a session','training',42,true),
  -- Videos -------------------------------------------------------------------
  ('/gallery/gallery-video-01.mp4','video','Highlights from a LifeLink group event','events',43,true),
  ('/gallery/gallery-video-02.mp4','video','Moments from a LifeLink community gathering','community',44,true),
  ('/gallery/gallery-video-03.mp4','video','LifeLink members in session on camera','training',45,true),
  ('/gallery/gallery-video-04.mp4','video','Celebration and fellowship at LifeLink','events',46,true),
  ('/gallery/gallery-video-05.mp4','video','A behind-the-scenes look at a LifeLink event','events',47,true),
  ('/gallery/gallery-video-06.mp4','video','LifeLink outreach and engagement','community',48,true),
  ('/gallery/gallery-video-07.mp4','video','Guests and partners at a LifeLink function','partnerships',49,true),
  ('/gallery/gallery-video-08.mp4','video','A short highlight reel from LifeLink','events',50,true)
) as v(image_url, media_type, caption, category, sort_order, is_active)
where not exists (
  select 1 from lifelink_gallery g where g.image_url = v.image_url
);
