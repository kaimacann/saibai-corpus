import type React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { BUTTON_VARIANTS } from '../components/ui/variants';

export type MarqueeComponentProps = { reverse?: boolean; duration?: number; delay?: number; ease?: string | true; pauseOnHover?: boolean; pauseOnClick?: boolean; rows?: number; className?: string; children: React.ReactNode; as?: string };
export type PlayerProps = { src: string; poster?: string; className?: string; title?: string; author?: string; meta?: string; alt?: string };
export type AudioTrack = { title: string; author: string; audio: string; date: string; source: string };
export type Person = { id: string; name: string; spouseId: string | null; parents: string[]; children: string[]; annotations?: string[]; clans: string[]; audio?: AudioTrack[] };
export type SaibaiFlowNode = { nodeData: Person; origin: boolean; terminus: boolean; setSelectedNode: React.Dispatch<React.SetStateAction<Person | null>> };
export type SaibaiButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof BUTTON_VARIANTS> & { asChild?: boolean };
export type AudioCtrlsProps = React.ComponentPropsWithoutRef<'div'> & { className?: string };
