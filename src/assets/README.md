# Adding images and videos

Every photo and video on the site has a **slot**. To fill one, save a file named
after the slot into the right folder. It replaces the placeholder automatically,
with no code changes. Restart `npm run dev` if it doesn't appear straight away.

- Images go in `src/assets/images/` (`.jpg`, `.png`, `.webp` or `.avif`)
- Videos go in `src/assets/videos/` (`.mp4`, optionally also `.webm`)

Example: `src/assets/images/home-mission.jpg`

Images are resized and compressed automatically, so upload them at the size
below or larger. The slot list lives in `src/lib/media.ts`.

## Images

| File name            | Where it appears                      | Recommended size |
| -------------------- | ------------------------------------- | ---------------- |
| `home-mission`       | Home: "Our mission" section           | 1200 × 1500      |
| `home-courses`       | Home: Courses card                    | 1200 × 900       |
| `home-mentorship`    | Home: Mentorship card                 | 1200 × 900       |
| `home-events`        | Home: Events card                     | 1200 × 900       |
| `home-jobs`          | Home: Opportunities card              | 1200 × 900       |
| `home-video-poster`  | Home: cover frame of the story video  | 1920 × 1080      |
| `home-gallery-1` … `home-gallery-5` | Home: community gallery | 1200 × 1200 |
| `home-gallery-6`     | Home: wide strip under the gallery    | 2400 × 800       |
| `programs-hero`      | Programs page banner                  | 2400 × 900       |
| `courses-hero`       | Courses page and each course page     | 2400 × 900       |
| `mentorship-hero`    | Mentorship page and each mentor page  | 2400 × 900       |
| `events-hero`        | Events page and each event page       | 2400 × 900       |
| `jobs-hero`          | Jobs page and each job page           | 2400 × 900       |
| `login-side`         | Sign-in page, beside the form         | 1200 × 1600      |

## Home hero photos

Photos named `hero1`, `hero2` … (or `hero-1` …) in `src/assets/images/` play in
the home hero after the hero clips, about 6 seconds each with a slow zoom, in
number order. Use landscape shots at least 1672 px wide; the headline sits on
the left, so prefer photos whose subject is on the right.

## Scrolling photo strip

Every photo in `src/assets/images/marquee/` scrolls across the page under the
home hero, in file-name order. Add or remove files freely; any number works.

## Videos

| File name    | Where it appears                                              |
| ------------ | ------------------------------------------------------------- |
| `home-story` | Home: "Our story" section. Plays with sound and controls.     |
| `home-hero-1`, `home-hero-2` … | Clips behind the home headline. They play in order and cross-fade into each other, then the hero photos play, then it loops. Add as many as you like. |

Tips:

- **Story video:** 1080p MP4 (H.264). Keep it under about 50 MB. For anything
  longer than a few minutes, host it on YouTube or Vimeo instead.
- **Hero clips:** 10–20 seconds each, ideally under 10 MB
  each. Only the first clip loads with the page; each later one is fetched
  just before it is needed. The headline sits on the left, so prefer footage
  whose subject is on the right. A dark green gradient shows until the first
  clip plays, and instead of the videos for visitors who have turned on
  "reduce motion". Sound plays where the browser allows it; otherwise clips
  play muted and a "Tap for sound" button turns it on.
