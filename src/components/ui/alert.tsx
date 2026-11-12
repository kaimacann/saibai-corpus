import React from "react";
import { cn } from "@utils";

/**
 * Displays a status message with default or destructive styling.
 *
 * @param className - Additional CSS classes merged into the alert.
 * @param variant - Visual treatment for the message.
 * @param attributes - Remaining HTML attributes forwarded to the alert element.
 * @returns The styled status message.
 */
function Alert({
  className,
  variant = "default",
  ...attributes
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive";
}): React.JSX.Element {
  return (
    <div
      role="status"
      className={cn(
        "rounded border p-3 text-sm",
        variant === "destructive"
          ? "border-rose-300 bg-rose-50 text-rose-950"
          : "border-slate-300",
        className,
      )}
      {...attributes}
    />
  );
}
/**
 * Renders the heading inside an alert.
 *
 * @param className - Additional CSS classes merged into the heading.
 * @param attributes - Remaining HTML attributes forwarded to the heading.
 * @returns The styled alert heading.
 */
function AlertTitle({
  className,
  ...attributes
}: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  return <h2 className={cn("font-semibold", className)} {...attributes} />;
}
/**
 * Renders the descriptive text inside an alert.
 *
 * @param className - Additional CSS classes merged into the description.
 * @param attributes - Remaining HTML attributes forwarded to the paragraph.
 * @returns The styled alert description.
 */
function AlertDescription({
  className,
  ...attributes
}: React.HTMLAttributes<HTMLParagraphElement>): React.JSX.Element {
  return <p className={cn("text-sm", className)} {...attributes} />;
}
/**
 * Composes a destructive alert from its title and description.
 *
 * @param title - Heading displayed above the error description.
 * @param description - Explanation shown to the user.
 * @returns The composed destructive alert.
 */
export function AlertError({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
