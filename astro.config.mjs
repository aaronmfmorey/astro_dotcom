// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	compressHTML: true,
	// From https://docs.astro.build/en/reference/configuration-reference/#compresshtml
	markdown: {
		shikiConfig: {
		  // Choose from Shiki's built-in themes (or add your own)
		  // https://shiki.style/themes
		  theme: 'everforest-dark',
		  // Alternatively, provide multiple themes
		  // See note below for using dual light/dark themes
		//   themes: {
		// 	light: 'github-light',
		// 	dark: 'github-dark',
		//   },
		  // Disable the default colors
		  // https://shiki.style/guide/dual-themes#without-default-color
		  // (Added in v4.12.0)
		  defaultColor: false,
		}
	}
});
