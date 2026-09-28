/**
 * astro/src/pages/docs/_custom/saibai.tsx
 * React-only entry point for the Saibai corpus docs family.
 * Folder boundary: Saibai-specific authorable content; generic Docs components remain outside `_custom`.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API

import { cn } from '@utils';
import { useMediaStore } from '@vidstack/react';
import { useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cva } from 'class-variance-authority';
import { createElement, useCallback, useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import 'vidstack/styles/base.css';
import { CarbonIcon } from './carbon-icons';

// COMPONENTS

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog';
import Dagre from '@dagrejs/dagre';
import { Slot } from '@radix-ui/react-slot';
import * as Tabs from '@radix-ui/react-tabs';
import { AlertError } from '@ui/alert';
import { MediaMuteButton, MediaOutlet, MediaPlayButton, MediaPlayer, MediaSeekButton, MediaSliderThumbnail, MediaSliderValue, MediaTime, MediaTimeSlider } from '@vidstack/react';
import { Background, Handle, Panel, Position, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

// TYPES

import type { AudioCtrlsProps, MarqueeComponentProps, Person, PlayerProps, SaibaiFlowNode as FlowNode } from '@lib/types';
import type { Edge as ReactFlowEdge, Node, NodeProps } from '@xyflow/react';
import type { VariantProps } from 'class-variance-authority';
import type { JSX } from 'react';
import type { ReactNode } from 'react';
import type { MapGeography } from 'react-simple-maps';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders the Saibai corpus landing page without an Astro layout wrapper.
 */
export function Saibai(): JSX.Element {
	return (
		<ErrorBoundary name='Saibai'>
			<div className='grain bg-cyan-50 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-50'>
				<main className='relative min-h-screen'>
					<Acknowledgment />
					{/* corpus */}
					<Corpus defaultTab='Chronological' />
				</main>
				{/* footer */}
				<footer id='footer' className='grain relative z-20 bg-cyan-50 text-cyan-900 sm:grid-cols-1 md:grid-cols-2 lg:grid dark:bg-cyan-800 dark:text-cyan-50 print:hidden'>
					<div className='col-start-1 p-12 lg:pr-32'>
						Saibai Corpus acknowledges the Aboriginal and Torres Strait Islander peoples as the Traditional Custodians of Country, and recognises their enduring connection to land, sea, and community.
						We pay our respects to the Koeybuway and Moegibuway peoples of Saibai Island, whose rich storytelling traditions we seek to honour and help preserve.
					</div>
					<nav className='col-start-2 grid gap-10 p-12 text-2xl sm:grid-cols-2'>
						<span className='mb-6'>
							<p className='mb-2 font-mono leading-tight'>saibai corpus</p>
							<span>© {new Date().getFullYear()}</span>
						</span>
						<ul className='flex flex-col gap-2'>
							{[
								['Kai Macann', 'https://www.linkedin.com/in/kaimacann/'],
								['Friendcis Meeko Estores', 'https://www.linkedin.com/in/meeko-estores-78444822b'],
								['Jack Linz', 'https://www.linkedin.com/in/jack-linz-942a33358'],
								['Jake Salamon'],
								['Nathan Kam'],
								['Benjamin Li'],
							].map(([n, h]) => (
								<a key={n} className='flex gap-4 !outline-none transition-transform' href={h} target='_blank'>
									<span className='decoration-2 underline-offset-4 hocus:underline'>{n}</span>
								</a>
							))}
						</ul>
					</nav>
				</footer>
			</div>
		</ErrorBoundary>
	);
}

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

/**
 * Describes the documented declaration.
 *
 * @remarks Shared wrapper styles for the main Saibai panels.
 */
export const PANEL_CLASSES = 'relative size-full overflow-clip rounded border border-cyan-800 scrim-cyan-900 scrim-14';
/**
 * Describes the documented declaration.
 *
 * @remarks Shared layout styles for tab panels in the Saibai corpus UI.
 */
export const TAB_VIEW_CLASSES = 'relative data-[state=active]:flex data-[state=inactive]:hidden h-screen w-full grow flex-col p-10';
/**
 * Describes the documented declaration.
 *
 * @remarks Shared control styles for Saibai media buttons.
 */
export const MEDIA_BUTTON_CLASSES = 'flex size-12 items-center justify-center rounded-full outline-none ring-inset ring-offset-4 data-[focus]:ring-2 data-[focus]:ring-blue-400';

/*//////////////////////////////////////////////////
UI COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Describes the documented declaration.
 *
 * @remarks Defines variant styles for the Button component using class-variance-authority.
 *
 * @param props - Standard CVA parameters.
 *
 * @returns A string of compiled Tailwind classes.
 */
