export function RichTextBlock({ data = {} }) {
  // Apply typography and styling from data
  const containerStyles = {
    fontFamily: data.fontFamily || 'inherit',
    fontSize: data.fontSize || '16px',
    lineHeight: data.lineHeight || '1.6',
    fontWeight: data.fontWeight || '400',
    letterSpacing: data.letterSpacing || 'normal',
    textAlign: data.textAlign || 'left',
    color: data.textColor || '#000000',
    backgroundColor: data.backgroundColor || 'transparent',
    textShadow: data.textShadow || 'none',
    border: data.border || 'none',
    minHeight: data.minHeight || 'auto',
    padding: '0',
    margin: '0'
  };

  // Handle text gradient
  if (data.textGradient) {
    containerStyles.background = data.textGradient;
    containerStyles.WebkitBackgroundClip = 'text';
    containerStyles.WebkitTextFillColor = 'transparent';
    containerStyles.backgroundClip = 'text';
  }

  // Handle container alignment
  const wrapperStyles = {
    display: 'flex',
    justifyContent: data.containerAlign === 'center' ? 'center' : 
                   data.containerAlign === 'right' ? 'flex-end' : 'flex-start',
    width: '100%'
  };

  const contentWrapperStyles = {
    width: data.containerAlign === 'full' ? '100%' : 'auto',
    maxWidth: data.containerAlign === 'full' ? '100%' : '100%'
  };

  // Process content - handle both simple HTML and advanced code
  const processedContent = data.content || '';

  return (
    <section style={wrapperStyles}>
      <div style={contentWrapperStyles}>
        <div 
          style={containerStyles}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        
        {/* Render buttons if they exist */}
        {data.buttons && data.buttons.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: data.buttonAlignment || 'flex-start',
            marginTop: '24px',
            flexWrap: 'wrap'
          }}>
            {data.buttons.map((button, index) => (
              <button
                key={index}
                style={{
                  padding: `${button.paddingY || 12}px ${button.paddingX || 24}px`,
                  fontSize: button.fontSize || '16px',
                  fontWeight: button.fontWeight || '600',
                  borderRadius: button.radius || '8px',
                  backgroundColor: button.style === 'outline' ? 'transparent' : (button.color || '#3b82f6'),
                  color: button.style === 'outline' ? (button.color || '#3b82f6') : (button.textColor || '#ffffff'),
                  border: button.style === 'outline' ? `2px solid ${button.color || '#3b82f6'}` : 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  boxShadow: button.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (button.style === 'outline') {
                    e.target.style.backgroundColor = button.color || '#3b82f6';
                    e.target.style.color = button.textColor || '#ffffff';
                  } else {
                    e.target.style.backgroundColor = button.hoverColor || '#2563eb';
                  }
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  if (button.style === 'outline') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = button.color || '#3b82f6';
                  } else {
                    e.target.style.backgroundColor = button.color || '#3b82f6';
                  }
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = button.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none';
                }}
              >
                {button.text || 'Button'}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
