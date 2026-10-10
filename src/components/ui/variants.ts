import { cva } from "class-variance-authority";

export type UiColor = "primary" | "secondary" | "gray" | "destructive";
export type UiType =
  | "default"
  | "outline"
  | "ghost"
  | "tonal"
  | "saturated"
  | "link"
  | "underline";
export type UiSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ActionVariant =
  UiColor | `${UiColor}-${Exclude<UiType, "default" | "saturated">}`;
export type ControlVariant =
  UiColor | `${UiColor}-${Extract<UiType, "outline" | "ghost" | "tonal">}`;
export type SurfaceVariant =
  UiColor | `${UiColor}-${Exclude<UiType, "default" | "link" | "underline">}`;

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
