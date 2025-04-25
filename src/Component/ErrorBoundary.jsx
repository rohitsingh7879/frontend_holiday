/* eslint-disable react/prop-types */
import React from "react";
import "../assets/css/errorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    this.setState({ error, errorInfo });
    // console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-container">
            <div className="error-title">Whoops! Something broke.</div>
            <div className="error-message">
              {" "}
              Our team has been notified. In the meantime, try refreshing the
              page or return to the homepage.
            </div>
            <div className="error-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <a href="/" className="btn btn-primary btn-lg">
                Go Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
