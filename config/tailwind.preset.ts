/**
 * tailwind.preset.ts
 *
 * @file Tailwind CSS Preset
 *
 * This file defines a reusable Tailwind CSS config preset.
 * It includes a custom theme with color palettes, font families,
 * animations, and other design tokens. It also configures several
 * Tailwind CSS plugins to extend the framework's functionality.
 *
 * This preset is intended to be used in the main `tailwind.config.js`
 * file to ensure a consistent design system across the project.
 *
 * @see https://tailwindcss.com/docs/presets
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import headlessui from '@headlessui/tailwindcss';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';
import scrimGradients from 'tailwindcss-scrim-gradients';
import plugin from 'tailwindcss/plugin.js';

// TYPES
import type { Config, PluginAPI, PluginUtils } from 'tailwindcss/types/config';

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Creates a Tailwind color callback backed by an RGB CSS custom property.
 *
 * @param variable - CSS custom property containing the color's RGB channels.
 * @returns A callback that formats the color with Tailwind's requested opacity.
 */
function applyOpacityValue(variable: string) {
	return (options: Partial<{ opacityVariable: string; opacityValue: number }>): string => `rgb(var(${variable}) / ${options?.opacityValue || '100'})`;
}

const legacyColorLevels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const colorLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
/**
 * Builds legacy and numbered color steps for a named CSS variable palette.
 *
 * @param name - Palette prefix used in each CSS custom property name.
 * @returns Color step values mapped to Tailwind color callbacks.
 */
function colorScale(name: string) {
	/** Builds one callback entry for the legacy Tailwind color scale.
	 * @param l - Legacy scale step used in the CSS variable name.
	 * @returns The level and its opacity-aware color callback.
	 */
	function toLegacyColorEntry(l: (typeof legacyColorLevels)[number]) {
		return [l, applyOpacityValue(`--${name}${l}`)] as const;
	}
	/** Builds one callback entry for the numbered color scale.
	 * @param l - Numbered scale step used in the CSS variable name.
	 * @returns The level and its opacity-aware color callback.
	 */
	function toNumberedColorEntry(l: (typeof colorLevels)[number]) {
		return [l, applyOpacityValue(`--${name}-${l}`)] as const;
	}
	return Object.fromEntries([...legacyColorLevels.map(toLegacyColorEntry), ...colorLevels.map(toNumberedColorEntry)]) as Record<number, ReturnType<typeof applyOpacityValue>>;
}

const transform =
	'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) ';
/**
 * Creates Tailwind grid-span values for every integer in an inclusive range.
 *
 * @param start - First span size to include.
 * @param end - Last span size to include.
 * @returns Grid span classes keyed by their `span-N` utility names.
 */
function gridSpans(start: number, end: number) {
	return Object.fromEntries(
		Array.from({ length: end - start + 1 }, (_unused: undefined, i: number): [string, string] => {
			const span = start + i;
			return [`span-${span}`, `span ${span} / span ${span}`];
		}),
	);
}
/**
 * Creates CSS grid line values for every integer in an inclusive range.
 *
 * @param start - First grid line number to include.
 * @param end - Last grid line number to include.
 * @returns Grid line values keyed by their numeric line numbers.
 */
function gridLines(start: number, end: number) {
	return Object.fromEntries(
		Array.from({ length: end - start + 1 }, (_unused: undefined, i: number): [number, string] => {
			const line = start + i;
			return [line, String(line)];
		}),
	);
}

/** Maps a numbered gray token to the CSS-variable opacity callback.
 *
 * @param n - Numbered gray scale step.
 * @returns The scale key and its opacity-aware color callback.
 */
function toGrayColorEntry(n: (typeof colorLevels)[number]) {
	return [n, applyOpacityValue(`--gray-${n}`)] as const;
}

