import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@utils";
import { ACTION_VARIANTS, type ActionVariant, type UiSize } from "./variants";

type ButtonSize = UiSize | "icon";
type ButtonStyleProps = {
  variant?: ActionVariant;
  size?: ButtonSize;
};

/** Button HTML attributes combined with the Saibai button variant options. */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps & { asChild?: boolean };
type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonStyleProps;

const BUTTON_BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0";

/**
 * Renders the shared Saibai button with optional polymorphic child composition.
 *
 * @remarks A generic button component that supports Radix Slot for polymorphic rendering.
 *
 * @param props - Native button attributes, children, and visual variant options.
 * @param ref - Ref attached to the rendered button element.
 *
 * @returns Rendered HTML button or Radix Slot.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          BUTTON_BASE_CLASSES,
          ACTION_VARIANTS({ variant, size, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

/** Renders a navigation link with the shared action treatment variants. */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant = "primary-link", size, ...props }, ref) => (
    <a
      className={cn(
        "inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        ACTION_VARIANTS({ variant, size, className }),
      )}
      ref={ref}
      {...props}
    />
  ),
);
ButtonLink.displayName = "ButtonLink";
