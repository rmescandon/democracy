import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorAlert from "@/app/ui/error-alert";

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service if needed
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <ErrorAlert error={this.state.error ?? undefined} onRetry={this.handleRetry} />
          {this.props.children}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
