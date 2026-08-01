import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Root-level safety net: a render-time crash anywhere in the tree would
 * otherwise take the whole app down to a blank white screen with no
 * recovery. This catches it, logs it, and offers a reload instead.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred. Reloading the page usually fixes this.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
