import { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null as Error | null,
  };

  constructor(props: object) {
    super(props);
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // send to TrackJS/Sentry/LogRocket
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Error</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    // Render children if no error - pss through
    // @ts-expect-error // children prop exists
    return this.props.children;
  }
}

export default ErrorBoundary;
