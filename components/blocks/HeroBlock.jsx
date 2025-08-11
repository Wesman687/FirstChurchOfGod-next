import Image from 'next/image';
import { getPositioningStyles, getButtonStyles } from '../../utils/positioningUtils';
import { useState } from 'react';

export function HeroBlock({ data = {} }) {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const positioningStyles = getPositioningStyles(data);
  
  // Background styles
  let backgroundStyles = {};
  
  if (data.backgroundType === 'image' && data.backgroundImage) {
    backgroundStyles = {
      backgroundImage: `url(${data.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  } else if (data.backgroundType === 'gradient' && data.backgroundGradient) {
    backgroundStyles = {
      background: data.backgroundGradient
    };
  } else {
    backgroundStyles = {
      backgroundColor: data.backgroundColor || '#3b82f6'
    };
  }

  // Container styles
  const containerStyles = {
    ...positioningStyles.container,
    ...backgroundStyles,
    minHeight: data.height || '400px',
    width: data.width || '100%',
    position: 'relative',
    display: 'flex',
    alignItems: data.contentVertical === 'top' ? 'flex-start' : 
               data.contentVertical === 'bottom' ? 'flex-end' : 'center',
    justifyContent: data.contentHorizontal === 'left' ? 'flex-start' :
                   data.contentHorizontal === 'right' ? 'flex-end' : 'center'
  };

  // Overlay styles
  const overlayStyles = data.backgroundOverlay ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0, 0, 0, ${data.overlayOpacity || 0.4})`,
    zIndex: 1
  } : null;

  // Content styles
  const contentStyles = {
    position: 'relative',
    zIndex: 2,
    textAlign: data.textAlign || 'center',
    color: data.textColor || '#ffffff',
    fontFamily: data.fontFamily || 'inherit',
    maxWidth: data.contentWidth === 'narrow' ? '600px' :
              data.contentWidth === 'wide' ? '1200px' :
              data.contentWidth === 'full' ? '100%' : '800px',
    width: '100%',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: data.textAlign === 'center' ? 'center' : 
               data.textAlign === 'right' ? 'flex-end' : 'flex-start'
  };

  // Title styles with individual positioning
  const titleStyles = {
    fontSize: data.titleSize || '48px',
    fontWeight: '700',
    margin: '0',
    lineHeight: '1.1',
    textAlign: data.titleTextAlign || data.textAlign || 'center',
    marginTop: data.titleMarginTop || '0px',
    marginBottom: data.titleMarginBottom || '16px',
    marginLeft: data.titleMarginLeft || '0px',
    marginRight: data.titleMarginRight || '0px',
    float: data.titleFloat && data.titleFloat !== 'none' ? data.titleFloat : 'none',
    display: data.titleDisplay || 'block',
    clear: data.titleFloat && data.titleFloat !== 'none' ? 'both' : 'none'
  };

  if (data.titleGradient) {
    titleStyles.background = data.titleGradient;
    titleStyles.WebkitBackgroundClip = 'text';
    titleStyles.WebkitTextFillColor = 'transparent';
    titleStyles.backgroundClip = 'text';
  }

  // Subtitle styles with individual positioning
  const subtitleStyles = {
    fontSize: data.subtitleSize || '20px',
    fontWeight: '400',
    margin: '0',
    opacity: 0.9,
    lineHeight: '1.5',
    textAlign: data.subtitleTextAlign || data.textAlign || 'center',
    marginTop: data.subtitleMarginTop || '0px',
    marginBottom: data.subtitleMarginBottom || '32px',
    marginLeft: data.subtitleMarginLeft || '0px',
    marginRight: data.subtitleMarginRight || '0px',
    float: data.subtitleFloat && data.subtitleFloat !== 'none' ? data.subtitleFloat : 'none',
    display: data.subtitleDisplay || 'block',
    clear: data.subtitleFloat && data.subtitleFloat !== 'none' ? 'both' : 'none'
  };

  // Button styles with hover effects
  const buttonStyles = data.showButton && data.ctaText ? 
    getButtonStyles({
      text: data.ctaText,
      color: data.buttonColor,
      textColor: data.buttonTextColor,
      size: data.buttonSize,
      style: data.buttonStyle,
      shadow: data.buttonShadow,
      gradient: data.buttonGradient,
      hoverColor: data.buttonHoverColor,
      hoverTextColor: data.buttonHoverTextColor,
      hoverGradient: data.buttonHoverGradient,
      paddingX: 32,
      paddingY: 16,
      fontSize: '18px',
      fontWeight: '600',
      radius: '12px'
    }, isButtonHovered) : null;

  return (
    <section style={containerStyles}>
      {overlayStyles && <div style={overlayStyles}></div>}
      
      <div style={contentStyles}>
        {data.title && (
          <h1 style={titleStyles}>
            {data.title}
          </h1>
        )}
        
        {/* Render content lines */}
        {(() => {
          const contentLines = data.contentLines || (data.subtitle ? [{ 
            id: '1', 
            text: data.subtitle, 
            type: 'subtitle',
            size: '20px',
            color: data.textColor || '#ffffff',
            backgroundColor: 'transparent',
            padding: '0px'
          }] : []);
          
          return contentLines.map((line, index) => {
            const lineStyles = {
              fontSize: line.size || '20px',
              fontWeight: line.type === 'heading' ? '600' : '400',
              margin: '0 0 16px 0',
              opacity: line.type === 'subtitle' ? 0.9 : 1,
              lineHeight: '1.5',
              textAlign: data.subtitleTextAlign || data.textAlign || 'center',
              marginTop: index === 0 ? (data.subtitleMarginTop || '0px') : '8px',
              marginBottom: index === contentLines.length - 1 ? (data.subtitleMarginBottom || '32px') : '8px',
              marginLeft: data.subtitleMarginLeft || '0px',
              marginRight: data.subtitleMarginRight || '0px',
              float: data.subtitleFloat && data.subtitleFloat !== 'none' ? data.subtitleFloat : 'none',
              display: data.subtitleDisplay || 'block',
              clear: data.subtitleFloat && data.subtitleFloat !== 'none' ? 'both' : 'none',
              // NEW: Apply line-specific styling
              color: line.color || data.textColor || '#ffffff',
              backgroundColor: line.backgroundColor && line.backgroundColor !== 'transparent' ? line.backgroundColor : 'transparent',
              padding: line.padding || '0px',
              borderRadius: line.backgroundColor && line.backgroundColor !== 'transparent' ? '4px' : '0px',
              width: 'fit-content',
              alignSelf: data.subtitleTextAlign === 'center' ? 'center' : 
                        data.subtitleTextAlign === 'right' ? 'flex-end' : 'flex-start'
            };

            if (line.type === 'heading') {
              return (
                <h2 key={line.id} style={lineStyles}>
                  {line.text}
                </h2>
              );
            } else {
              return (
                <p key={line.id} style={lineStyles}>
                  {line.text}
                </p>
              );
            }
          });
        })()}
        
        {data.showButton && data.ctaText && (
          <div style={{ marginTop: '32px' }}>
            <a
              href={data.ctaLink || '#'}
              style={buttonStyles}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onMouseDown={(e) => {
                if (data.buttonClickEffect === 'press') {
                  e.target.style.transform = 'translateY(2px) scale(0.98)';
                } else if (data.buttonClickEffect === 'scale') {
                  e.target.style.transform = 'scale(0.95)';
                }
              }}
              onMouseUp={(e) => {
                if (isButtonHovered) {
                  if (data.buttonHoverEffect === 'lift') {
                    e.target.style.transform = 'translateY(-2px)';
                  } else if (data.buttonHoverEffect === 'scale') {
                    e.target.style.transform = 'scale(1.05)';
                  }
                } else {
                  e.target.style.transform = 'translateY(0) scale(1)';
                }
              }}
            >
              {data.ctaText}
            </a>
          </div>
        )}

        {/* Additional Content Items */}
        {data.contentItems && data.contentItems.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            {data.contentItems.map((item) => (
              <div key={item.id} style={{
                textAlign: item.alignment || 'left',
                marginTop: item.marginTop || '16px',
                marginBottom: item.marginBottom || '16px',
                color: item.color || 'inherit'
              }}>
                {item.type === 'heading' && (
                  React.createElement(item.level || 'h2', {
                    style: {
                      fontSize: item.fontSize || '32px',
                      fontWeight: item.fontWeight || '600',
                      margin: 0,
                      color: item.color || 'inherit'
                    }
                  }, item.content || '')
                )}

                {item.type === 'paragraph' && (
                  <div
                    style={{
                      fontSize: item.fontSize || '16px',
                      fontWeight: item.fontWeight || '400',
                      lineHeight: '1.6',
                      color: item.color || 'inherit'
                    }}
                    dangerouslySetInnerHTML={{ __html: item.content || '' }}
                  />
                )}

                {item.type === 'image' && item.content && (
                  <div style={{ display: 'inline-block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.content}
                      alt={item.alt || 'Content image'}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}

                {item.type === 'quote' && (
                  <blockquote style={{
                    borderLeft: '4px solid rgba(255,255,255,0.3)',
                    paddingLeft: '20px',
                    margin: '20px 0',
                    fontStyle: 'italic',
                    fontSize: item.fontSize || '18px',
                    fontWeight: item.fontWeight || '400',
                    color: item.color || 'inherit',
                    opacity: 0.9
                  }}>
                    {item.content || ''}
                  </blockquote>
                )}

                {item.type === 'list' && item.content && (
                  React.createElement(item.listType === 'ordered' ? 'ol' : 'ul', {
                    style: {
                      paddingLeft: '20px',
                      fontSize: item.fontSize || '16px',
                      fontWeight: item.fontWeight || '400',
                      color: item.color || 'inherit'
                    }
                  }, item.content.split('\n').filter(line => line.trim()).map((line, index) => (
                    React.createElement('li', { key: index, style: { marginBottom: '8px' } }, line.trim())
                  )))
                )}

                {item.type === 'table' && item.content && (
                  (() => {
                    let tableData;
                    try {
                      tableData = JSON.parse(item.content);
                    } catch {
                      return null;
                    }

                    return (
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '20px 0',
                        fontSize: item.fontSize || '14px',
                        fontWeight: item.fontWeight || '400',
                        color: item.color || 'inherit'
                      }}>
                        <thead>
                          <tr>
                            {tableData.headers?.map((header, index) => (
                              <th key={index} style={{
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                textAlign: 'left',
                                fontWeight: '600'
                              }}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.rows?.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={{
                                  border: '1px solid rgba(255,255,255,0.3)',
                                  padding: '12px'
                                }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()
                )}

                {item.type === 'divider' && (
                  <hr style={{
                    border: 'none',
                    borderTop: `${item.thickness || '2px'} ${item.dividerStyle || 'solid'} rgba(255,255,255,0.3)`,
                    margin: '40px 0',
                    width: '100%'
                  }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}