export const buttonVariants = cva(
	cn(
		'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold',
		'ring-offset-primary-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
	),
	{
		variants: {
			variant: {
				default: 'bg-cyan-700 text-white enabled:hover:bg-cyan-800',
				tonal: 'border border-cyan-800 bg-cyan-300 text-cyan-950 enabled:hover:bg-cyan-400',
				secondary: 'border border-yellow-700 bg-yellow-300 text-yellow-950 enabled:hover:bg-yellow-400',
				destructive: 'border border-rose-700 bg-rose-600 text-white enabled:hover:bg-rose-600/90 dark:border-rose-800 dark:bg-rose-900 dark:hover:bg-rose-900/90',
				outline: 'border border-gray-5 bg-white text-gray-12 enabled:hover:bg-gray-1 dark:bg-cyan-200 enabled:dark:hover:bg-cyan-200',
				ghost: 'hover:bg-gray-3',
				inline: 'text-gray-11 underline-offset-4 enabled:hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				xs: 'h-6 rounded-md p-2 text-xs',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
type PersonNodeData = FlowNode & Record<string, unknown>;
type PersonGraphNode = Node<PersonNodeData, 'custom'> & { type: 'custom' };
type MarriageGraphNode = Node<Record<string, never>, 'marriageConnector'> & { type: 'marriageConnector' };
type GenealogyNode = PersonGraphNode | MarriageGraphNode;

/**
 * Describes the documented declaration.
 *
 * @remarks A generic button component that supports Radix Slot for polymorphic rendering.
 *
 * @param props - ButtonProps containing styling variants and children.
 * @param ref - React forward ref.
 *
 * @returns Rendered HTML button or Radix Slot.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

/**
 * Renders the marquee component.
 *
 * @remarks A continuous scrolling marquee component for text or elements.
 *
 * @param props - MarqueeComponentProps to control speed, direction, and behavior.
 *
 * @param reverse - Whether the marquee content travels in reverse.
 * @param duration - Duration of one marquee animation cycle in milliseconds.
 * @param delay - Delay before each marquee animation cycle begins in milliseconds.
 * @param ease - Timing function, or the default easing curve when set to true.
 * @param pauseOnHover - Whether hovering pauses the marquee animation.
 * @param pauseOnClick - Whether pressing the marquee pauses the animation.
 * @param className - Additional classes applied to the marquee wrapper.
 * @param children - Content repeated across the marquee track.
 * @param as - Element used for each repeated marquee item.
 *
 * @returns Rendered marquee container.
 */
export const Marquee = ({ reverse, duration = 40000, delay = 0, ease = 'linear', pauseOnHover, pauseOnClick = true, className, children, as = 'span' }: MarqueeComponentProps): React.JSX.Element => (
	<ErrorBoundary name='Marquee'>
		<div className={`group select-none overflow-x-clip ${className}`} tabIndex={-1}>
			<span
				className={` ${pauseOnHover && 'group-hover:!paused'} ${pauseOnClick && 'group-active:!paused'} ${reverse && '!direction-reverse'} inline-flex whitespace-nowrap fill-mode-both motion-reduce:!paused`}
				style={{ animation: `slide ${duration}ms ${delay}ms ${ease === true ? 'cubic-bezier(0.46,0.03,0.52,0.96)' : ease} infinite` }}
			>
				{[...Array(4)].map((_x, i) => createElement(as, { key: i }, children))}
			</span>
		</div>
	</ErrorBoundary>
);

/**
 * Renders the acknowledgment component.
 *
 * @remarks Sensitivity warning modal intended for initial page load.
 *
 * @returns Dialog modal component.
 */
export function Acknowledgment(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<ErrorBoundary name='Acknowledgment'>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent aria-describedby={undefined} className='light text-clip bg-white text-left text-cyan-900 dark:bg-white dark:text-cyan-900'>
					<DialogHeader>
						<DialogTitle className='text-left text-cyan-900'>Sensitivity Warning</DialogTitle>
						<DialogDescription className='sr-only'>Aboriginal and Torres Strait Islander people sensitivity warning.</DialogDescription>
					</DialogHeader>
					<p className='text-sm text-cyan-900'>Aboriginal and Torres Strait Islander people should be aware that this website contains images, sounds and names of deceased persons.</p>
					<Button
						onClick={() => {
							setIsOpen(false);
						}}
						className='mt-4 w-fit'
					>
						Continue
					</Button>
				</DialogContent>
			</Dialog>
		</ErrorBoundary>
	);
}

/*//////////////////////////////////////////////////
MEDIA COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders the slider track component.
 *
 * @remarks Vidstack-based slider track base layer.
 *
 * @param className - Value passed to the helper.
 *
 *
 * @returns Track div element.
 */
const SliderTrack = ({ className }: { className?: string }) => <div className={cn('absolute left-0 top-0 z-0 size-full bg-gray-100', className)} />;

/**
 * Renders the slider track fill component.
 *
 * @remarks Vidstack-based slider fill layer representing current playback.
 *
 * @param className - Value passed to the helper.
 *
 *
 * @returns Track fill div element.
 */
const SliderTrackFill = ({ className }: { className?: string }) => (
	<div className={cn('absolute left-0 top-0 z-20 size-full scale-x-[var(--slider-fill-rate)] bg-black will-change-transform live:bg-red-500', className)} style={{ transformOrigin: 'left center' }} />
);

/**
 * Renders the slider track progress component.
 *
 * @remarks Vidstack-based slider progress layer representing buffered media.
 *
 * @param className - Value passed to the helper.
 *
 *
 * @returns Progress div element.
 */
const SliderTrackProgress = ({ className }: { className?: string }) => (
	<div
		className={cn('absolute left-0 top-0 z-10 size-full scale-x-[calc(var(--media-buffered)/var(--media-duration))] bg-black opacity-10 will-change-transform', className)}
		style={{ transformOrigin: 'left center' }}
	/>
);

/**
 * Renders the slider thumb component.
 *
 * @remarks Vidstack-based slider thumb indicator.
 *
 * @param className - Value passed to the helper.
 *
 *
 * @returns Thumb indicator div element.
 */
const SliderThumb = ({ className }: { className?: string }) => (
	<div className={cn('absolute left-[var(--slider-fill-percent)] top-0 z-20 h-full w-0.5 -translate-x-1/2 scale-200 group-data-[dragging]:left-[var(--slider-pointer-percent)]', className)}>
		<div className='size-full rounded-full bg-black outline outline-1 outline-white group-data-[focus]:ring-2 group-data-[focus]:ring-blue-400' />
	</div>
);

/**
 * Renders the slider preview component.
 *
 * @remarks Hover preview container for the Vidstack slider.
 *
 * @param children - Preview components (thumbnails, timestamps).
 *
 *
 * @returns Preview container element.
 */
const SliderPreview = ({ children }: { children: ReactNode }) => (
	<div
		className='absolute left-[var(--preview-left)] top-[var(--preview-top)] flex -translate-x-1/2 translate-y-1 flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in'
		slot='preview'
	>
		{children}
	</div>
);

/**
 * Renders the media slider component.
 *
 * @remarks Vidstack Media Slider containing track, thumb, and preview.
 *
 * @param src - Src input supplied to media slider's operation.
 *
 *
 *
 * @param className - Additional CSS classes merged into media slider.
 *
 * @returns Media time slider component.
 */
export function MediaSlider({ className, src }: { className?: string; src?: string }): React.JSX.Element {
	return (
		<ErrorBoundary name='MediaSlider'>
			<MediaTimeSlider className={cn('group h-6 py-2 focus:outline-none', className)} aria-label='Audio progress slider'>
				<div className='relative size-full focus:ring-0'>
					<SliderTrack />
					<SliderTrackFill />
					<SliderTrackProgress />
					<SliderThumb />
				</div>
				<SliderPreview>
					<MediaSliderThumbnail src={src} />
					<MediaSliderValue type='pointer' format='time' className='w-max max-w-xs animate-fade-in rounded border bg-white px-2 py-1 shadow delay-75' />
				</SliderPreview>
			</MediaTimeSlider>
		</ErrorBoundary>
	);
}

/**
 * Renders the play button component.
 *
 * @remarks Vidstack Play/Pause button wrapper handling iconography.
 *
 * @param attrs - Additional HTML attributes passed through play button.
 *
 * @returns Play/Pause button component.
 */
function PlayButton({ ...attrs }) {
	const { paused } = useMediaStore();
	const label = paused ? 'Play' : 'Pause';
	return (
		<MediaPlayButton className={cn(MEDIA_BUTTON_CLASSES)} aria-label={label} {...attrs}>
			{paused ? <CarbonIcon name='play-filled' className='block size-full scale-150' /> : <CarbonIcon name='pause-outline-filled' className='block size-full scale-150' />}
		</MediaPlayButton>
	);
}

/**
 * Renders the audio controls component.
 *
 * @remarks Consolidated media controls handling play, seek, volume, and timeline.
 *
 * @param props - AudioCtrlsProps.
 * @param className - Additional CSS classes merged into audio controls.
 * @param attrs - Additional HTML attributes passed through audio controls.
 *
 * @returns Media controls layout component.
 */
function AudioControls({ className, ...attrs }: AudioCtrlsProps) {
	const { paused, muted } = useMediaStore();
	const BUTTON_WRAPPER = 'flex gap-4 *:-mx-3 *:p-3 items-center';
	return (
		<div className={cn('pointer-events-none', className)} role='group' aria-label='Media Controls' {...attrs}>
			<div className={cn('pointer-events-none min-h-[48px] w-full can-control:pointer-events-auto', BUTTON_WRAPPER)}>
				<div className={'py-0 ' + BUTTON_WRAPPER}>
					<MediaSeekButton className={MEDIA_BUTTON_CLASSES} seconds={-30} aria-label='Seek back 30 seconds' data-tooltip='Jump back'>
						<CarbonIcon name='rewind-30' className='size-full' />
					</MediaSeekButton>
					<PlayButton data-tooltip={paused ? 'Play' : 'Pause'} />
					<MediaSeekButton className={MEDIA_BUTTON_CLASSES} seconds={30} aria-label='Seek forward 30 seconds' data-tooltip='Jump forward'>
						<CarbonIcon name='forward-30' className='size-full' />
					</MediaSeekButton>
				</div>
				<div className='m-0 flex grow items-center gap-4 self-stretch border-l p-0 pl-4'>
					<MediaTime type='current' className='text-sm' />
					<MediaSlider />
					<MediaTime type='duration' className='text-sm' />
				</div>
				<MediaMuteButton className={cn(MEDIA_BUTTON_CLASSES)} aria-label={muted ? 'Unmute' : 'Mute'} data-tooltip={muted ? 'Unmute' : 'Mute'}>
					{muted ? <CarbonIcon name='volume-mute-filled' className='block size-full scale-75' /> : <CarbonIcon name='volume-up-filled' className='block size-full scale-75' />}
				</MediaMuteButton>
			</div>
		</div>
	);
}

/**
 * Renders the player component.
 *
 * @remarks Core audio player component rendering artwork, metadata, and controls via Vidstack.
 *
 * @param props - PlayerProps containing media source and metadata.
 * @param src - Src input supplied to player's operation.
 * @param poster - Poster input supplied to player's operation.
 * @param title - Heading text shown in player.
 * @param author - Author input supplied to player's operation.
 * @param meta - Meta input supplied to player's operation.
 * @param className - Additional CSS classes merged into player.
 * @param alt - Alt input supplied to player's operation.
 * @param attrs - Additional HTML attributes passed through player.
 *
 * @returns Fully constructed MediaPlayer component.
 */
export function Player({ src, poster, title, author, meta, className, alt, ...attrs }: PlayerProps): React.JSX.Element {
	return (
		<ErrorBoundary name='Player'>
			<MediaPlayer src={src} className={cn('inline-block rounded-md border bg-white text-black shadow', className)} {...attrs}>
				<MediaOutlet />
				{title && (
					<div className='flex flex-row items-center border-b px-5 py-4'>
						{poster && <img className='mr-6 size-20 shrink-0 basis-20 rounded-md border bg-gray-100 text-transparent' alt={alt || `Media art for '${title}'`} src={poster} />}
						<div className='-mx-1 basis-full overflow-hidden px-1'>
							<span className='mb-2 inline-block text-lg font-bold'>{title}</span>
							{author && <p className='mb-1 mt-0 pt-0 leading-snug text-gray-500'>{author}</p>}
							{meta && <p className='mb-1 leading-snug text-gray-500'>{meta}</p>}
						</div>
					</div>
				)}
				<AudioControls className={cn('transition-all buffering:animate-pulse', title ? 'px-5' : 'px-3')} />
			</MediaPlayer>
		</ErrorBoundary>
	);
}

/*//////////////////////////////////////////////////
MAP COMPONENT
//////////////////////////////////////////////////*/

/**
 * Renders the geographic map component.
 *
 * @remarks Interactive SVG map using TopoJSON data. Selectable geometries open a details dialog.
 *
 * @returns Geographic Map.
 */
export function GeographicMap(): React.JSX.Element {
	const [selectedGeo, setSelectedGeo] = useState<MapGeography | null>(null);

	const geoJsonData = useMemo(() => {
		const objectKey = 'export (1)1';
		return SAIBAI.objects[objectKey] ? feature(SAIBAI as never, SAIBAI.objects[objectKey] as never) : null;
	}, []);

	if (!geoJsonData) return <div>Loading map data or data is invalid...</div>;

	return (
		<ErrorBoundary
			name='SaibaiGeographicMap'
			fallback={() => <AlertError title='Map Display Error' description='The geographic map of Saibai Island could not be displayed. The rest of the page remains fully accessible.' />}
		>
			<div className={PANEL_CLASSES}>
				<ComposableMap projection='geoMercator' className='size-full'>
					<ZoomableGroup center={[142.62, -9.38]} zoom={50} minZoom={10} maxZoom={500}>
						<Geographies geography={geoJsonData}>
							{({ geographies }) =>
								geographies.map(g => {
									const properties = g.properties || {};
										const isLine = typeof g.geometry?.type === 'string' && ['LineString', 'MultiLineString'].includes(g.geometry.type);
									let className = 'pointer-events-none fill-transparent stroke-none';
									if (properties.building === 'house') className = 'fill-amber-500';
									else if (properties.building) className = 'fill-red-950';
									else if (properties.highway || properties.aeroway) className = 'fill-none stroke-gray-500 stroke-[0.05]';
									else if (properties.natural === 'coastline') className = isLine ? 'stroke-emerald-800 stroke-[0.05] fill-none' : 'fill-emerald-800';
									else if (properties.waterway) className = isLine ? 'stroke-cyan-950 stroke-[0.05] fill-none' : 'fill-cyan-950';
									else if (properties.natural === 'water' || properties.landuse === 'reservoir') className = 'fill-cyan-950';
									else if (properties.name && properties.name !== 'Saibai Island' && !isLine) className = 'fill-amber-300 hover:fill-amber-400 hover:cursor-pointer';
									/**
									 * Handles click.
									 */
									let handleClick = () => {};
									const isInteractive = !isLine && ((properties.landuse && properties.landuse !== 'residential') || (properties.name && properties.name !== 'Saibai Island'));
									if (isInteractive) {
										className = cn(className, 'pointer-events-auto fill-yellow-300 hover:cursor-pointer hover:fill-yellow-400');
										handleClick = () => {
											setSelectedGeo(g);
										};
									}
									return (
										<Geography
											key={g.rsmKey}
											geography={g}
											onClick={handleClick}
											className={cn('pointer-events-auto outline-none focus:outline-none active:outline-none', g.rsmKey, className)}
										/>
									);
								})
							}
						</Geographies>
					</ZoomableGroup>
				</ComposableMap>

				{selectedGeo && (
					<Dialog open={!!selectedGeo} onOpenChange={o => !o && setSelectedGeo(null)}>
						<DialogContent aria-describedby={undefined} className='text-clip bg-white text-left text-cyan-900 dark:bg-white dark:text-cyan-900'>
							<DialogHeader className='text-left'>
								<DialogTitle className='font-mono text-4xl font-bold text-cyan-900'>
									{selectedGeo.properties?.name ||
										(selectedGeo.properties?.landuse && selectedGeo.properties.landuse.charAt(0).toUpperCase() + selectedGeo.properties.landuse.slice(1)) ||
										'Feature Details'}
								</DialogTitle>
								{selectedGeo.properties?.description && <DialogDescription className='text-cyan-900/50'>{selectedGeo.properties.description}</DialogDescription>}
								{!selectedGeo.properties?.description && <DialogDescription className='sr-only'>Details for {selectedGeo.properties?.name || 'feature'}.</DialogDescription>}
							</DialogHeader>
							{selectedGeo.properties?.videos?.map((v, i) => (
								<div key={i} className='relative mb-4 aspect-video w-full max-w-md overflow-hidden rounded'>
									<div className='absolute inset-0 z-0 animate-pulse rounded bg-gray-500' />
									<iframe
										src={`${v.src}?badge=0&autopause=0&player_id=0&app_id=58479`}
										allow='autoplay; fullscreen; picture-in-picture'
										className='relative z-10 size-full'
										title={v.title || `Video ${i + 1}`}
									/>
								</div>
							))}
							{(!selectedGeo.properties?.videos || selectedGeo.properties.videos.length === 0) && <p className='mb-6 text-sm text-cyan-900 opacity-50'>No videos available for this feature.</p>}
						</DialogContent>
					</Dialog>
				)}
			</div>
		</ErrorBoundary>
	);
}

/*//////////////////////////////////////////////////
GENEALOGY COMPONENTS
//////////////////////////////////////////////////*/

const genealogyData: Person[] = [
	{
		id: 'gemetu-0',
		name: 'Gemetu',
		spouseId: 'kokeu-0',
		parents: [],
		children: ['giwa-1', 'asa-1', 'asaii-1', 'kaigab-1', 'nancy-1'],
		clans: ['Daibau'],
		audio: [
			{ title: 'Maduba na puidam', author: 'Gemetu (singer, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1077XX-0100M0.mp3', date: '', source: 'Wax Cylinders' },
			{ title: 'Mawau na puidam', author: 'Gemetu (singer, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1079XX-0100M0.mp3', date: '', source: 'Wax Cylinders' },
		],
	},
	{ id: 'kokeu-0', name: 'Kokeu', spouseId: 'gemetu-0', parents: [], children: ['giwa-1', 'asa-1', 'asaii-1', 'kaigab-1', 'nancy-1'], clans: ['Samu'] },
	{ id: 'giwa-1', name: 'Giwa', spouseId: null, parents: ['gemetu-0', 'kokeu-0'], children: [], clans: [] },
	{ id: 'asa-1', name: 'Asa', spouseId: 'kargar-1', parents: ['gemetu-0', 'kokeu-0'], children: ['warusam-2', 'nganabusa-2', 'aniba-2', 'warubam-2', 'wodi-2', 'tamu-2'], clans: ['Daibau'] },
	{ id: 'kargar-1', name: 'Kargar', spouseId: 'asa-1', parents: [], children: ['warusam-2', 'nganabusa-2', 'aniba-2', 'warubam-2', 'wodi-2', 'tamu-2'], clans: ['Kodal'] },
	{ id: 'warusam-2', name: 'Warusam', spouseId: null, parents: ['asa-1', 'kargar-1'], children: [], clans: ['Daibau'] },
	{ id: 'nganabusa-2', name: 'Nganabusa', spouseId: null, parents: ['asa-1', 'kargar-1'], children: [], clans: ['Daibau'] },
	{ id: 'aniba-2', name: 'Aniba', spouseId: null, parents: ['asa-1', 'kargar-1'], children: [], clans: ['Daibau'] },
	{ id: 'warubam-2', name: 'Warubam', spouseId: null, parents: ['asa-1', 'kargar-1'], children: [], clans: ['Daibau'] },
	{ id: 'wodi-2', name: 'Wodi', spouseId: 'tamu-2', parents: ['asa-1', 'kargar-1'], children: ['baideu-3', 'teniu-3', 'mudu-3', 'danazur-3'], clans: ['Samu'] },
	{ id: 'tamu-2', name: 'Tamu', spouseId: 'wodi-2', parents: ['asa-1', 'kargar-1'], children: ['baideu-3', 'teniu-3', 'mudu-3', 'danazur-3'], clans: ['Daibau'] },
	{ id: 'baideu-3', name: 'Baideu', spouseId: null, parents: ['wodi-2', 'tamu-2'], children: [], clans: ['Samu'] },
	{ id: 'teniu-3', name: 'Teniu', spouseId: null, parents: ['wodi-2', 'tamu-2'], children: [], clans: ['Samu'] },
	{ id: 'mudu-3', name: 'Mudu', spouseId: null, parents: ['wodi-2', 'tamu-2'], children: [], clans: ['Samu'] },
	{ id: 'danazur-3', name: 'Danazur', spouseId: null, parents: ['wodi-2', 'tamu-2'], children: [], clans: ['Samu'] },
	{ id: 'asaii-1', name: 'Asaii', spouseId: 'kawk-1', parents: ['gemetu-0', 'kokeu-0'], children: ['giwa-2', 'ngangabunga-2', 'uniba-2'], clans: ['Daibau'] },
	{ id: 'kawk-1', name: 'Kawk', spouseId: 'asaii-1', parents: [], children: ['giwa-2', 'ngangabunga-2', 'uniba-2'], clans: ['Samu'] },
	{ id: 'giwa-2', name: 'Giwa', spouseId: null, parents: ['kawk-1', 'asaii-1'], children: [], clans: ['Daibau'] },
	{ id: 'ngangabunga-2', name: 'Ngangabunga', spouseId: null, parents: ['kawk-1', 'asaii-1'], children: [], clans: ['Samu'] },
	{ id: 'uniba-2', name: 'Uniba', spouseId: null, parents: ['kawk-1', 'asaii-1'], children: [], clans: ['Samu'] },
	{ id: 'saibai-2', name: 'Saibai', spouseId: 'kaigab-1', parents: [], children: [], clans: ['Tabu'] },
	{ id: 'kaigab-1', name: 'Kaigab', spouseId: 'saibai-2', parents: ['gemetu-0', 'kokeu-0'], children: [], clans: ['Tabu'] },
	{ id: 'nancy-1', name: 'Nancy', spouseId: null, parents: ['gemetu-0', 'kokeu-0'], children: [], clans: [] },
];

/**
 * Handles get layouted elements.
 *
 * @remarks Calculates directed acyclic graph layout using Dagre.
 *
 * @param nodes - Array of unpositioned React Flow nodes.
 * @param edges - Array of React Flow edges.
 * @param options - Optional config for the operation.
 *
 * @returns Object containing nodes with updated positions and unmodified edges.
 */
const getLayoutedElements = <TNode extends Node>(nodes: TNode[], edges: ReactFlowEdge[], opts: { direction: string; nodesep?: number; ranksep?: number }): { edges: ReactFlowEdge[]; nodes: TNode[] } => {
	const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
	g.setGraph({ rankdir: opts.direction, nodesep: opts.nodesep || 50, ranksep: opts.ranksep || 50 });
	edges.forEach(e => g.setEdge(e.source, e.target));
	nodes.forEach(n => {
		let width = n.measured?.width ?? 150;
		let height = n.measured?.height ?? 50;
		if (n.type === 'marriageConnector') {
			width = 20;
			height = 20;
		}
		g.setNode(n.id, { ...n, width, height });
	});
	Dagre.layout(g);
	return {
		nodes: nodes.map(n => {
			const { x, y } = g.node(n.id);
			let width = n.measured?.width ?? 150;
			let height = n.measured?.height ?? 50;
			if (n.type === 'marriageConnector') {
				width = 20;
				height = 20;
			}
			return { ...n, position: { x: x - width / 2, y: y - height / 2 }, draggable: false };
		}),
		edges: [...edges],
	};
};

/**
 * Renders the person node component.
 *
 * @remarks React Flow Custom Node to display a Person in the tree.
 *
 * @param data - FlowNode data containing personal information and edge visibility toggles.
 *
 *
 *
 *
 * @returns Person Node.
 */
function PersonNode({ data }: NodeProps<PersonGraphNode>) {
	const { nodeData, setSelectedNode } = data;
	/**
	 * Handles node click.
	 */
	const handleNodeClick = () => {
		const originalGNode = genealogyData.find(g => g.id === nodeData.id || (g.name === nodeData.name && !genealogyData.some(p => p.id === nodeData.id && p.name !== nodeData.name)));
		setSelectedNode(originalGNode || { ...nodeData, spouseId: null, parents: [], children: [] });
	};
	return (
		<button
			onClick={handleNodeClick}
			className='flex h-20 max-w-48 flex-col items-center justify-center text-pretty rounded border-2 border-cyan-600 bg-cyan-600 px-4 py-2 text-sm text-white shadow-md hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-950 disabled:text-white'
			disabled={!nodeData.audio}
		>
			<div className='text-center font-semibold'>{nodeData.name}</div>
			{nodeData.clans && nodeData.clans.length > 0 && <div className='mt-1 text-center text-xs opacity-80'>{nodeData.clans.join(', ')}</div>}
			{nodeData.annotations && nodeData.annotations.length > 0 && <div className='mt-1 text-center text-xs italic'>{nodeData.annotations.join(', ')}</div>}
			{data.origin && <Handle type='target' position={Position.Top} className='!size-2 !border-none !bg-cyan-600' />}
			{data.terminus && <Handle type='source' position={Position.Bottom} className='!size-2 !border-none !bg-cyan-600' />}
		</button>
	);
}

/**
 * Renders the marriage connector node component.
 *
 * @remarks Invisible intermediary node that joins two spouses and stems down to children.
 *
 * @returns Div element styling the marriage node and Handle connectors.
 */
function MarriageConnectorNode() {
	return (
		<>
			<div style={{ width: '12px', height: '12px', backgroundColor: '#A0A0A0', borderRadius: '50%', border: '1px solid #666' }} />
			<Handle type='target' position={Position.Top} style={{ background: 'transparent', border: 'none', width: '1px', height: '1px', top: '-5px' }} isConnectable={true} />
			<Handle type='source' position={Position.Bottom} style={{ background: 'transparent', border: 'none', width: '1px', height: '1px', bottom: '-5px' }} isConnectable={true} />
		</>
	);
}

const nodeTypes = { custom: PersonNode, marriageConnector: MarriageConnectorNode };

/**
 * Renders the layout flow component.
 *
 * @remarks Coordinates graph state, Dagre layout initialization, and modal interaction for the Genealogy tree.
 *
 * @param genealogyData - Array of Person records defining the tree structure.
 *
 *
 * @returns React Flow map interface with layout controls and item inspection modal.
 */
const LayoutFlow = ({ genealogyData }: { genealogyData: Person[] }) => {
	// STATES
	const [selNode, setSelNode] = useState<Person | null>(null);
	const { fitView } = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState<GenealogyNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);
	const containerRef = React.useRef<HTMLDivElement>(null);

	// INIT
	const { initialNodes, initialEdges } = useMemo(() => {
		const nNodes: GenealogyNode[] = [];
		const nEdges: ReactFlowEdge[] = [];
		const personNodeMap = new Map<string, Person>();
		const marriageSet = new Set<string>();
		genealogyData.forEach(g => {
			nNodes.push({ id: g.id, type: 'custom', data: { setSelectedNode: setSelNode, nodeData: g, origin: false, terminus: false }, position: { x: 0, y: 0 } });
			personNodeMap.set(g.id, g);
		});
		genealogyData.forEach(g => {
			if (g.spouseId) {
				const primaryPersonId = g.id;
				const spouseNodeId = genealogyData.find(p => p.id === g.spouseId)?.id || `spouse-node-for-${primaryPersonId}`;
				if (!personNodeMap.has(spouseNodeId)) {
					const spouseDisplayData: Person = { id: spouseNodeId, name: g.spouseId, clans: [], parents: [], children: [], spouseId: primaryPersonId };
					nNodes.push({ id: spouseNodeId, type: 'custom', data: { setSelectedNode: setSelNode, nodeData: spouseDisplayData, origin: false, terminus: false }, position: { x: 0, y: 0 } });
					personNodeMap.set(spouseNodeId, spouseDisplayData);
				}
				// Deduplicate structural relationships
				const sortedIds = [primaryPersonId, spouseNodeId].sort();
				const marriageNodeId = `marriage-${sortedIds[0]}-${sortedIds[1]}`;
				if (!marriageSet.has(marriageNodeId)) {
					marriageSet.add(marriageNodeId);
					nNodes.push({ id: marriageNodeId, type: 'marriageConnector', data: {}, position: { x: 0, y: 0 } });
					nEdges.push({ id: `edge-${primaryPersonId}-to-${marriageNodeId}`, source: primaryPersonId, target: marriageNodeId, type: 'smoothstep', style: { strokeDasharray: '5,5', stroke: '#888' } });
					nEdges.push({ id: `edge-${spouseNodeId}-to-${marriageNodeId}`, source: spouseNodeId, target: marriageNodeId, type: 'smoothstep', style: { strokeDasharray: '5,5', stroke: '#888' } });
					g.children.forEach(c => {
						if (personNodeMap.has(c)) {
							nEdges.push({ id: `edge-${marriageNodeId}-to-${c}`, source: marriageNodeId, target: c, type: 'smoothstep' });
						}
					});
				}
			} else {
				g.children.forEach(c => {
					if (personNodeMap.has(c)) nEdges.push({ id: `edge-${g.id}-to-${c}`, source: g.id, target: c, type: 'smoothstep' });
				});
			}
		});
		const tgts = new Set(nEdges.map(e => e.target));
		const srcs = new Set(nEdges.map(e => e.source));
		nNodes.forEach(n => {
			if (n.type === 'custom') {
				n.data.origin = tgts.has(n.id);
				n.data.terminus = srcs.has(n.id);
			}
		});
		return { initialNodes: nNodes, initialEdges: nEdges };
	}, [genealogyData, setSelNode]);

	React.useEffect(() => {
		if (initialNodes.length > 0) {
			const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, { direction: 'TB', nodesep: 70, ranksep: 90 });
			setNodes(layoutedNodes);
			setEdges(layoutedEdges);
			// Native `fitView` React Flow prop correctly manages initial bounding box measurements safely.
		}
	}, [initialNodes, initialEdges, setNodes, setEdges]);

	React.useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			entries => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					window.requestAnimationFrame(() => {
						fitView();
					});
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
		};
	}, [fitView]);

	const onLayout = useCallback(
		(direction: string) => {
			const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, { direction, nodesep: 70, ranksep: 90 });
			setNodes([...layoutedNodes]);
			setEdges([...layoutedEdges]);
			window.requestAnimationFrame(() => fitView());
		},
		[nodes, edges, setNodes, setEdges, fitView],
	);

	return (
		<div ref={containerRef} className='size-full'>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				minZoom={0.1}
				className='size-full'
			>
				<Background />
				<Panel position='top-right'>
					<button
						type='button'
						onClick={() => {
							onLayout('TB');
						}}
						title='Vertical Layout'
						aria-label='Vertical Layout'
					>
						<CarbonIcon name='maximize' className='shrink-0 rounded border bg-white p-1 text-xl text-black' />
					</button>
				</Panel>
				<Dialog open={!!selNode} onOpenChange={o => !o && setSelNode(null)}>
					<DialogContent aria-describedby={undefined} className='text-clip bg-white text-left text-cyan-900 dark:bg-white dark:text-cyan-900'>
						{selNode && (
							<>
								<DialogHeader>
									<DialogTitle className='text-left font-mono text-4xl font-bold text-cyan-900'>{selNode.name}</DialogTitle>
									<DialogDescription className='sr-only'>Details for {selNode.name}</DialogDescription>
									{selNode.clans?.length > 0 && <p className='text-left text-cyan-900/70'>Clan: {selNode.clans.join(', ')}</p>}
									{selNode.spouseId && <p className='text-left text-cyan-900/70'>Spouse: {selNode.spouseId.split('-')[0].replace(/^./, c => c.toUpperCase())}</p>}
									{selNode.children?.length > 0 && (
										<p className='text-left text-cyan-900/70'>Children: {selNode.children.map(i => i.split('-')[0]?.replace(/^./, c => c.toUpperCase())).join(', ')}</p>
									)}
								</DialogHeader>
								<div className='flex flex-col gap-y-3 pt-2'>
									{selNode.audio?.map(({ title: t, author: a, audio: v }) => (
										<Player key={v} title={t} author={a} src={v} />
									))}
								</div>
							</>
						)}
					</DialogContent>
				</Dialog>
			</ReactFlow>
		</div>
	);
};

