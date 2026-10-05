import type { ImageMetadata } from 'astro';

/**
 * Media slots.
 *
 * Every image or video on the site has a named slot. To fill a slot, drop a
 * file whose name matches the slot key into the matching folder:
 *
 *   src/assets/images/<slot>.jpg   (.jpg, .jpeg, .png, .webp or .avif)
 *   src/assets/videos/<slot>.mp4   (.mp4 or .webm)
 *
 * e.g. `src/assets/images/home-hero.jpg`. Until a file exists, the slot
 * renders a placeholder. No code changes are needed.
 */

export const imageSlots = {
  'home-mission': {
    label: 'Mission',
    size: '1200 × 1500',
    hint: 'Portrait photo of youths learning or working together.',
  },
  'home-courses': { label: 'Courses card', size: '1200 × 900', hint: 'Digital skills training in action.' },
  'home-mentorship': { label: 'Mentorship card', size: '1200 × 900', hint: 'A mentor with a mentee.' },
  'home-events': { label: 'Events card', size: '1200 × 900', hint: 'A YEA event or gathering.' },
  'home-jobs': { label: 'Opportunities card', size: '1200 × 900', hint: 'Workplace or industry visit.' },
  'home-video-poster': {
    label: 'Video cover',
    size: '1920 × 1080',
    hint: 'Still frame shown before the story video plays.',
  },
  'home-gallery-1': { label: 'Gallery 1', size: '1200 × 1200', hint: 'Community moment.' },
  'home-gallery-2': { label: 'Gallery 2', size: '1200 × 1200', hint: 'Community moment.' },
  'home-gallery-3': { label: 'Gallery 3', size: '1200 × 1200', hint: 'Community moment.' },
  'home-gallery-4': { label: 'Gallery 4', size: '1200 × 1200', hint: 'Community moment.' },
  'home-gallery-5': { label: 'Gallery 5', size: '1200 × 1200', hint: 'Community moment.' },
  'home-gallery-6': { label: 'Gallery 6', size: '2400 × 800', hint: 'Wide panorama across the bottom of the gallery.' },
  'programs-hero': { label: 'Programs banner', size: '2400 × 900', hint: 'Wide banner for the Programs page.' },
  'courses-hero': { label: 'Courses banner', size: '2400 × 900', hint: 'Also used on each course page.' },
  'mentorship-hero': { label: 'Mentorship banner', size: '2400 × 900', hint: 'Also used on each mentor page.' },
  'events-hero': { label: 'Events banner', size: '2400 × 900', hint: 'Also used on each event page.' },
  'jobs-hero': { label: 'Jobs banner', size: '2400 × 900', hint: 'Also used on each job page.' },
  'login-side': { label: 'Sign-in image', size: '1200 × 1600', hint: 'Portrait photo beside the sign-in form.' },
} as const;

export const videoSlots = {
  'home-hero': {
    label: 'Home hero videos (optional)',
    size: '1920 × 1080, under 10 MB each',
    hint: 'Short clips named home-hero-1, home-hero-2 … They play in order behind the headline, cross-fading into each other, then the hero photos follow.',
  },
  'home-story': {
    label: 'Story video',
    size: '1920 × 1080',
    hint: 'Your main video with sound, e.g. an impact story. Plays with controls.',
  },
} as const;

export type ImageSlot = keyof typeof imageSlots;
export type VideoSlot = keyof typeof videoSlots;

const imageFiles = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

const videoFiles = import.meta.glob<string>('/src/assets/videos/*.{mp4,webm,MP4,WEBM}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Photos for the scrolling strip: every image in src/assets/images/marquee/, in file-name order. */
const marqueeFiles = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/marquee/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

const baseName = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '');
const byName = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

/** Photos for the home hero slideshow: hero1, hero2 … (or hero-1 …) in src/assets/images/, in number order. */
export const heroImages: ImageMetadata[] = Object.keys(imageFiles)
  .filter((path) => /^hero-?\d+$/.test(baseName(path)))
  .sort(byName)
  .map((path) => imageFiles[path].default);

export const marqueeImages: ImageMetadata[] = Object.keys(marqueeFiles)
  .sort(byName)
  .map((path) => marqueeFiles[path].default);

/** The image dropped in for a slot, or undefined if there isn't one yet. */
export function findImage(slot: ImageSlot): ImageMetadata | undefined {
  const match = Object.entries(imageFiles).find(([path]) => baseName(path) === slot);
  return match?.[1].default;
}

export type VideoSource = { src: string; type: string };

function sourcesNamed(name: string): VideoSource[] {
  const webmFirst = (s: VideoSource) => (s.type === 'video/webm' ? 0 : 1);
  return Object.entries(videoFiles)
    .filter(([path]) => baseName(path) === name)
    .map(([path, src]) => ({
      src,
      type: path.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4',
    }))
    .sort((a, b) => webmFirst(a) - webmFirst(b));
}

/** Every video file dropped in for a slot (an .mp4 and a .webm can coexist). */
export function findVideos(slot: VideoSlot): VideoSource[] {
  return sourcesNamed(slot);
}

/**
 * A numbered run of clips for a slot: `<slot>.mp4`, `<slot>-1.mp4`, `<slot>-2.mp4` …
 * in numeric order. Each entry lists that clip's sources.
 */
export function findVideoSequence(slot: VideoSlot): VideoSource[][] {
  const pattern = new RegExp(`^${slot}(-\\d+)?$`);
  const names = [...new Set(Object.keys(videoFiles).map(baseName))].filter((n) => pattern.test(n)).sort(byName);
  return names.map(sourcesNamed);
}
