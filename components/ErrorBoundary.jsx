import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to a service
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>🚨 Something went wrong</h3>
          <p>We&apos;re sorry, but something unexpected happened. Please try refreshing the page.</p>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
              <summary>Error Details (Development Mode)</summary>
              <br />
              <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              <br />
              <strong>Stack:</strong> {this.state.errorInfo.componentStack}
            </details>
          )}
          
          <button onClick={this.handleReset}>
            Try Again
          </button>
          
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