/**
 * Renders the genealogy component.
 *
 * @remarks Exposes the top-level ReactFlowProvider wrapper for the LayoutFlow diagram.
 *
 * @returns Tree provider hierarchy.
 */
export function Genealogy(): React.JSX.Element {
	return (
		<ErrorBoundary
			name='SaibaiGenealogy'
			fallback={() => <AlertError title='Genealogy Tree Error' description='The genealogy diagram of the Saibai families could not be displayed. The rest of the page remains fully accessible.' />}
		>
			<div className={PANEL_CLASSES}>
				<ReactFlowProvider>
					<LayoutFlow genealogyData={genealogyData} />
				</ReactFlowProvider>
			</div>
		</ErrorBoundary>
	);
}

/*//////////////////////////////////////////////////
MAIN CORPUS DASHBOARD
//////////////////////////////////////////////////*/

/**
 * Renders the tabs trigger component.
 *
 * @remarks Navigation trigger for the Corpus Radix UI tabs with active link syncing and scrolling.
 *
 * @param value - Identifies the specific tab panel.
 * @param children - Button label/content.
 *
 *
 * @returns Customized Radix Tabs.Trigger.
 */
const TabsTrigger = ({ value: val, children }: { value: string; children: React.ReactNode }) => {
	/**
	 * Handles click.
	 */
	const handleClick = () => {
		if (typeof window !== 'undefined') {
			const newUrl = `${window.location.pathname}?tab=${encodeURIComponent(val)}#history`;
			window.history.replaceState({}, '', newUrl);
			document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' });
		}
	};
	return (
		<Tabs.Trigger value={val} onClick={handleClick} key={val} className='-mx-2 rounded px-2 py-0.5 text-left hover:bg-cyan-800 active:bg-cyan-800 data-[state=active]:bg-cyan-700'>
			{children}
		</Tabs.Trigger>
	);
};