const preset: Omit<Config, 'content'> = {
	darkMode: ['variant', ['@media (prefers-color-scheme: dark) { &:not(.light *, .light) }', '&:is(.dark *, .dark)']],
	theme: {
		extend: {
			keyframes: {
				fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
				shimmer: {
					'0%, 20%': {
						maskPosition: '0 0',
						backgroundClip: 'text',
						maskImage: 'linear-gradient(110deg,white,45%,rgba(0,0,0,0.6),55%,white)',
						maskSize: '250% 100%',
					},
					'80%, 100%': {
						maskPosition: '-200% 0',
						backgroundClip: 'text',
						maskImage: 'linear-gradient(110deg,white,45%,rgba(0,0,0,0.6),55%,white)',
						maskSize: '250% 100%',
					},
				},
				wiggle: {
					'0%, 100%': { transform: transform + 'rotate(-2deg)' },
					'50%': { transform: transform + 'rotate(2deg)' },
				},
				blink: { '0%,70%,100%': { opacity: '1' }, '20%,50%': { opacity: '0' } },
				scaleIn: {
					'0%': { transform: transform + 'scale(0.95)', opacity: '0' },
					'100%': { transform: transform + 'scale(1)', opacity: '1' },
				},
				error: {
					'10%, 90%': { transform: transform + 'translateX(-1px)' },
					'20%, 80%': { transform: transform + 'translateX(2px)' },
					'30%, 50%, 70%': { transform: transform + 'translateX(-4px)' },
					'40%, 60%': { transform: transform + 'translateX(4px)' },
				},
			},
			animation: {
				'fade-in': 'fadeIn 150ms ease-in-out',
				shimmer: 'shimmer 6s ease-in-out infinite alternate',
				wiggle: 'wiggle 0.25s ease-in-out infinite',
				blink: 'blink 1.25s ease-out infinite',
				'scale-in': 'scaleIn 300ms ease-out',
				error: 'error 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
			},
			// prettier-ignore
			backgroundImage: {'gradient-from-c': 'radial-gradient(circle at center, var(--tw-gradient-stops))'},
			// prettier-ignore
			transitionTimingFunction: {'quad-in-out': 'cubic-bezier(0.46,0.03,0.52,0.96);'},
			// prettier-ignore
			fontFamily: { sans: [ 'Authentic Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif', ], serif: [ 'Avara', 'Authentic Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif', ], },
			borderRadius: { 100: '100%' },
			colors: {
				primary: colorScale('primary'),
				gray: Object.fromEntries(colorLevels.map(toGrayColorEntry)) as Record<number, ReturnType<typeof applyOpacityValue>>,
				secondary: colorScale('secondary'),
				accent: applyOpacityValue('--accent'),
				'accent-foreground': applyOpacityValue('--accent-foreground'),
				ring: applyOpacityValue('--ring'),
				background: applyOpacityValue('--background'),
			},
			ringColor: { ring: applyOpacityValue('--ring') },
			ringOffsetColor: { background: applyOpacityValue('--background') },
			scale: { 175: '1.75', 200: '2' },
			minWidth: ({ theme: t }: PluginUtils): Record<string, string> => ({ ...(t('maxWidth') as Record<string, string>) }),
			// Simple 20 column grid
			gridTemplateColumns: { 20: 'repeat(20, minmax(0, 1fr))' },
			// Simple 20 row grid
			gridTemplateRows: { 20: 'repeat(20, minmax(0, 1fr))' },
			gridColumn: gridSpans(13, 20),
			gridRow: gridSpans(7, 20),
			// prettier-ignore
			gridColumnStart: gridLines(13, 21),
			// prettier-ignore
			gridRowStart: gridLines(8, 21),
			// prettier-ignore
			gridColumnEnd: gridLines(13, 21),
			// prettier-ignore
			gridRowEnd: gridLines(8, 21),
			typography: ({ theme: t }: PluginUtils) => {
				return {
					DEFAULT: {
						css: {
							'--tw-prose-body': t('colors.gray[11]'),
							'--tw-prose-headings': t('colors.gray[12]'),
							'--tw-prose-lead': t('colors.gray[10]'),
							'--tw-prose-links': t('colors.gray[12]'),
							'--tw-prose-bold': t('colors.gray[12]'),
							'--tw-prose-counters': t('colors.primary[600]'),
							'--tw-prose-bullets': t('colors.primary[400]'),
							'--tw-prose-hr': t('colors.gray[7]'),
							'--tw-prose-quotes': t('colors.gray[12]'),
							'--tw-prose-quote-borders': t('colors.gray[7]'),
							'--tw-prose-captions': t('colors.gray[10]'),
							'--tw-prose-code': t('colors.gray[12]'),
							'--tw-prose-pre-code': t('colors.gray[3]'),
							'--tw-prose-pre-bg': t('colors.gray[12]'),
							'--tw-prose-th-borders': t('colors.gray[7]'),
							'--tw-prose-td-borders': t('colors.gray[6]'),
							'code::before': false,
							'code::after': false,
							strong: { color: 'inherit' },
							a: {
								position: 'relative',
								fontWeight: t('fontWeight.semibold'),
								textDecoration: 'underline',
								textUnderlineOffset: '3px',
							},
							'h1, h2, h3, h4, h5, h6': { color: 'inherit' },
							'a:hover': { textUnderlineOffset: '3px' },
							blockquote: {
								color: 'var(--primary-7)',
								borderLeftColor: 'rgba(var(--primary-7), 0.5)',
							},
							'li::marker': { color: 'var(--primary-7)' },
						},
					},
				};
			},
		},
	},
	plugins: [
		typography,
		headlessui,
		scrimGradients,
		animate,
		plugin(({ addVariant: a, matchVariant: m }: PluginAPI): void => {
			a('hocus', ['&:hover', '&:focus']);
			a('hocus-visible', ['&:hover', '&:focus-visible']);
			a('enabled', '&:not(:disabled)');
			m('*', (selector: string): string => `:where(& > ${selector.replace(/_/g, ' ')})`, { values: { DEFAULT: '*' } });
		}),
	],
};

export default preset;
