import { terraErrorBoundaryIntegration as __terraErrorBoundaryIntegration } from '@terra-symposium/standards-error-boundaries/astro-integration';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/', import.meta.url));

export default defineConfig({
	outDir: fileURLToPath(new URL('../dist/site/', import.meta.url)),
	cacheDir: fileURLToPath(new URL('../dist/cache/astro/', import.meta.url)),
	server: { port: 3030, strictPort: true },
	output: 'static',
	integrations: [__terraErrorBoundaryIntegration(), react()],
	vite: {
		cacheDir: fileURLToPath(new URL('../dist/cache/vite/', import.meta.url)),
		css: { postcss: fileURLToPath(new URL('./', import.meta.url)) },
		resolve: { alias: { '@utils': `${src}lib/utils.ts`, '@components': `${src}components`, '@ui': `${src}components/ui`, '@lib': `${src}lib` } },
	},
});
