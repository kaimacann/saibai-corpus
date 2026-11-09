import React, { Component } from "react";

/** Error details supplied to an optional application-owned reporter. */
export type ErrorReporter = (
  error: Error,
  report: { name: string; componentStack: string | null },
) => void;

/** Props accepted by the reusable React error boundary. */
export type ErrorBoundaryProps = {
  children?: React.ReactNode;
  fallback?: (error: Error) => React.ReactNode;
  name?: string;
  resetKey?: string;
  onError?: ErrorReporter;
};

/** State held while a descendant render error is being shown. */
export type ErrorBoundaryState = { error: Error | null };

/** Catches descendant render errors and exposes fallback and recovery hooks. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  /** Saves a render error so the boundary can display its fallback. */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  /** Reports a caught error with the boundary name and React component stack. */
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, {
      name: this.props.name ?? "Component",
      componentStack: info.componentStack ?? null,
    });
  }

  /** Clears a captured error when the caller changes the reset key. */
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  /** Renders the children or the configured fallback after an error. */
  render(): React.ReactNode {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.state.error);
    return (
      <div role="alert">
        An unexpected error occurred while rendering this section.
      </div>
    );
  }
}
