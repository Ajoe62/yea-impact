// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Pages render on the server by default (they read from Supabase per request).
// The home page opts into static prerendering with `export const prerender = true`.
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    // Tailwind runs as a Vite plugin, so PostCSS isn't needed. An inline config
    // also stops Vite picking up a stray postcss.config.js from a parent folder.
    css: { postcss: {} },
  },
});
