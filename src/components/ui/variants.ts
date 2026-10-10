import { cva } from "class-variance-authority";

/** Semantic palette names available to the shared controls. */
export type UiColor = "primary" | "secondary" | "gray" | "destructive";
/** Treatment names used to build a semantic UI variant. */
export type UiType =
  | "default"
  | "outline"
  | "ghost"
  | "tonal"
  | "saturated"
  | "link"
  | "underline";
/** Standard size scale shared across buttons and form controls. */
export type UiSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Valid color and treatment combinations for action controls. */
export type ActionVariant =
  UiColor | `${UiColor}-${Exclude<UiType, "default" | "saturated">}`;
/** Valid color and treatment combinations for input controls. */
export type ControlVariant =
  UiColor | `${UiColor}-${Extract<UiType, "outline" | "ghost" | "tonal">}`;
/** Valid color and treatment combinations for containing surfaces. */
export type SurfaceVariant =
  UiColor | `${UiColor}-${Exclude<UiType, "default" | "link" | "underline">}`;

/** Button dimensions, extended with the compact icon-only option. */
type ButtonSize = UiSize | "icon";

const ACTION_VARIANT_CLASSES = {
  primary: "bg-cyan-700 text-white enabled:hover:bg-cyan-800",
  "primary-outline":
    "border border-cyan-800 bg-transparent text-cyan-900 enabled:hover:bg-cyan-50",
  "primary-ghost": "text-cyan-900 enabled:hover:bg-cyan-100",
  "primary-tonal":
    "border border-cyan-800 bg-cyan-300 text-cyan-950 enabled:hover:bg-cyan-400",
  "primary-link":
    "text-cyan-900 dark:text-cyan-50 underline-offset-4 hover:underline focus-visible:underline disabled:hover:no-underline",
  "primary-underline": "text-cyan-900 dark:text-cyan-50 underline",
  secondary: "bg-yellow-300 text-yellow-950 enabled:hover:bg-yellow-400",
  "secondary-outline":
    "border border-yellow-700 bg-transparent text-yellow-950 enabled:hover:bg-yellow-50",
  "secondary-ghost": "text-yellow-950 enabled:hover:bg-yellow-100",
  "secondary-tonal":
    "border border-yellow-700 bg-yellow-300 text-yellow-950 enabled:hover:bg-yellow-400",
  "secondary-link":
    "text-yellow-950 underline-offset-4 hover:underline focus-visible:underline disabled:hover:no-underline",
  "secondary-underline": "text-yellow-950 underline",
  gray: "bg-gray-900 text-white enabled:hover:bg-gray-800",
  "gray-outline":
    "border border-gray-300 bg-white text-gray-900 enabled:hover:bg-gray-100",
  "gray-ghost": "text-gray-900 enabled:hover:bg-gray-100",
  "gray-tonal":
    "border border-gray-200 bg-gray-100 text-gray-900 enabled:hover:bg-gray-200",
  "gray-link":
    "text-gray-700 dark:text-gray-200 underline-offset-4 hover:underline focus-visible:underline disabled:hover:no-underline",
  "gray-underline": "text-gray-700 dark:text-gray-200 underline",
  destructive:
    "border border-rose-700 bg-rose-600 text-white enabled:hover:bg-rose-600/90 dark:border-rose-800 dark:bg-rose-900 dark:hover:bg-rose-900/90",
  "destructive-outline":
    "border border-rose-600 bg-transparent text-rose-700 enabled:hover:bg-rose-50",
  "destructive-ghost": "text-rose-700 enabled:hover:bg-rose-50",
  "destructive-tonal":
    "border border-rose-300 bg-rose-50 text-rose-950 enabled:hover:bg-rose-100",
  "destructive-link":
    "text-rose-700 underline-offset-4 hover:underline focus-visible:underline disabled:hover:no-underline",
  "destructive-underline": "text-rose-700 underline",
} satisfies Record<ActionVariant, string>;

const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "h-6 px-2 text-xs",
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 py-2 text-sm",
  lg: "h-11 px-8 text-base",
  xl: "h-14 px-6 text-base",
  icon: "size-10 text-sm",
};

/**
 * Describes the documented declaration.
 *
 * @remarks Defines variant styles for the Button component using class-variance-authority.
 *
 * @param props - Standard CVA parameters.
 *
 * @returns A string of compiled Tailwind classes.
 */
export const ACTION_VARIANTS = cva("", {
  variants: {
    variant: ACTION_VARIANT_CLASSES,
    size: BUTTON_SIZE_CLASSES,
  },
  defaultVariants: { variant: "primary" },
});

