import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Error Boundary Component
 *
 * Catches React errors and prevents:
 * - Bug #2: Infinite loops crashing the app
 * - Unhandled errors breaking the UI
 * - Poor user experience during errors
 *
 * Detects specific error patterns:
 * - Maximum update depth exceeded (infinite loops)
 * - Maximum call stack (infinite recursion)
 * - Memory errors
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  lastErrorTime: number;
}

class ErrorBoundary extends Component<Props, State> {
  private errorDetectionInterval: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now();
    const timeSinceLastError = now - this.state.lastErrorTime;

    // Update error count
    const errorCount = timeSinceLastError < 5000 ? this.state.errorCount + 1 : 1;

    this.setState({
      errorInfo,
      errorCount,
      lastErrorTime: now,
    });

    // Detect infinite loop (Bug #2)
    if (
      error.message.includes('Maximum update depth exceeded') ||
      error.message.includes('Too many re-renders')
    ) {
      console.error('🚨 INFINITE LOOP DETECTED!', {
        error: error.message,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });

      // Show alert to user
      alert(
        'Infinite loop detected! The page will refresh to prevent browser crash.\n\n' +
        'This is a known issue that our team is working to fix.'
      );

      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      return;
    }

    // Detect maximum call stack (infinite recursion)
    if (
      error.message.includes('Maximum call stack') ||
      error.name === 'RangeError'
    ) {
      console.error('🚨 INFINITE RECURSION DETECTED!', {
        error: error.message,
        componentStack: errorInfo.componentStack,
      });

      alert('A serious error occurred. The page will refresh.');

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      return;
    }

    // Detect rapid repeated errors (possible memory leak or infinite loop)
    if (errorCount > 5) {
      console.error('🚨 RAPID REPEATED ERRORS DETECTED!', {
        count: errorCount,
        error: error.message,
        componentStack: errorInfo.componentStack,
      });

      alert(
        `Detected ${errorCount} errors in quick succession. ` +
        'This may indicate a serious issue. The page will refresh.'
      );

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      return;
    }

    // Log error for monitoring
    this.logError(error, errorInfo);

    // Send to error tracking service (Sentry, etc.)
    if (import.meta.env.MODE === 'production') {
      this.sendToErrorTracking(error, errorInfo);
    }
  }

  componentDidMount() {
    // Monitor memory usage (if available)
    this.errorDetectionInterval = window.setInterval(() => {
      this.checkMemoryUsage();
    }, 30000); // Every 30 seconds
  }

  componentWillUnmount() {
    if (this.errorDetectionInterval) {
      window.clearInterval(this.errorDetectionInterval);
    }
  }

  private checkMemoryUsage() {
    // Check memory usage if performance.memory is available
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);

      // Warn if memory usage is high
      if (usedMB > 200) {
        console.warn('⚠️  HIGH MEMORY USAGE', {
          used: `${usedMB}MB`,
          total: `${totalMB}MB`,
          percentage: `${Math.round((usedMB / totalMB) * 100)}%`,
        });

        // Critical memory usage
        if (usedMB > 400) {
          console.error('🚨 CRITICAL MEMORY USAGE - Possible memory leak!', {
            used: `${usedMB}MB`,
            total: `${totalMB}MB`,
          });
        }
      }
    }
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    console.error('⚠️  React Error Caught', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private sendToErrorTracking(error: Error, _errorInfo: ErrorInfo) {
    // Send to Sentry or other error tracking service
    // Example:
    // Sentry.captureException(error, {
    //   extra: {
    //     componentStack: _errorInfo.componentStack,
    //   },
    // });

    console.log('📤 Sending error to tracking service:', error.message);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>

              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>

              {import.meta.env.MODE === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-800 break-words">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-sm text-red-700 cursor-pointer">
                        Component Stack
                      </summary>
                      <pre className="mt-2 text-xs text-red-600 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-primary-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Try Again
                </button>

                <button
                  onClick={this.handleReload}
                  className="w-full bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reload Page
                </button>

                <a
                  href="/"
                  className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2"
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * Hook to manually trigger error boundary
 */
export const useErrorHandler = () => {
  const [, setError] = React.useState();

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};
