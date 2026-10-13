import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PPI_PREVIEW_SITE_URL === 'https://preview.ppi-ishikawa.org'
    ? 'https://preview.ppi-ishikawa.org'
    : 'https://ppi-ishikawa.org',
  vite: {
    plugins: [tailwindcss()],
  },
});