const CONTROL_VARIANT_CLASSES = {
  primary:
    "text-cyan-200 data-[state=active]:bg-cyan-700 data-[state=active]:text-white",
  "primary-outline":
    "border border-cyan-700 text-cyan-200 data-[state=active]:bg-cyan-700 data-[state=active]:text-white",
  "primary-ghost":
    "text-cyan-200 enabled:hover:bg-cyan-800 data-[state=active]:bg-cyan-700 data-[state=active]:text-white",
  "primary-tonal":
    "bg-cyan-900 text-cyan-100 data-[state=active]:bg-cyan-700 data-[state=active]:text-white",
  secondary:
    "text-yellow-200 data-[state=active]:bg-yellow-700 data-[state=active]:text-white",
  "secondary-outline":
    "border border-yellow-700 text-yellow-200 data-[state=active]:bg-yellow-700 data-[state=active]:text-white",
  "secondary-ghost":
    "text-yellow-200 enabled:hover:bg-yellow-800 data-[state=active]:bg-yellow-700 data-[state=active]:text-white",
  "secondary-tonal":
    "bg-yellow-900 text-yellow-100 data-[state=active]:bg-yellow-700 data-[state=active]:text-white",
  gray: "text-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white",
  "gray-outline":
    "border border-gray-500 text-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white",
  "gray-ghost":
    "text-gray-200 enabled:hover:bg-gray-800 data-[state=active]:bg-gray-700 data-[state=active]:text-white",
  "gray-tonal":
    "bg-gray-900 text-gray-100 data-[state=active]:bg-gray-700 data-[state=active]:text-white",
  destructive:
    "text-rose-200 data-[state=active]:bg-rose-700 data-[state=active]:text-white",
  "destructive-outline":
    "border border-rose-700 text-rose-200 data-[state=active]:bg-rose-700 data-[state=active]:text-white",
  "destructive-ghost":
    "text-rose-200 enabled:hover:bg-rose-800 data-[state=active]:bg-rose-700 data-[state=active]:text-white",
  "destructive-tonal":
    "bg-rose-900 text-rose-100 data-[state=active]:bg-rose-700 data-[state=active]:text-white",
} satisfies Record<ControlVariant, string>;

const CONTROL_SIZE_CLASSES: Record<UiSize, string> = {
  xs: "h-6 px-2 py-0.5 text-sm",
  sm: "h-9 px-3 py-2 text-sm",
  md: "h-10 px-4 py-2 text-sm",
  lg: "h-11 px-8 py-2 text-base",
  xl: "h-14 px-6 py-3 text-base",
};

export const CONTROL_VARIANTS = cva("inline-flex items-center justify-center", {
  variants: {
    variant: CONTROL_VARIANT_CLASSES,
    size: CONTROL_SIZE_CLASSES,
  },
  defaultVariants: { variant: "primary", size: "md" },
});

const SURFACE_VARIANT_CLASSES = {
  primary: "border border-cyan-800 bg-white text-cyan-900",
  "primary-outline":
    "border border-cyan-800 bg-transparent text-cyan-900",
  "primary-ghost": "border-transparent bg-transparent text-cyan-900",
  "primary-tonal": "border border-cyan-200 bg-cyan-50 text-cyan-950",
  "primary-saturated": "border border-cyan-800 bg-cyan-800 text-white",
  secondary: "border border-yellow-200 bg-white text-yellow-950",
  "secondary-outline":
    "border border-yellow-700 bg-transparent text-yellow-950",
  "secondary-ghost": "border-transparent bg-transparent text-yellow-950",
  "secondary-tonal": "border border-yellow-200 bg-yellow-50 text-yellow-950",
  "secondary-saturated": "border border-yellow-700 bg-yellow-700 text-white",
  gray: "border border-gray-200 bg-white text-gray-900",
  "gray-outline": "border border-gray-300 bg-transparent text-gray-900",
  "gray-ghost": "border-transparent bg-transparent text-gray-900",
  "gray-tonal": "border border-gray-200 bg-gray-100 text-gray-900",
  "gray-saturated": "border border-gray-900 bg-gray-900 text-white",
  destructive: "border border-rose-200 bg-white text-rose-950",
  "destructive-outline":
    "border border-rose-600 bg-transparent text-rose-950",
  "destructive-ghost": "border-transparent bg-transparent text-rose-950",
  "destructive-tonal": "border border-rose-300 bg-rose-50 text-rose-950",
  "destructive-saturated": "border border-rose-800 bg-rose-800 text-white",
} satisfies Record<SurfaceVariant, string>;

export const SURFACE_VARIANTS = cva("", {
  variants: { variant: SURFACE_VARIANT_CLASSES },
  defaultVariants: { variant: "primary" },
});
