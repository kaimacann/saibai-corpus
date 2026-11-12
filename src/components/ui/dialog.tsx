import React from "react";
import * as Primitive from "@radix-ui/react-dialog";
import { cn } from "@utils";
import { SURFACE_VARIANTS, type SurfaceVariant } from "./variants";

export const Dialog = Primitive.Root;
/**
 * Arranges dialog heading and supporting content with consistent spacing.
 *
 * @param className - Additional CSS classes merged into the header.
 * @param attributes - Remaining HTML attributes forwarded to the header.
 * @returns The dialog header container.
 */
export function DialogHeader({
  className,
  ...attributes
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("grid gap-2", className)} {...attributes} />;
}
/**
 * Renders the accessible title for a dialog.
 *
 * @param className - Additional CSS classes merged into the title.
 * @param attributes - Remaining Radix title properties forwarded to the primitive.
 * @returns The dialog title element.
 */
export function DialogTitle({
  className,
  ...attributes
}: React.ComponentProps<typeof Primitive.Title>): React.JSX.Element {
  return (
    <Primitive.Title
      className={cn("text-xl font-semibold", className)}
      {...attributes}
    />
  );
}
/**
 * Renders the accessible description for a dialog.
 *
 * @param className - Additional CSS classes merged into the description.
 * @param attributes - Remaining Radix description properties forwarded to the primitive.
 * @returns The dialog description element.
 */
export function DialogDescription({
  className,
  ...attributes
}: React.ComponentProps<typeof Primitive.Description>): React.JSX.Element {
  return (
    <Primitive.Description
      className={cn("text-sm text-slate-600", className)}
      {...attributes}
    />
  );
}
/**
 * Renders dialog content in a portal with a modal overlay and surface style.
 *
 * @param className - Additional CSS classes merged into the content surface.
 * @param children - Content rendered inside the dialog.
 * @param variant - Surface treatment applied to the content.
 * @param attributes - Remaining Radix content properties forwarded to the primitive.
 * @returns The portalled dialog surface and overlay.
 */
export function DialogContent({
  className,
  children,
  variant = "primary",
  ...attributes
}: React.ComponentProps<typeof Primitive.Content> & {
  variant?: SurfaceVariant;
}): React.JSX.Element {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 z-[100] bg-black/60" />
      <Primitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[101] max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg p-6 shadow-xl",
          SURFACE_VARIANTS({ variant }),
          className,
        )}
        {...attributes}
      >
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  );
}
