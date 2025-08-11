import Image from 'next/image';
import { getPositioningStyles } from '../../utils/positioningUtils';

export function ImageBlock({ data = {} }) {
  const {
    src = '', 
    alt = '',
    caption = '',
    width = 'full',
    alignment = 'center',
    link = '',
    borderRadius = 'none'
  } = data;

  const positioningStyles = getPositioningStyles(data);

  if (!src) {
    return (
      <section style={positioningStyles.container}>
        <div style={{
          backgroundColor: '#f3f4f6',
          border: '2px dashed #d1d5db',
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          No image selected
        </div>
      </section>
    );
  }

  // Container styles
  const containerStyles = {
    ...positioningStyles.container,
    textAlign: alignment
  };

  // Image wrapper styles
  const imageWrapperStyles = {
    display: 'inline-block',
    maxWidth: width === 'small' ? '300px' :
              width === 'medium' ? '500px' :
              width === 'large' ? '800px' : '100%',
    width: '100%'
  };

  // Image styles
  const imageStyles = {
    width: '100%',
    height: 'auto',
    borderRadius: borderRadius === 'none' ? '0px' :
                  borderRadius === 'small' ? '4px' :
                  borderRadius === 'medium' ? '8px' :
                  borderRadius === 'large' ? '16px' :
                  borderRadius === 'full' ? '50%' : '0px',
    display: 'block'
  };

  // Caption styles
  const captionStyles = {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '8px',
    textAlign: 'center'
  };

  const imageElement = (
    <div style={imageWrapperStyles}>
      <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          style={imageStyles}
          priority={false}
        />
      </div>
      {caption && (
        <p style={captionStyles}>{caption}</p>
      )}
    </div>
  );

  return (
    <section style={containerStyles}>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </section>
  );
}