// Abstracted Tab Configs for Corpus
const CORPUS_TABS = [
	{ id: 'Chronological', label: 'Chronological', className: 'p-10', Component: null },
	{ id: 'Geographic', label: 'Geographic', className: TAB_VIEW_CLASSES, Component: GeographicMap },
	{ id: 'Genealogical', label: 'Genealogical', className: TAB_VIEW_CLASSES, Component: Genealogy },
];

/**
 * Renders the corpus component.
 *
 * @remarks The primary dashboard interface organizing Timeline, Map, and Genealogy views into tabs.
 *
 * @param defaultTab - Initializes the view (e.g., 'Chronological', 'Geographic', 'Genealogical').
 *
 * @returns Fully composed layout with integrated sub-components.
 */
export default function Corpus({ defaultTab }: { defaultTab: string }): React.JSX.Element {
	return (
		<ErrorBoundary
			name='SaibaiCorpus'
			fallback={() => (
				<AlertError title='Saibai Corpus Crashed' description='An unexpected error occurred while rendering the Saibai Corpus dashboard. The rest of the page remains fully accessible.' />
			)}
		>
			<Tabs.Root defaultValue={defaultTab || 'Chronological'} className='grid-cols-[1fr_3fr] sm:grid'>
				<div className='col-span-2 grid min-h-screen grid-cols-[3rem_1fr] grid-rows-[auto_1fr_auto] bg-cyan-50 sm:grid-cols-[1fr_3fr] dark:bg-cyan-800'>
					<div className='h-10 sm:h-20' />
					<div className='h-10 border-l border-teal-400 sm:h-20 dark:border-teal-500' />
					<div className='col-start-1 row-start-2 w-full border-t border-teal-400 dark:border-teal-500' />
					<section className='prose flex max-w-none flex-col justify-center text-clip border-l border-t border-teal-400 px-6 py-20 text-cyan-900 sm:ml-0 dark:border-teal-500 dark:text-cyan-50'>
						<h2 className='my-0 mb-8 font-mono text-6xl sm:text-8xl'>Saibai Corpus</h2>
						<p className='text-xl opacity-60 sm:text-3xl'>Carrying island stories, wherever the journey leads</p>
						<div className='max-w-3xl'>
							<p className='sm:text-xl'>
								As rising seas threaten homes, sacred sites, and connection to country, this living archive holds space for memory, identity, and belonging. Every scrap of Saibai—language, story,
								place, and kin—has been gathered and collated into one site, with multiple ways to explore: a timeline, an audio archive, maps, and more.
							</p>
						</div>
					</section>
					<div className='h-10 border-t border-teal-400 sm:h-20 dark:border-teal-500' />
					<div className='border-l border-t border-teal-400 dark:border-teal-500' />
				</div>

				<div className='relative z-20 row-start-2 bg-cyan-950 p-10 pb-0 text-cyan-200 sm:pb-10'>
					<Tabs.List className='flex flex-col gap-y-2 rounded border border-cyan-800 px-6 py-5 text-sm leading-tight shadow md:sticky md:top-16 [&>*]:py-1' aria-label='Corpus view modes'>
						<h3 className='font-bold'>Content</h3>
						{CORPUS_TABS.map(({ id: i, label: l }) => (
							<TabsTrigger key={i} value={i}>
								{l}
							</TabsTrigger>
						))}
					</Tabs.List>
				</div>

				<div id='history' className='relative z-20 row-start-2 min-h-screen bg-cyan-950 text-cyan-200'>
						{CORPUS_TABS.map(r => (
							<Tabs.Content key={r.id} value={r.id} className={r.className}>
								{r.Component ? (
									<r.Component />
							) : (
								<div className='max-w-prose'>
										{Object.entries(AUDIO).map(([s, d]) => (
										<div key={s}>
											<div className='sticky top-0 z-20 -mx-2 -mt-4'>
												<h2 className='bg-cyan-950 px-2 py-4 text-xl font-semibold'>{s}</h2>
												<div className='h-2 scrim-cyan-950 scrim-t-2' />
											</div>
												{'description' in d && d.description && <p className='mb-8'>{d.description}</p>}
											<div className='flex flex-col gap-y-4 pb-8'>
													{d.items.map(({ title: t, author: a, audio: v }) => (
													<Player key={v} title={t} author={a} src={v} />
												))}
											</div>
										</div>
									))}
								</div>
							)}
						</Tabs.Content>
					))}
				</div>
			</Tabs.Root>
		</ErrorBoundary>
	);
}

/*//////////////////////////////////////////////////
DATA
//////////////////////////////////////////////////*/

