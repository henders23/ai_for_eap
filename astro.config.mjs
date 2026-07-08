// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Static, server-less output. The whole resource is client-side:
// no accounts, no backend — everything lives in the browser and exports to PDF.
export default defineConfig({
  site: 'https://henders23.github.io',
  // base: '/ai_for_eap', // set when the GitHub Pages path is confirmed
  output: 'static',
  integrations: [preact()],
  devToolbar: { enabled: false },
});
