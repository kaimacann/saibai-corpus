import React from "react";

/** Inputs used to label an isolated React subtree and render its failure fallback. */
type Props = {
  name: string;
  children: React.ReactNode;
  fallback?: (error: Error) => React.ReactNode;
};
/** Error captured by the boundary, or `null` while its child tree is healthy. */
type State = { error: Error | null };

/** Catches descendant render errors and replaces the failed subtree with a readable fallback. */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    console.error(`${this.props.name} failed to render`, error);
  }

  render(): React.ReactNode {
    if (this.state.error)
      return (
        this.props.fallback?.(this.state.error) ?? (
          <p role="alert">This section could not be displayed.</p>
        )
      );
    return this.props.children;
  }
}