// prettier-ignore
const SAIBAI = {
	"type": "Topology",
	"arcs": [
		[[6184, 7493], [218, -160], [176, -93], [162, -34], [239, -45], [397, 6], [118, 40]],
		[[7494, 7207],[189, 42],[219, -4],[170, -36],[367, -312],[234, -137],[442, -241],[213, -85],[303, -99],[201, 9],[385, 341],[122, 175],[88, 99],[150, 146],[169, 161],[116, 142],[194, 109],[241, 113],[144, 66],[285, 43],[209, 19],[314, 28],[485, 312],[72, 62],[241, 56],[178, -52],[144, -47],[176, -52],[244, -52],[122, 180],[219, 23],[182, -127],[87, -57],[235, -109],[157, -42],[397, -114],[539, -108],[288, -62],[413, -38],[357, -19],[319, 19],[407, -61],[398, -227],[75, -128],[40, -250],[38, -374],[-34, -302],[-76, -204],[-144, -264],[-103, -199],[-163, -260],[-394, -293],[-395, -151],[-263, 18],[-219, 95],[-213, -9],[-438, -180],[-210, -85],[-281, -147],[-191, -132],[-241, -194],[-213, -208],[-316, -132],[-238, -204],[-119, -113],[-126, -317],[-109, -151],[-66, -208],[-31, -180],[-94, -184],[-78, -208],[-32, -203],[22, -284],[-50, -175],[-206, -354],[-85, -67],[-172, -66],[-382, -5],[-122, -89],[-103, -71],[-373, -137],[-254, 14],[-225, -52],[-169, -114],[-313, -132],[-391, -118],[-185, -185],[-213, -113],[-150, -90],[-273, 43],[-147, 56],[-269, 81],[-376, 123],[-250, 142],[-119, 70],[-191, -9],[-122, -76],[-226, -28],[-237, -28],[-254, -5],[-235, 85],[-191, 90],[-106, 151],[-91, -156],[-107, -146],[-131, -95],[-272, -76],[-129, 67],[-106, -86],[-166, -184],[-238, -85],[-294, 0],[-100, 57],[-163, 38],[-266, 118],[-266, 137],[-295, 250],[-153, 62],[-210, 99],[-269, 19],[-207, 38],[-238, 47],[-162, 5],[-188, 28],[-144, 95],[-213, 127],[-113, 71],[-203, 76],[-135, 42],[-225, 208],[-138, 190],[-147, 85],[-298, 80],[-187, 99],[-285, 246],[-210, 180],[-241, 208],[-175, 160],[-88, 208],[-22, 308],[-33, 250],[27, 187],[116, 324],[75, 261],[45, 129],[17, 83],[-106, 416],[-35, 222],[54, 335],[90, 294],[122, 156],[80, 201],[100, 145],[130, 78],[125, 113],[120, 168],[209, 59],[380, -75],[130, -32],[60, -7],[102, 33],[25, -5],[42, 24],[59, 88],[62, 123],[100, 217],[65, 116],[66, 63],[27, 6],[98, 63],[91, 68],[62, 112],[76, 90],[221, 196],[402, 333],[314, 154],[173, 75],[247, 69],[185, 153],[169, 76],[209, 32],[275, -31],[241, -33],[289, -48],[182, -246],[285, -284],[378, -539]],
		[[7908, 5346],[26, 32],[78, -53],[50, -6],[28, 45],[43, 66],[50, 103],[112, -165],[163, -83],[382, -100],[115, -192],[30, -330],[164, -430],[30, -338],[-6, -503],[-30, -275],[-103, -265],[-352, 174],[-175, -156],[-576, 174],[-412, 146],[-278, 0],[-61, -311],[-309, 256],[-103, 247],[-133, -247],[-564, 403],[333, 119],[412, 55],[-24, 238],[-212, 192],[-133, 265],[-230, 110],[-146, 183],[0, 210],[206, 174],[164, 64],[115, 128],[-47, 183],[25, 192],[64, 20],[87, -88],[166, -35],[59, -135],[-4, -116],[-99, -102],[67, -52],[55, -178],[57, -101],[127, -219],[218, -183],[255, -82],[151, 27],[194, 192],[73, 247],[-33, 260],[-12, 34],[11, 24],[-15, 115],[-38, 8],[-28, 43],[13, 16]],
		[[10718, 3318],[-297, 0],[-200, -137],[-103, -238],[-260, -256],[-279, 146],[109, 293],[260, 366],[164, 311],[67, 220],[-97, 384],[-97, 293],[24, 256],[-18, 183],[-315, 110],[-139, 55],[-25, 192],[291, 45],[388, -64],[345, -9],[467, 92],[127, 219],[115, 485],[212, 238],[224, 165],[158, 311],[224, -101],[182, -174],[157, -375],[382, 9],[327, -164],[260, -28],[103, 202],[212, 347],[212, -27],[0, -311],[116, 45],[97, 129],[284, 393],[73, 210],[509, -64],[375, -73],[455, -165],[36, -183],[-36, -128],[-218, -137],[-333, 64],[-219, -201],[-175, -82],[-412, -101],[-91, -476],[-146, -229],[-96, 101],[-85, 384],[-418, -55],[-43, -91],[55, -512],[-158, -311],[-206, 91],[-42, 265],[-267, 28],[-66, -348],[-176, -503],[24, -274],[-66, -284],[-400, -110],[-230, -476],[-309, -164],[60, 329],[-206, -55],[-48, -329],[-267, -229],[-442, 101],[-49, 265],[-60, 137]],
		[[2282, 7063],[18, -24],[-16, -26],[-38, 52],[16, 26],[20, -28]],
		[[1936, 6641],[7, 12],[14, -20],[-7, -12],[-14, 20]],
		[[2059, 6743],[7, 16],[9, -10],[-7, -15],[-9, 9]],
		[[1991, 6701],[7, 11],[7, -12],[-7, -10],[-7, 11]],
		[[2014, 6725],[15, 26],[11, -14],[-16, -26],[-10, 14]],
		[[2032, 6774],[7, 13],[10, -12],[-8, -13],[-9, 12]],
		[[2039, 6793],[7, 12],[10, -13],[-6, -13],[-11, 14]],
		[[2080, 6836],[4, 9],[7, -7],[-4, -9],[-7, 7]],
		[[2067, 6849],[9, 15],[8, -11],[-9, -16],[-8, 12]],
		[[2183, 6907],[7, -4],[-3, -15],[-7, 5],[3, 14]],
		[[2197, 6900],[8, -5],[-5, -19],[-8, 5],[5, 19]],
		[[2109, 6845],[7, 13],[9, -11],[-7, -13],[-9, 11]],
		[[2083, 6875],[5, 10],[12, -12],[-5, -10],[-12, 12]],
		[[2094, 6898],[6, 11],[11, -13],[-6, -12],[-11, 14]],
		[[2098, 6929],[6, 12],[26, -28],[-6, -12],[-26, 28]],
		[[2165, 6919],[6, -3],[-4, -17],[-6, 3],[4, 17]],
		[[2145, 6894],[6, 8],[9, -14],[-6, -8],[-9, 14]],
		[[2137, 6878],[3, 6],[10, -13],[-3, -6],[-10, 13]],
		[[2123, 6874],[9, 7],[10, -27],[-9, -7],[-10, 27]],
		[[2207, 6864],[7, 19],[13, -10],[-6, -19],[-14, 10]],
		[[2230, 6839],[7, 23],[32, -22],[-7, -23],[-32, 22]],
		[[2329, 6740],[9, 14],[10, -16],[-9, -14],[-10, 16]],
		[[2369, 6670],[11, 13],[8, -14],[-12, -14],[-7, 15]],
		[[2456, 6632],[13, 0],[0, -23],[-13, 0],[0, 23]],
		[[2446, 6687],[5, 8],[9, -12],[-5, -7],[-9, 11]],
		[[2427, 6662],[7, 11],[19, -27],[-7, -11],[-19, 27]],
		[[2197, 7123],[8, 12],[9, -13],[-8, -11],[-9, 12]],
		[[2174, 7085],[9, -8],[-5, -13],[-9, 9],[5, 12]],
		[[2186, 7108],[8, 13],[9, -10],[-9, -14],[-8, 11]],
		[[2209, 7080],[5, -7],[-9, -16],[-5, 7],[9, 16]],
		[[2229, 7100],[9, -13],[-9, -14],[-9, 12],[9, 15]],
		[[2199, 7037],[8, 16],[8, -10],[-9, -16],[-7, 10]],
		[[2181, 7040],[9, -10],[-6, -12],[-9, 10],[6, 12]],
		[[2126, 6996],[6, 12],[9, -10],[-6, -13],[-9, 11]],
		[[2137, 7010],[7, 13],[6, -8],[-7, -13],[-6, 8]],
		[[2151, 7044],[9, -10],[-8, -16],[-8, 11],[7, 15]],
		[[2133, 6949],[7, 17],[8, -7],[-7, -17],[-8, 7]],
		[[2108, 6953],[7, 17],[15, -15],[-7, -16],[-15, 14]],
		[[2176, 7006],[12, -12],[-6, -12],[-12, 11],[6, 13]],
		[[2172, 6979],[17, -14],[-13, -34],[-17, 14],[13, 34]],
		[[2196, 6936],[9, -8],[-6, -17],[-9, 7],[6, 18]],
		[[2203, 6917],[5, 14],[13, -10],[-4, -15],[-14, 11]],
		[[2394, 7274],[10, 2],[1, -16],[-10, -1],[-1, 15]],
		[[2444, 7200],[17, -6],[-2, -11],[-17, 6],[2, 11]],
		[[2505, 7073],[7, 12],[8, -12],[-7, -12],[-8, 12]],
		[[2522, 7044],[7, 13],[7, -9],[-6, -13],[-8, 9]],
		[[2543, 7038],[7, 0],[0, -22],[-8, 0],[1, 22]],
		[[2529, 6979],[9, 7],[5, -13],[-8, -8],[-6, 14]],
		[[2513, 7028],[7, -11],[-8, -10],[-6, 11],[7, 10]],
		[[2493, 7052],[9, -5],[-4, -17],[-9, 5],[4, 17]],
		[[2480, 7081],[7, -10],[-8, -12],[-7, 11],[8, 11]],
		[[2462, 7108],[7, -11],[-7, -10],[-7, 10],[7, 11]],
		[[2430, 7177],[10, -9],[-4, -13],[-11, 9],[5, 13]],
		[[2397, 7176],[14, -3],[-2, -19],[-14, 3],[2, 19]],
		[[2376, 7187],[12, -1],[-1, -16],[-12, 1],[1, 16]],
		[[2353, 7184],[10, 2],[1, -15],[-10, -2],[-1, 15]],
		[[2332, 7179],[10, 2],[2, -14],[-11, -2],[-1, 14]],
		[[2304, 7163],[6, 10],[9, -12],[-6, -11],[-9, 13]],
		[[2290, 6864],[7, 14],[8, -10],[-7, -14],[-8, 10]],
		[[2366, 6825],[7, 10],[8, -13],[-7, -10],[-8, 13]],
		[[2390, 6777],[9, 15],[23, -32],[3, 4],[5, -8],[5, 4],[10, -14],[-10, -15],[2, -3],[-4, -6],[2, -4],[-15, -23],[4, -5],[-7, -12],[-30, 44],[-2, -3],[-7, 10],[-4, -6],[-2, 2],[7, 11],[1, -2],[8, 13],[3, -4],[1, 2],[9, -13],[7, 11],[8, -12],[3, 5],[-29, 41]],
		[[2369, 7230],[9, 2],[2, -15],[-10, -2],[-1, 15]],
		[[2347, 7240],[10, 2],[1, -15],[-10, -2],[-1, 15]],
		[[2332, 7228],[10, 7],[4, -16],[-10, -6],[-4, 15]],
		[[2313, 7213],[9, 8],[6, -14],[-10, -9],[-5, 15]],
		[[2297, 7203],[12, 7],[4, -15],[-12, -7],[-4, 15]],
		[[5147, 6189],[-3, -48],[-27, -28],[-18, 91],[-4, 46],[12, 46],[64, 102],[56, 47],[30, 12],[30, -19],[22, -33],[41, -123],[33, -56],[13, -44],[0, -24],[-2, -23],[-12, -16],[-32, -8],[-37, 48],[-57, 117],[-16, 6],[-17, -6],[-43, -32],[-33, -55]],
		[[4974, 7160],[49, -22],[28, -24],[32, -2],[12, 46],[-10, 93],[31, 13],[31, -8],[24, -33],[32, -15],[92, 32],[31, -4],[60, -177],[-61, -112],[-27, -87],[2, -52],[28, -135],[-20, -40],[-202, -153],[-127, -12],[-16, 43],[16, 41],[26, 25],[91, 49],[37, 73],[2, 48],[-20, 38],[-98, 3],[-20, 36],[77, 77],[6, 48],[-9, 49],[-17, 40],[-80, 122]],
		[[3309, 4959],[17, -7],[14, -12],[5, -8],[-9, -33],[-11, -32],[-6, -8],[-8, -1],[-7, 6],[-6, 6],[-4, 10],[2, 23],[0, 36],[3, 11],[10, 9]],
		[[3614, 7353],[44, -47],[29, -7],[28, 23],[62, 4],[28, 22],[63, -9],[55, -45],[50, -61],[57, -38],[12, -43],[-97, -7],[-118, -76],[-17, -40],[-3, -96],[-32, 1],[-28, 19],[-65, 166],[-51, 55],[-42, 75],[-13, 93],[38, 11]],
		[[2498, 6641],[-46, 66],[36, 63],[48, -66],[-38, -63]],
		[[2491, 6620],[55, 85],[33, -48],[-67, -102],[-21, 31],[3, 10],[-3, 24]],
		[[700, 4058],[8, 93],[52, 53],[26, 46],[14, 43],[7, 103],[24, 33],[31, 11],[101, 0],[100, 19],[19, 39],[-4, 44],[-29, 16],[-57, -40],[-65, -6],[-30, 13],[-28, 24],[-19, 38],[-12, 43],[15, 40],[114, 80],[96, 22],[83, 81],[94, -45],[26, 24],[-28, 132],[-1, 50],[24, 7],[3, 48],[19, 97],[29, 19],[66, -25],[63, 23],[136, 131],[21, 39],[11, 93],[0, 178],[-24, 94],[-40, 72],[-12, 43],[10, 44],[47, 66],[44, 81],[26, 28],[45, 108],[-25, 87],[-3, 49],[5, 145],[11, 25],[207, -1],[124, -73],[55, -53],[18, -94],[-6, -141],[-51, -57],[-20, -326],[-45, -129],[-5, -47],[7, -95],[18, -39],[50, -64],[-2, -47],[-13, -44],[-16, -40],[-25, -25],[-188, -9],[-27, -26],[-46, -125],[-58, -28],[-74, -91],[-142, -139],[-23, -33],[-1, -50],[56, -6],[176, -149],[33, -19],[33, 0],[22, -90],[60, -49],[36, -77],[64, -36],[12, -44],[-7, -98],[-123, -76],[-22, -36],[11, -143],[25, -30],[35, -12],[31, 6],[61, 36],[32, -3],[45, -70],[53, 53],[27, 38],[33, 88],[25, 30],[30, -14],[13, -45],[0, -48],[-9, -48],[-19, -37],[-52, -52],[-48, -127],[-61, 14],[-30, 19],[-196, 68],[-77, 34],[-25, 32],[-9, 27],[1, 49],[36, 87],[9, 53],[-13, 21],[-57, 37],[32, 175],[0, 56],[-19, 91],[-29, 12],[-37, 3],[-30, -11],[-23, -35],[-50, -127],[-5, -49],[-63, -26],[-25, -31],[-53, -181],[17, -42],[68, -104],[-12, -43],[-48, -59],[-21, -89],[-33, -7],[-96, 54],[-30, -5],[-25, -177],[-64, 15],[-57, 111],[1, 48],[25, 87],[51, 60],[-1, 48],[-55, 170],[11, 45],[28, 19],[116, -91],[31, 12],[-37, 74],[-87, 53],[-65, -10],[-51, -57],[-32, -174],[-35, -81],[-66, -20],[-30, -23],[-22, -35],[-65, -11],[-63, 18],[-100, -4],[-29, 9],[-29, 27],[1, 47],[55, 233],[31, 15],[79, -5]],
		[[3264, 6846],[34, 50],[32, 16],[99, 31],[33, -4],[29, -19],[17, -2],[30, 9],[16, -2],[16, -10],[27, -35],[32, -85],[-4, -95],[2, -77],[9, -54],[35, -138],[33, -76],[12, -15],[59, -39],[49, -15],[50, 1],[15, 9],[42, 55],[14, 12],[32, -4],[14, -10],[16, -3],[65, 20],[14, 10],[17, -3],[28, -26],[32, -7],[50, 16],[26, 23],[15, 8],[16, -3],[15, -12],[55, -57],[14, -15],[3, -25],[-97, 10],[-21, -8],[-65, -4],[-15, -6],[-9, -19],[-4, -23],[2, -48],[28, -80],[75, -52],[2, -26],[-9, -20],[-3, -47],[-14, -9],[-15, 6],[-12, 15],[-29, 12],[-17, 1],[-4, -23],[-2, -49],[-7, -24],[-13, -15],[-16, -9],[-15, 13],[-8, 23],[3, 71],[-6, 22],[-38, 51],[-10, 18],[-14, 11],[-32, 6],[-14, -6],[-11, -16],[-30, -22],[-32, 1],[-23, -11],[-19, -44],[-48, 10],[-23, 31],[-17, 5],[-29, -13],[-10, -21],[1, -47],[12, -46],[25, -65],[1, -24],[-5, -23],[-41, -40],[-10, -19],[-15, -50],[0, -73],[24, -65],[-13, -34],[-6, -22],[-13, -17],[-14, -9],[-46, 1],[-55, 77],[-4, 34],[-50, 65],[-60, 37],[-26, 28],[-17, 40],[-47, 79],[-29, 24],[-18, 38],[1, 45],[35, 51],[47, 31],[65, 22],[32, 23],[41, 46],[-11, 71],[-52, 90],[-29, 112],[-4, 23],[-1, 99],[-12, 54],[-21, 139],[-10, 18],[-27, 24],[-30, 8],[-14, -10],[-11, -19],[-12, -69],[-33, -111],[-14, -6],[-15, 12],[-22, 163],[-18, 40],[-28, 20],[-16, 1],[-15, -11],[-18, -43],[-5, -25],[-14, -14],[-14, 12],[-2, 25],[12, 45],[7, 21],[22, 36],[29, 25],[45, 23],[46, 0]],
		[[2297, 7149],[-16, 25],[-5, 10],[-6, 16],[-5, 10],[-5, 3],[-11, -2],[-39, -50],[41, -57],[-15, -26]],
		[[2236, 7078],[8, -14],[-31, -97],[85, -58],[74, -60],[35, 41],[79, -99],[-40, -81],[42, -61],[-1, -26],[-1, -18],[4, -25],[-82, -13],[-24, 8],[-10, 61],[-36, 78],[-47, 75],[-120, 84],[-52, -42],[-28, -1],[-18, -35],[17, -39],[-34, -54],[-32, 5],[-57, -69],[-85, -76],[-67, -33],[-115, -27],[-120, 14],[-98, 24],[-62, 13],[-42, -103],[-42, -19],[1, -36],[-26, -13],[-36, 53],[-31, 47],[-23, 48],[-72, 38],[-10, 55],[44, 29],[52, 1],[27, -18],[36, -9],[73, 21],[102, -12],[53, -11],[80, -19],[86, -20],[62, 1],[57, 20],[51, 8],[14, 4],[34, 21],[48, 67],[45, 75],[130, 278],[65, 113],[60, 66],[31, 10],[63, 36],[75, 15],[28, 9],[28, -111],[35, -89],[62, -57],[-8, -69],[-25, -41],[-39, 41],[-68, 127],[-36, 32],[-41, 16],[-37, -12],[-29, 4]],
		[[2297, 7149],[409, -566],[-26, -47],[-15, 6],[-352, 477],[-21, -24],[-56, 83]],
		[[1086, 6330],[52, -16],[27, -18],[44, -19],[19, -11],[9, -6],[55, -61],[15, -20],[17, -42],[3, -14],[-3, -43],[-5, -12],[-18, -12],[-15, -17],[-10, -3],[-18, 14],[-16, 18],[-6, 11],[-26, 19],[-14, 21],[-1, 14],[5, 13],[8, 6],[20, 1],[10, 4],[-5, 12],[-19, 12],[-18, 0],[-29, -9],[-14, 2],[-18, -10],[-10, 0],[-8, 26],[-8, 10],[-9, 8],[-10, 6],[-10, 0],[-8, -7],[-1, -14],[11, -24],[4, -14],[0, -15],[-3, -14],[-9, -7],[-24, -9],[-53, -43],[-18, -5],[-19, 3],[-6, 12],[-4, 14],[-2, 28],[1, 15],[3, 16],[5, 13],[13, 20],[17, 13],[7, 11],[9, 1],[24, -16],[9, 3],[5, 13],[-1, 15],[-27, 51],[0, 16],[6, 27],[7, 11],[18, 12],[29, -2],[13, -8]],
		[[795, 6203],[15, 20],[50, 70],[16, -20],[-18, -29],[-37, -51],[-19, -13],[-7, 23]],
		[[3181, 5194],[80, -99],[-66, -122],[-80, 99],[66, 122]],
		[[1318, 6585],[2, -16],[-12, -4],[-3, 16],[13, 4]],
		[[1358, 6592],[-2, 13],[7, 2],[2, -13],[-7, -2]],
		[[1343, 6603],[8, 3],[2, -12],[-8, -2],[1, -4],[-7, -2],[-3, 18],[7, 2],[0, -3]],
		[[1321, 6583],[-2, 15],[12, 4],[2, -15],[-12, -4]],
		[[1309, 6527],[2, -15],[-10, -4],[-3, 14],[11, 5]],
		[[1372, 6559],[2, -8],[-5, -2],[-1, 8],[4, 2]],
		[[1371, 6547],[2, -10],[-11, -5],[-2, 11],[11, 4]],
		[[1344, 6526],[-2, 9],[12, 5],[1, -10],[-7, -3],[1, -4],[-6, -3],[-1, 6],[2, 0]],
		[[1325, 6517],[-3, 14],[11, 5],[3, -14],[-11, -5]],
		[[1473, 6547],[0, 1],[8, 5],[0, -2],[7, 4],[3, -14],[-7, -4],[-1, 2],[-7, -4],[-2, 8],[-4, -3],[-1, 5],[4, 2]],
		[[1537, 6533],[0, -4],[-3, 0],[0, 4],[-5, 0],[-1, 15],[10, 0],[0, -15],[-1, 0]],
		[[1485, 6575],[0, -4],[-3, -1],[-1, 5],[0, 0],[0, 13],[8, 0],[0, -12],[-4, -1]],
		[[1507, 6568],[-1, 3],[5, 4],[2, -6],[1, 1],[2, -8],[-14, -10],[-2, 8],[0, 0],[-1, 3],[8, 5]],
		[[1558, 6550],[3, -16],[-9, -4],[-3, 16],[9, 4]],
		[[1571, 6534],[-4, 15],[7, 3],[4, -15],[-7, -3]],
		[[1598, 6539],[0, 0],[0, 17],[11, 0],[0, -16],[-3, 0],[0, -4],[-8, 0],[0, 3]],
		[[1631, 6552],[0, -6],[-14, 1],[0, 12],[9, 0],[0, 2],[6, 0],[0, -9],[-1, 0]],
		[[1656, 6538],[1, -13],[-9, 0],[0, 12],[8, 1]],
		[[1688, 6508],[1, 16],[12, -1],[0, -16],[-13, 1]],
		[[1692, 6529],[1, 15],[12, 0],[0, -16],[-13, 1]],
		[[1723, 6540],[0, -15],[-11, 0],[0, 15],[11, 0]],
		[[1742, 6548],[3, -15],[-11, -5],[-3, 14],[11, 6]],
		[[1755, 6554],[3, -17],[-9, -4],[-3, 16],[9, 5]],
		[[1772, 6548],[1, -3],[-7, -3],[-3, 18],[7, 3],[1, -3],[7, 3],[2, -12],[-8, -3]],
		[[1795, 6560],[3, 0],[0, -4],[-2, -1],[0, -3],[-9, -3],[-2, 15],[9, 3],[1, -7]],
		[[1919, 6585],[4, -4],[-5, -12],[-4, 4],[5, 12]],
		[[1878, 6580],[7, 4],[2, -11],[-6, -3],[0, -3],[-7, -4],[-4, 17],[7, 3],[1, -3]],
		[[1912, 6607],[5, -9],[-9, -12],[-6, 9],[10, 12]],
		[[1920, 6620],[8, -12],[-7, -11],[-8, 12],[7, 11]],
		[[2466, 6573],[11, -17],[-4, -7],[-12, 18],[5, 6]],
		[[2235, 7176],[63, -85]],
		[[2298, 7091],[387, -527]],
		[[2298, 7091],[-9, -16],[-7, -12]],
		[[2282, 7063],[-9, -14]],
		[[2587, 6628],[-3, -3],[-27, -39],[-20, -33],[-12, -20],[-5, -6],[-8, -5],[-15, -1],[-39, -2],[-7, 1],[-4, 6],[-3, 9],[-6, 19],[-5, 36]],
		[[2433, 6590],[-7, 23],[-11, 26],[-6, 15]],
		[[2409, 6654],[-5, 13],[-13, 26],[-35, 49],[-32, 45],[-33, 48],[-6, 9],[-4, 3],[-5, 4],[-28, 20],[-24, 18]],
		[[2224, 6889],[-11, 8],[-31, 23],[-19, 10],[-11, 3],[-11, 1],[-3, 0],[-13, -1],[-8, 3],[-5, 4],[-10, 10]],
		[[1881, 6599],[15, 11],[17, 16],[14, 17],[26, 32],[23, 30],[28, 49],[25, 44],[23, 50],[25, 49],[25, 53]],
		[[2102, 6950],[23, 61],[27, 56],[18, 30],[29, 53]],
		[[2199, 7150],[6, 10],[10, 14],[28, 35],[7, 5],[6, 3],[4, 0],[7, -3],[5, -5]],
		[[2272, 7209],[7, -1],[8, 2],[34, 26],[27, 15],[7, 3],[6, 1],[7, -1],[31, -3],[11, 4],[15, 9],[9, 6],[10, 6]],
		[[2444, 7276],[23, 23],[23, 9],[42, 41],[41, 40]],
		[[2552, 6937],[-2, -2],[-2, 0],[-3, 0],[-5, 6],[-26, 31],[-6, 8],[-6, 8],[-29, 53],[-16, 29],[-12, 22],[-6, 9],[-5, 8],[-10, 9],[-25, 18],[-11, 7],[-11, 4],[-13, 3],[-8, 0],[-9, -1],[-11, -5],[-18, -9],[-3, -2],[-2, 0],[-3, 2],[-4, 4],[-19, 28],[-6, 13],[-7, 20],[-2, 9]],
		[[2444, 7276],[5, -8],[13, -28],[6, -16],[3, -9],[1, -8],[-1, -9],[-2, -11],[-1, -15],[1, -18],[3, -15],[4, -9],[6, -7],[11, -5],[29, -8],[15, -5],[7, -3],[3, -3],[4, -5],[3, -7],[7, -28],[1, -9],[1, -11],[0, -14],[-3, -27],[-4, -30],[-4, -31]],
		[[3225, 6371],[20, 21],[11, 8],[16, 4],[31, 6],[13, 6],[9, 8],[8, 15],[2, 20],[31, 131],[10, 47],[18, 40]],
		[[2691, 6531],[21, 59],[1, 12],[9, 3],[14, -1],[24, -8],[60, -41],[24, -5],[21, 3],[29, 8],[13, 2],[10, 1],[11, -3],[32, -18],[65, -33],[53, -32],[123, -89],[24, -18]],
		[[3225, 6371],[61, -45],[24, -25],[75, -52]],
		[[7908, 5346],[-18, -1],[-31, 3],[-35, -6],[-78, -32],[-30, -19],[-59, -76],[-29, -21],[-16, -1],[-16, 3],[-127, 66],[-25, 33],[-7, 21],[1, 24],[24, 74],[2, 22],[-4, 49],[-26, 137],[-1, 50],[6, 47],[50, 141],[125, 210],[-2, 37],[-8, 34],[-28, 66],[-11, 73],[-5, 67],[18, 186],[26, 196],[12, 119],[-2, 46],[-15, 64],[-105, 249]],
		[[5708, 6180],[25, 64],[32, 119],[4, 47],[3, 97],[7, 21],[71, 113],[49, 69],[73, 205],[75, 171],[77, 196],[60, 211]],
		[[871, 6286],[20, 27],[11, 20],[21, 36],[8, 10],[5, 12],[19, 54],[10, 22],[15, 24],[38, 47],[15, 15],[29, 20],[6, 3],[7, -2],[6, -2],[8, -2],[6, 0],[6, 2],[28, 16],[27, 16]],
		[[3178, 5204],[-27, 32],[-6, 7],[-1, 7],[1, 6],[15, 31],[6, 15],[1, 7],[0, 6],[-2, 13],[-11, 68],[-4, 27],[-1, 13],[0, 14],[1, 51],[0, 16],[-2, 13],[-4, 16],[-8, 21],[-28, 57],[-33, 70],[-9, 19],[-13, 20],[-25, 35],[-9, 20],[-11, 24],[-9, 21],[-5, 20],[-5, 35],[-2, 12],[-3, 7],[-3, 8],[-8, 12],[-5, 10],[-3, 7],[-2, 12],[-2, 20],[-2, 19],[-3, 15],[-2, 12],[-5, 16],[-16, 35],[-18, 34],[-40, 58],[-11, 13],[-11, 20],[-5, 14],[-23, 72],[-7, 22],[-5, 12],[-4, 11],[-63, 112],[-45, 78],[-10, 12]],
		[[2691, 6531],[-7, 2],[-9, -1],[-7, 2],[-7, 6],[-61, 83],[-5, 4],[-3, 2],[-5, -1]],
		[[1156, 6604],[11, 9],[9, 8],[9, 4],[7, 1],[35, 2],[7, -1],[7, -2],[18, -17],[9, -6]],
		[[1268, 6602],[9, -4],[2, 0]],
		[[1279, 6598],[3, 0],[8, 1],[17, 6],[43, 16],[14, 3],[36, 0],[6, 0]],
		[[1406, 6624],[8, -1],[6, -2],[9, -9],[6, -3],[4, 0],[5, 2],[8, 1],[27, 0]],
		[[1479, 6612],[7, -1],[16, 0],[5, -2],[7, -6],[17, -14],[12, -6],[11, -4],[47, -5],[62, -10],[55, -7],[10, 0],[11, 3],[31, 11],[25, 11],[14, 6],[16, 2],[35, 2],[12, 3],[9, 4]],
		[[1403, 6567],[53, -15]],
		[[1239, 6567],[29, 35]],
		[[1479, 6612],[1, -13],[-1, -7],[-2, -7],[-5, -8],[-10, -13],[-6, -12]],
		[[1456, 6552],[-3, -10],[-1, -8],[0, -11],[0, -11],[2, -9],[4, -10],[29, -82],[28, -84],[7, -34],[10, -56],[1, -14],[0, -10],[-1, -7],[-2, -6],[-5, -9],[-32, -56],[-4, -9],[-3, -11],[-1, -8],[1, -4],[1, -2],[5, -1],[27, -3],[3, -2],[1, -4],[0, -6],[-8, -117]],
		[[1279, 6598],[15, -120],[3, -7],[4, -2],[6, 1],[71, 25],[6, 5],[8, 8],[4, 9],[2, 17],[3, 22],[2, 11]],
		[[1403, 6567],[0, 11],[1, 17],[2, 29]],
		[[2409, 6654],[19, 33]],
		[[2433, 6590],[19, -1],[11, -3],[4, -1]],
		[[2199, 7150],[17, -4],[30, -47],[2, -8],[0, -8],[-4, -7],[-8, -18],[-9, -16],[-10, -19],[-10, -26],[-5, -28],[0, -10],[3, -8],[13, -21],[5, -9],[1, -32]]
	],
	"transform": {
		"scale": [0.0011297464289668608, 0.0007380781646299188],
		"translate": [140.5, -14]
	},
	"objects": {
		"export (1)1": {
			"type": "GeometryCollection",
			"geometries": [
				{ "arcs": [[0, 1]], "type": "Polygon", "properties": { "@id": "way/160716931", "ele": "1.7", "name": "Saibai Island", "natural": "coastline", "place": "island", "population": "350", "source": "Bing", "wikipedia": "en:Saibai Island" }, "id": "way/160716931" },
				{ "arcs": [[2]], "type": "Polygon", "properties": { "@id": "way/160716945", "natural": "water", "source": "Bing" }, "id": "way/160716945" },
				{ "arcs": [[3]], "type": "Polygon", "properties": { "@id": "way/160716957", "natural": "water", "source": "Bing" }, "id": "way/160716957" },
				{ "arcs": [[4]], "type": "Polygon", "properties": { "@id": "way/494435874", "aeroway": "apron" }, "id": "way/494435874" },
				{ "arcs": [[5]], "type": "Polygon", "properties": { "@id": "way/636479573", "building": "yes" }, "id": "way/636479573" },
				{ "arcs": [[6]], "type": "Polygon", "properties": { "@id": "way/636479575", "building": "yes" }, "id": "way/636479575" },
				{ "arcs": [[7]], "type": "Polygon", "properties": { "@id": "way/636479577", "building": "yes" }, "id": "way/636479577" },
				{ "arcs": [[8]], "type": "Polygon", "properties": { "@id": "way/636479579", "building": "yes" }, "id": "way/636479579" },
				{ "arcs": [[9]], "type": "Polygon", "properties": { "@id": "way/636479581", "building": "yes" }, "id": "way/636479581" },
				{ "arcs": [[10]], "type": "Polygon", "properties": { "@id": "way/636479583", "building": "yes" }, "id": "way/636479583" },
				{ "arcs": [[11]], "type": "Polygon", "properties": { "@id": "way/636479585", "building": "yes" }, "id": "way/636479585" },
				{ "arcs": [[12]], "type": "Polygon", "properties": { "@id": "way/636479587", "building": "yes" }, "id": "way/636479587" },
				{ "arcs": [[13]], "type": "Polygon", "properties": { "@id": "way/636479588", "building": "yes" }, "id": "way/636479588" },
				{ "arcs": [[14]], "type": "Polygon", "properties": { "@id": "way/636479590", "building": "detached" }, "id": "way/636479590" },
				{ "arcs": [[15]], "type": "Polygon", "properties": { "@id": "way/636479592", "building": "yes" }, "id": "way/636479592" },
				{ "arcs": [[16]], "type": "Polygon", "properties": { "@id": "way/636479594", "building": "yes" }, "id": "way/636479594" },
				{ "arcs": [[17]], "type": "Polygon", "properties": { "@id": "way/636479596", "building": "yes" }, "id": "way/636479596" },
				{ "arcs": [[18]], "type": "Polygon", "properties": { "@id": "way/636479598", "building": "government" }, "id": "way/636479598" },
				{ "arcs": [[19]], "type": "Polygon", "properties": { "@id": "way/636479599", "building": "yes" }, "id": "way/636479599" },
				{ "arcs": [[20]], "type": "Polygon", "properties": { "@id": "way/636479601", "building": "yes" }, "id": "way/636479601" },
				{ "arcs": [[21]], "type": "Polygon", "properties": { "@id": "way/636479603", "building": "yes" }, "id": "way/636479603" },
				{ "arcs": [[22]], "type": "Polygon", "properties": { "@id": "way/636479605", "building": "yes" }, "id": "way/636479605" },
				{ "arcs": [[23]], "type": "Polygon", "properties": { "@id": "way/636479607", "building": "detached" }, "id": "way/636479607" },
				{ "arcs": [[24]], "type": "Polygon", "properties": { "@id": "way/636479609", "building": "retail", "name": "IBIS" }, "id": "way/636479609" },
				{ "arcs": [[25]], "type": "Polygon", "properties": { "@id": "way/636479611", "building": "yes" }, "id": "way/636479611" },
				{ "arcs": [[26]], "type": "Polygon", "properties": { "@id": "way/636479613", "building": "yes" }, "id": "way/636479613" },
				{ "arcs": [[27]], "type": "Polygon", "properties": { "@id": "way/636479616", "building": "yes" }, "id": "way/636479616" },
				{ "arcs": [[28]], "type": "Polygon", "properties": { "@id": "way/636479618", "building": "yes" }, "id": "way/636479618" },
				{ "arcs": [[29]], "type": "Polygon", "properties": { "@id": "way/636479620", "building": "yes" }, "id": "way/636479620" },
				{ "arcs": [[30]], "type": "Polygon", "properties": { "@id": "way/636479626", "building": "yes" }, "id": "way/636479626" },
				{ "arcs": [[31]], "type": "Polygon", "properties": { "@id": "way/636479627", "building": "yes" }, "id": "way/636479627" },
				{ "arcs": [[32]], "type": "Polygon", "properties": { "@id": "way/636479629", "building": "yes" }, "id": "way/636479629" },
				{ "arcs": [[33]], "type": "Polygon", "properties": { "@id": "way/636479631", "building": "yes" }, "id": "way/636479631" },
				{ "arcs": [[34]], "type": "Polygon", "properties": { "@id": "way/636479633", "building": "yes" }, "id": "way/636479633" },
				{ "arcs": [[35]], "type": "Polygon", "properties": { "@id": "way/636479635", "building": "yes" }, "id": "way/636479635" },
				{ "arcs": [[36]], "type": "Polygon", "properties": { "@id": "way/636479637", "building": "yes" }, "id": "way/636479637" },
				{ "arcs": [[37]], "type": "Polygon", "properties": { "@id": "way/636479639", "building": "yes" }, "id": "way/636479639" },
				{ "arcs": [[38]], "type": "Polygon", "properties": { "@id": "way/636479641", "building": "yes" }, "id": "way/636479641" },
				{ "arcs": [[39]], "type": "Polygon", "properties": { "@id": "way/636479643", "building": "yes" }, "id": "way/636479643" },
				{ "arcs": [[40]], "type": "Polygon", "properties": { "@id": "way/636479644", "building": "yes" }, "id": "way/636479644" },
				{ "arcs": [[41]], "type": "Polygon", "properties": { "@id": "way/636479646", "building": "yes" }, "id": "way/636479646" },
				{ "arcs": [[42]], "type": "Polygon", "properties": { "@id": "way/636479648", "building": "yes" }, "id": "way/636479648" },
				{ "arcs": [[43]], "type": "Polygon", "properties": { "@id": "way/636479650", "building": "hospital", "name": "Saibai Island Primary Health Care Centre", "building:levels": "1", "roof:levels": "0" }, "id": "way/636479650" },
				{ "arcs": [[44]], "type": "Polygon", "properties": { "@id": "way/636479652", "building": "yes" }, "id": "way/636479652" },
				{ "arcs": [[45]], "type": "Polygon", "properties": { "@id": "way/636479654", "building": "yes" }, "id": "way/636479654" },
				{ "arcs": [[46]], "type": "Polygon", "properties": { "@id": "way/636479656", "building": "yes" }, "id": "way/636479656" },
				{ "arcs": [[47]], "type": "Polygon", "properties": { "@id": "way/636479658", "building": "yes" }, "id": "way/636479658" },
				{ "arcs": [[48]], "type": "Polygon", "properties": { "@id": "way/636479660", "building": "yes" }, "id": "way/636479660" },
				{ "arcs": [[49]], "type": "Polygon", "properties": { "@id": "way/636479661", "building": "yes" }, "id": "way/636479661" },
				{ "arcs": [[50]], "type": "Polygon", "properties": { "@id": "way/636479663", "building": "yes" }, "id": "way/636479663" },
				{ "arcs": [[51]], "type": "Polygon", "properties": { "@id": "way/636479665", "building": "yes" }, "id": "way/636479665" },
				{ "arcs": [[52]], "type": "Polygon", "properties": { "@id": "way/636479667", "building": "yes" }, "id": "way/636479667" },
				{ "arcs": [[53]], "type": "Polygon", "properties": { "@id": "way/636479669", "building": "yes" }, "id": "way/636479669" },
				{ "arcs": [[54]], "type": "Polygon", "properties": { "@id": "way/636479671", "building": "yes" }, "id": "way/636479671" },
				{ "arcs": [[55]], "type": "Polygon", "properties": { "@id": "way/636479673", "building": "yes" }, "id": "way/636479673" },
				{ "arcs": [[56]], "type": "Polygon", "properties": { "@id": "way/636479674", "building": "yes" }, "id": "way/636479674" },
				{ "arcs": [[57]], "type": "Polygon", "properties": { "@id": "way/636479676", "building": "yes" }, "id": "way/636479676" },
				{ "arcs": [[58]], "type": "Polygon", "properties": { "@id": "way/636479678", "building": "yes" }, "id": "way/636479678" },
				{ "arcs": [[59]], "type": "Polygon", "properties": { "@id": "way/636479680", "building": "yes" }, "id": "way/636479680" },
				{ "arcs": [[60]], "type": "Polygon", "properties": { "@id": "way/636479682", "building": "yes" }, "id": "way/636479682" },
				{ "arcs": [[61]], "type": "Polygon", "properties": { "@id": "way/636479684", "building": "yes" }, "id": "way/636479684" },
				{ "arcs": [[62]], "type": "Polygon", "properties": { "@id": "way/636479686", "building": "yes" }, "id": "way/636479686" },
				{ "arcs": [[63]], "type": "Polygon", "properties": { "@id": "way/636479688", "building": "yes" }, "id": "way/636479688" },
				{ "arcs": [[64]], "type": "Polygon", "properties": { "@id": "way/636479690", "building": "yes", "name": "School" }, "id": "way/636479690" },
				{ "arcs": [[65]], "type": "Polygon", "properties": { "@id": "way/636479695", "building": "yes" }, "id": "way/636479695" },
				{ "arcs": [[66]], "type": "Polygon", "properties": { "@id": "way/636479697", "building": "yes" }, "id": "way/636479697" },
				{ "arcs": [[67]], "type": "Polygon", "properties": { "@id": "way/636479699", "building": "yes" }, "id": "way/636479699" },
				{ "arcs": [[68]], "type": "Polygon", "properties": { "@id": "way/636479700", "building": "yes" }, "id": "way/636479700" },
				{ "arcs": [[69]], "type": "Polygon", "properties": { "@id": "way/636479702", "building": "yes" }, "id": "way/636479702" },
				{ "arcs": [[70]], "type": "Polygon", "properties": { "@id": "way/686694596", "natural": "water" }, "id": "way/686694596" },
				{ "arcs": [[71]], "type": "Polygon", "properties": { "@id": "way/686694599", "natural": "water" }, "id": "way/686694599" },
				{ "arcs": [[72]], "type": "Polygon", "properties": { "@id": "way/686694601", "natural": "water" }, "id": "way/686694601" },
				{ "arcs": [[73]], "type": "Polygon", "properties": { "@id": "way/686694602", "natural": "water" }, "id": "way/686694602" },
				{ "arcs": [[74]], "type": "Polygon", "properties": { "@id": "way/686694605", "natural": "water", "water": "basin" }, "id": "way/686694605" },
				{ "arcs": [[75]], "type": "Polygon", "properties": { "@id": "way/686694606", "natural": "water", "water": "basin" }, "id": "way/686694606" },
				{ "arcs": [[76]], "type": "Polygon", "properties": { "@id": "way/686694607", "natural": "water" }, "id": "way/686694607" },
				{ "arcs": [[77]], "type": "Polygon", "properties": { "@id": "way/686694611", "natural": "water" }, "id": "way/686694611" },
				{ "arcs": [[78, 79]], "type": "Polygon", "properties": { "@id": "way/686694613", "landuse": "residential" }, "id": "way/686694613" },
				{ "arcs": [[-79, 80]], "type": "Polygon", "properties": { "@id": "way/686694618", "aeroway": "aerodrome", "iata": "SBR", "icao": "YSII", "name": "Saibai Island Airport", "source": "ourairports.com", "wikidata": "Q7399853", "wikipedia": "en:Saibai Island Airport" }, "id": "way/686694618" },
				{ "arcs": [[81]], "type": "Polygon", "properties": { "@id": "way/783958974", "natural": "water" }, "id": "way/783958974" },
				{ "arcs": [[82]], "type": "Polygon", "properties": { "@id": "way/783958975", "landuse": "cemetery", "description": "Burials hold deep cultural significance in the Torres Strait, with families maintaining rituals for over five years to honour the deceased’s spirit.", "videos": [{ "src": "https://player.vimeo.com/video/815273845", "type": "vimeo" }] }, "id": "way/783958975" },
				{ "arcs": [[83]], "type": "Polygon", "properties": { "@id": "way/783958982", "building": "yes", "name": "Ergon Power Plant" }, "id": "way/783958982" },
				{ "arcs": [[84]], "type": "Polygon", "properties": { "@id": "way/954609712", "building": "house" }, "id": "way/954609712" },
				{ "arcs": [[85]], "type": "Polygon", "properties": { "@id": "way/954609713", "building": "house" }, "id": "way/954609713" },
				{ "arcs": [[86]], "type": "Polygon", "properties": { "@id": "way/954609714", "building": "house" }, "id": "way/954609714" },
				{ "arcs": [[87]], "type": "Polygon", "properties": { "@id": "way/954609715", "building": "house" }, "id": "way/954609715" },
				{ "arcs": [[88]], "type": "Polygon", "properties": { "@id": "way/954609716", "building": "house" }, "id": "way/954609716" },
				{ "arcs": [[89]], "type": "Polygon", "properties": { "@id": "way/954609717", "building": "house" }, "id": "way/954609717" },
				{ "arcs": [[90]], "type": "Polygon", "properties": { "@id": "way/954609718", "building": "house" }, "id": "way/954609718" },
				{ "arcs": [[91]], "type": "Polygon", "properties": { "@id": "way/954609719", "building": "house" }, "id": "way/954609719" },
				{ "arcs": [[92]], "type": "Polygon", "properties": { "@id": "way/954609720", "building": "house" }, "id": "way/954609720" },
				{ "arcs": [[93]], "type": "Polygon", "properties": { "@id": "way/954609721", "building": "house" }, "id": "way/954609721" },
				{ "arcs": [[94]], "type": "Polygon", "properties": { "@id": "way/954609722", "building": "house" }, "id": "way/954609722" },
				{ "arcs": [[95]], "type": "Polygon", "properties": { "@id": "way/954609723", "building": "house" }, "id": "way/954609723" },
				{ "arcs": [[96]], "type": "Polygon", "properties": { "@id": "way/954609724", "building": "house" }, "id": "way/954609724" },
				{ "arcs": [[97]], "type": "Polygon", "properties": { "@id": "way/954609725", "building": "house" }, "id": "way/954609725" },
				{ "arcs": [[98]], "type": "Polygon", "properties": { "@id": "way/954609726", "building": "house" }, "id": "way/954609726" },
				{ "arcs": [[99]], "type": "Polygon", "properties": { "@id": "way/954609727", "building": "house" }, "id": "way/954609727" },
				{ "arcs": [[100]], "type": "Polygon", "properties": { "@id": "way/954609728", "building": "house" }, "id": "way/954609728" },
				{ "arcs": [[101]], "type": "Polygon", "properties": { "@id": "way/954609729", "building": "house" }, "id": "way/954609729" },
				{ "arcs": [[102]], "type": "Polygon", "properties": { "@id": "way/954609730", "building": "house" }, "id": "way/954609730" },
				{ "arcs": [[103]], "type": "Polygon", "properties": { "@id": "way/954609731", "building": "house" }, "id": "way/954609731" },
				{ "arcs": [[104]], "type": "Polygon", "properties": { "@id": "way/954609732", "building": "house" }, "id": "way/954609732" },
				{ "arcs": [[105]], "type": "Polygon", "properties": { "@id": "way/954609733", "building": "house" }, "id": "way/954609733" },
				{ "arcs": [[106]], "type": "Polygon", "properties": { "@id": "way/954609734", "building": "house" }, "id": "way/954609734" },
				{ "arcs": [[107]], "type": "Polygon", "properties": { "@id": "way/954609735", "building": "house" }, "id": "way/954609735" },
				{ "arcs": [[108]], "type": "Polygon", "properties": { "@id": "way/954609736", "building": "house" }, "id": "way/954609736" },
				{ "arcs": [[109]], "type": "Polygon", "properties": { "@id": "way/954609737", "building": "house" }, "id": "way/954609737" },
				{ "arcs": [[110]], "type": "Polygon", "properties": { "@id": "way/954609738", "building": "house" }, "id": "way/954609738" },
				{ "arcs": [[111]], "type": "Polygon", "properties": { "@id": "way/954609739", "building": "house" }, "id": "way/954609739" },
				{ "arcs": [[112]], "type": "Polygon", "properties": { "@id": "way/954609740", "building": "house" }, "id": "way/954609740" },
				{ "arcs": [[113]], "type": "Polygon", "properties": { "@id": "way/1266282172", "building": "yes" }, "id": "way/1266282172" },
				{ "type": "LineString", "arcs": [114, 115], "properties": { "@id": "way/494435872", "aeroway": "runway", "ref": "12/30", "surface": "asphalt" }, "id": "way/494435872" },
				{ "type": "LineString", "arcs": [116, 117], "properties": { "@id": "way/494435873", "aeroway": "taxiway" }, "id": "way/494435873" },
				{ "type": "LineString", "arcs": [118, 119, 120, 121], "properties": { "@id": "way/494435875", "highway": "residential" }, "id": "way/494435875" },
				{ "type": "LineString", "arcs": [122, 123, 124, 125, 126], "properties": { "@id": "way/494435876", "highway": "residential", "name": "Main Road", "source:name": "State of Queensland (Department of Natural Resources, Mines and Energy) 2019" }, "id": "way/494435876" },
				{ "type": "LineString", "arcs": [127], "properties": { "@id": "way/494435877", "highway": "residential", "name": "Airport Drive", "source:name": "State of Queensland (Department of Natural Resources, Mines and Energy) 2019" }, "id": "way/494435877" },
				{ "type": "LineString", "arcs": [128], "properties": { "@id": "way/494435878", "highway": "track", "tracktype": "grade1" }, "id": "way/494435878" },
				{ "type": "LineString", "arcs": [129], "properties": { "@id": "way/686694603", "highway": "track" }, "id": "way/686694603" },
				{ "type": "LineString", "arcs": [130, 131], "properties": { "@id": "way/686694604", "highway": "track" }, "id": "way/686694604" },
				{ "type": "LineString", "arcs": [132], "properties": { "@id": "way/686694608", "waterway": "stream" }, "id": "way/686694608" },
				{ "type": "LineString", "arcs": [133], "properties": { "@id": "way/686694609", "waterway": "stream" }, "id": "way/686694609" },
				{ "type": "LineString", "arcs": [134], "properties": { "@id": "way/686694610", "highway": "track" }, "id": "way/686694610" },
				{ "type": "LineString", "arcs": [135, 136], "properties": { "@id": "way/686694612", "highway": "track" }, "id": "way/686694612" },
				{ "type": "LineString", "arcs": [137, 138, 139, 140, 141], "properties": { "@id": "way/686694617", "highway": "residential", "name": "Main Road", "source:name": "State of Queensland (Department of Natural Resources, Mines and Energy) 2019" }, "id": "way/686694617" },
				{ "type": "LineString", "arcs": [142], "properties": { "@id": "way/783958976", "highway": "track" }, "id": "way/783958976" },
				{ "type": "LineString", "arcs": [143], "properties": { "@id": "way/783958977", "highway": "service", "service": "driveway" }, "id": "way/783958977" },
				{ "type": "LineString", "arcs": [144, 145], "properties": { "@id": "way/783958978", "highway": "track" }, "id": "way/783958978" },
				{ "type": "LineString", "arcs": [146, 147], "properties": { "@id": "way/783958979", "highway": "residential", "name": "Depot Road", "source:name": "State of Queensland (Department of Natural Resources, Mines and Energy) 2019" }, "id": "way/783958979" },
				{ "type": "LineString", "arcs": [148], "properties": { "@id": "way/783958980", "highway": "service", "service": "driveway" }, "id": "way/783958980" },
				{ "type": "LineString", "arcs": [149], "properties": { "@id": "way/783958981", "highway": "service", "service": "driveway" }, "id": "way/783958981" },
				{ "type": "LineString", "arcs": [150], "properties": { "@id": "way/1155761229", "highway": "unclassified" }, "id": "way/1155761229" },
				{ "type": "Point", "coordinates": [8988, 4366], "properties": { "@id": "node/6035839119", "gaz2012:ref": "QLD46703", "name": "Saibai Island", "place": "locality", "source": "Gazetteer of Australia 2012" }, "id": "node/6035839119" }
			]
		}
	}
};

