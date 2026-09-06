import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#faf8f5',
            color: '#1a1a1a',
            fontFamily: 'serif',
          }}
        >
          <h1 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Something unexpected occurred
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6b7280', maxWidth: 460, marginBottom: '2rem', lineHeight: 1.6 }}>
            {this.state.error?.message || 'An error occurred while loading this view.'}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.625rem 1.5rem',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'sans-serif',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
