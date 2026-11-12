import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@utils";
import { ACTION_VARIANTS, type ActionVariant, type UiSize } from "./variants";

/** Visual variant options shared by button and link controls. */
type ButtonStyleProps = {
  variant?: ActionVariant;
  size?: UiSize | "icon";
};

/** Native button attributes extended with shared action and composition props. */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps & {
    asChild?: boolean;
  };

const BUTTON_BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0";

/**
 * Renders the shared Saibai button with optional polymorphic child composition.
 *
 * @remarks A generic button component that supports Radix Slot for polymorphic rendering.
 *
 * @param className - Extra classes merged into the variant styles.
 * @param variant - Action color and treatment.
 * @param size - Button dimensions.
 * @param asChild - Whether Radix Slot should compose the styles into a child.
 * @param attrs - Native button attributes and children.
 * @param ref - Ref attached to the rendered button element.
 *
 * @returns Rendered HTML button or Radix Slot.
 */
/** Renders a button or lets Radix Slot compose the action into its child.
 * @param className - Extra classes merged into the variant styles.
 * @param variant - Action color and treatment.
 * @param size - Button dimensions.
 * @param asChild - Whether the button should clone its child with the styles.
 * @param attrs - Native button attributes forwarded to the rendered element.
 * @param ref - Ref forwarded to the rendered button or slot child.
 * @returns The configured button action.
 */
function renderButton(
  { className, variant, size = "md", asChild = false, ...attrs }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.ReactElement {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        BUTTON_BASE_CLASSES,
        ACTION_VARIANTS({ variant, size, className }),
      )}
      ref={ref}
      {...attrs}
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  renderButton,
);
Button.displayName = "Button";

/** Renders a navigation link with the shared action treatments, defaulting to primary-underline. */
/** Renders an anchor with the shared action treatments.
 * @param className - Extra classes merged into the link treatment.
 * @param variant - Action color and treatment; defaults to primary-underline.
 * @param size - Optional link dimensions.
 * @param attrs - Native anchor attributes forwarded to the link.
 * @param ref - Ref forwarded to the anchor element.
 * @returns The styled navigation link.
 */
function renderButtonLink(
  {
    className,
    variant = "primary-underline",
    size,
    ...attrs
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & ButtonStyleProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
): React.ReactElement {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        ACTION_VARIANTS({ variant, size, className }),
      )}
      ref={ref}
      {...attrs}
    />
  );
}

export const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & ButtonStyleProps
>(renderButtonLink);
ButtonLink.displayName = "ButtonLink";
