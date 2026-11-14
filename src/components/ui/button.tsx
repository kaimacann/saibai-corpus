import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@utils';
import { ACTION_VARIANTS, type ActionVariant } from './variants';

/** Visual variant options shared by button and link controls. */
type ButtonStyleProps = {
	variant?: ActionVariant;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
};

/** Renders a button or lets Radix Slot compose the action into its child.
 * @param className - Extra classes merged into the variant styles.
 * @param variant - Action color and treatment.
 * @param size - Button dimensions.
 * @param asChild - Whether the button should clone its child with the styles.
 * @param attrs - Native button attributes forwarded to the rendered element.
 * @param ref - Ref forwarded to the rendered button or slot child.
 * @returns The configured button action.
 */
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps & { asChild?: boolean }>(function (
	{ className, variant, size = 'md', asChild = false, ...attrs },
	ref,
): React.ReactElement {
	// terra-quality-ignore single-use -- The selected element type keeps Slot and native button prop forwarding identical within this render.
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(
				'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
				ACTION_VARIANTS({ variant, size, className }),
			)}
			ref={ref}
			{...attrs}
		/>
	);
});
Button.displayName = 'Button';

/** Renders an anchor with the shared action treatments.
 * @param className - Extra classes merged into the link treatment.
 * @param variant - Action color and treatment; defaults to primary-underline.
 * @param size - Optional link dimensions.
 * @param attrs - Native anchor attributes forwarded to the link.
 * @param ref - Ref forwarded to the anchor element.
 * @returns The styled navigation link.
 */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & ButtonStyleProps>(function (
	{ className, variant = 'primary-underline', size, ...attrs },
	ref,
): React.ReactElement {
	return (
		<a
			className={cn('inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2', ACTION_VARIANTS({ variant, size, className }))}
			ref={ref}
			{...attrs}
		/>
	);
});
ButtonLink.displayName = 'ButtonLink';
