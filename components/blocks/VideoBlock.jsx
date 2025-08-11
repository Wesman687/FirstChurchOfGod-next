import { useState, useRef } from 'react';

export function VideoBlock({ 
  videoUrl = '',
  posterImage = '',
  title = '',
  description = '',
  autoplay = false,
  controls = true,
  muted = false,
  width = 'full', // small, medium, large, full
  alignment = 'center' // left, center, right
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  const widthClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md', 
    large: 'max-w-2xl',
    full: 'max-w-full'
  };

  const alignmentClasses = {
    left: 'mx-0',
    center: 'mx-auto',
    right: 'ml-auto mr-0'
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}`;
    }
    return url;
  };

  // Convert Vimeo URL to embed format
  const getVimeoEmbedUrl = (url) => {
    const regex = /vimeo\.com\/(?:.*#|.*\/folders\/.*\/video\/|.*videos\/|)(\d+)/;
    const match = url.match(regex);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}`;
    }
    return url;
  };

  if (!videoUrl) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">No video selected</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className={`${widthClasses[width]} ${alignmentClasses[alignment]}`}>
          {title && (
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
          )}
          
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}

          <div className="relative bg-black rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {hasError ? (
              <div className="aspect-video flex items-center justify-center bg-gray-200 text-gray-500">
                <div className="text-center">
                  <p>Unable to load video</p>
                  <a 
                    href={videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            ) : (
              <>
                {isYouTube ? (
                  <iframe
                    src={getYouTubeEmbedUrl(videoUrl)}
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoLoad}
                    onError={handleVideoError}
                  />
                ) : isVimeo ? (
                  <iframe
                    src={getVimeoEmbedUrl(videoUrl)}
                    className="w-full aspect-video"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoLoad}
                    onError={handleVideoError}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    controls={controls}
                    autoPlay={autoplay}
                    muted={muted}
                    poster={posterImage}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
