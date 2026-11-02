// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed to GitHub Pages on the custom domain eastlachamber.com (see public/CNAME).
export default defineConfig({
  site: 'https://eastlachamber.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  image: {
    // Images are committed as originals and resized at build time.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
