import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://arifmuamardev.github.io',
  base: '/ppi-ishikawa',
  vite: {
    plugins: [tailwindcss()],
  },
});
