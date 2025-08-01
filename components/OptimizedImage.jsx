import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized Image component with loading states and error handling
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} className - CSS class name
 * @param {boolean} priority - Next.js priority prop for above-the-fold images
 * @param {Object} style - Inline styles
 * @param {Function} onLoad - Callback when image loads
 * @param {Function} onError - Callback when image fails to load
 * @param {string} fallbackSrc - Fallback image if main image fails
 * @param {boolean} unoptimized - Skip Next.js optimization for certain images
 */
function OptimizedImage({ 
  src, 
  alt = '', 
  width, 
  height, 
  className = '', 
  priority = false,
  style = {},
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder.png',
  unoptimized = false,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setCurrentSrc(fallbackSrc);
    if (onError) onError();
  };

  const imageClassName = `
    optimized-image 
    ${isLoading ? 'loading' : 'loaded'} 
    ${hasError ? 'error' : ''} 
    ${className}
  `.trim();

  return (
    <div className="optimized-image-container" style={{ position: 'relative', ...style }}>
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={imageClassName}
        priority={priority}
        unoptimized={unoptimized}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {isLoading && (
        <div className="image-loader" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #4CAF50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      
      {hasError && (
        <div className="image-error" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#999',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          ⚠️ Image not found
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
