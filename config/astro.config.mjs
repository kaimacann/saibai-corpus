import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/', import.meta.url));

export default defineConfig({
	server: { port: 3030, strictPort: true },
	output: 'static',
	integrations: [react()],
	vite: {
		css: { postcss: fileURLToPath(new URL('./', import.meta.url)) },
		resolve: {
			alias: {
				'@utils': `${src}lib/utils.ts`,
				'@components': `${src}components`,
				'@ui': `${src}components/ui`,
				'@lib': `${src}lib`,
			},
		},
	},
});
