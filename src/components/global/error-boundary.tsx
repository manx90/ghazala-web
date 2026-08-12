'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorScreen } from '@/components/global/error-screen';
import { sanitizeRuntimeError } from '@/utils/sanitize-error';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <ErrorScreen
          title={this.props.fallbackTitle}
          message={sanitizeRuntimeError(this.state.error)}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
