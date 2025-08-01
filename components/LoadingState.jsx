import React from 'react';
import RingSpinner from './RingSpinner';

/**
 * Enhanced loading component with better UX
 * @param {boolean} loading - Whether to show loading state
 * @param {React.ReactNode} children - Content to show when not loading
 * @param {string} message - Optional loading message
 * @param {string} size - Size of the spinner (small, medium, large)
 * @param {boolean} overlay - Whether to show as overlay
 */
function LoadingState({ 
  loading, 
  children, 
  message = "Loading...", 
  size = "medium",
  overlay = false,
  className = ""
}) {
  if (!loading) {
    return children;
  }

  const sizeClass = {
    small: 'loading-small',
    medium: 'loading-medium', 
    large: 'loading-large'
  }[size];

  const overlayClass = overlay ? 'loading-overlay' : '';

  return (
    <div className={`loading-state ${sizeClass} ${overlayClass} ${className}`}>
      <div className="loading-content">
        <RingSpinner />
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
}

export default LoadingState;