const AUDIO = {
	'Wax Cylinders': {
		description: 'During the 1898 Alfred Cort Haddon Expedition, Haddon, Ray, and Jack were on Saibai Island from 22 to 25 October and recorded a series of wax cylinders.',
		date: '',
		items: [
			{ title: 'Na puidam purda', author: 'Wap (singer, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1076XX-0100M0.mp3' },
			{ title: 'Maduba na puidam', author: 'Gemetu (singer, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1077XX-0100M0.mp3' },
			{ title: 'Mawa na puidam', author: 'Kinaur (singer, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1078XX-0100M0.mp3' },
			{ title: 'Mawau na puidam', author: 'Gemetu (singer, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1079XX-0100M0.mp3' },
			{ title: 'Nau poida', author: 'Aimab (singer, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1080XX-0100M0.mp3' },
			{ title: 'About Saibai', author: 'Jack Assaii (speaker, male)', audio: 'https://www.true-echoes.com/wp-content/uploads/025A-C0080X1045XX-0100M0.mp3' },
		],
	},
	'Learn KKY': {
		date: '',
		items: [
			{ title: 'PART 01 - Oral history podcast', author: 'Jeffrey Aniba Waia', audio: 'https://learnkky.com/wp-content/uploads/2023/08/JEFFREY-ANIBA-WAIA-ORAL-HISTORY-PART-1.mp3?_=2' },
			{ title: 'PART 02 - Oral history podcast', author: 'Jeffrey Aniba Waia', audio: 'https://learnkky.com/wp-content/uploads/2023/08/JEFFREY-ANIBA-WAIA-ORAL-HISTORY-PART-2.mp3?_=2' },
			{ title: 'PART 03 - Oral history podcast', author: 'Jeffrey Aniba Waia', audio: 'https://learnkky.com/wp-content/uploads/2023/08/JEFFREY-ANIBA-WAIA-ORAL-HISTORY-PART-3.mp3?_=2' },
		],
	},
};
