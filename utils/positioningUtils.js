// Universal positioning utility for all blocks
export const getPositioningStyles = (data = {}) => {
  const styles = {};

  // Container Width
  let maxWidth = '1200px';
  switch (data.containerWidth) {
    case 'narrow':
      maxWidth = '600px';
      break;
    case 'normal':
      maxWidth = '1200px';
      break;
    case 'wide':
      maxWidth = '1400px';
      break;
    case 'full':
      maxWidth = '100%';
      break;
  }

  // Base container styles
  const containerStyles = {
    maxWidth: maxWidth,
    width: '100%',
    margin: '0 auto',
    paddingLeft: data.paddingX || '20px',
    paddingRight: data.paddingX || '20px',
    paddingTop: data.paddingY || '40px',
    paddingBottom: data.paddingY || '40px',
  };

  // Text alignment
  if (data.textAlign) {
    containerStyles.textAlign = data.textAlign;
  }

  // Container alignment  
  if (data.containerAlign) {
    switch (data.containerAlign) {
      case 'left':
        containerStyles.marginLeft = '0';
        containerStyles.marginRight = 'auto';
        break;
      case 'right':
        containerStyles.marginLeft = 'auto';
        containerStyles.marginRight = '0';
        break;
      case 'center':
        containerStyles.marginLeft = 'auto';
        containerStyles.marginRight = 'auto';
        break;
      case 'full':
        containerStyles.maxWidth = '100%';
        containerStyles.paddingLeft = '0';
        containerStyles.paddingRight = '0';
        break;
    }
  }

  // Spacing
  if (data.marginTop) containerStyles.marginTop = data.marginTop;
  if (data.marginBottom) containerStyles.marginBottom = data.marginBottom;

  // Horizontal Alignment (legacy support)
  if (data.horizontalAlign) {
    switch (data.horizontalAlign) {
      case 'left':
        containerStyles.marginLeft = '0';
        containerStyles.marginRight = 'auto';
        break;
      case 'right':
        containerStyles.marginLeft = 'auto';
        containerStyles.marginRight = '0';
        break;
      case 'center':
        containerStyles.marginLeft = 'auto';
        containerStyles.marginRight = 'auto';
        break;
      case 'stretch':
        containerStyles.width = '100%';
        containerStyles.maxWidth = '100%';
        break;
    }
  }

  // Display and Layout
  if (data.display) {
    containerStyles.display = data.display;
    
    if (data.display === 'flex') {
      if (data.flexDirection) containerStyles.flexDirection = data.flexDirection;
      if (data.justifyContent) containerStyles.justifyContent = data.justifyContent;
      if (data.alignItems) containerStyles.alignItems = data.alignItems;
    }
  }

  // Float
  if (data.float && data.float !== 'none') {
    containerStyles.float = data.float;
    if (data.float === 'left') {
      containerStyles.marginRight = '20px';
    } else if (data.float === 'right') {
      containerStyles.marginLeft = '20px';
    }
  }

  // Z-Index
  if (data.zIndex && data.zIndex !== 'auto') {
    containerStyles.zIndex = parseInt(data.zIndex);
    containerStyles.position = 'relative';
  }

  // Content alignment (text alignment)
  const contentStyles = {};
  if (data.contentAlign) {
    contentStyles.textAlign = data.contentAlign;
  }

  // Custom CSS
  let customStyles = {};
  if (data.customCSS) {
    try {
      // Parse custom CSS (basic parsing for demo)
      const cssRules = data.customCSS.split(';').filter(rule => rule.trim());
      cssRules.forEach(rule => {
        const [property, value] = rule.split(':').map(s => s.trim());
        if (property && value) {
          // Convert kebab-case to camelCase
          const camelProperty = property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
          customStyles[camelProperty] = value;
        }
      });
    } catch (e) {
      console.warn('Error parsing custom CSS:', e);
    }
  }

  return {
    container: { ...containerStyles, ...customStyles },
    content: contentStyles
  };
};

// Typography utility
export const getTypographyStyles = (data = {}) => {
  const styles = {};

  if (data.fontFamily && data.fontFamily !== 'inherit') styles.fontFamily = data.fontFamily;
  if (data.fontSize) styles.fontSize = data.fontSize;
  if (data.fontWeight) styles.fontWeight = data.fontWeight;
  if (data.lineHeight) styles.lineHeight = data.lineHeight;
  if (data.letterSpacing && data.letterSpacing !== 'normal') styles.letterSpacing = data.letterSpacing;
  if (data.textColor) styles.color = data.textColor;
  if (data.backgroundColor) styles.backgroundColor = data.backgroundColor;
  if (data.textShadow && data.textShadow !== 'none') styles.textShadow = data.textShadow;
  if (data.border && data.border !== 'none') styles.border = data.border;

  // Gradient text
  if (data.textGradient) {
    styles.background = data.textGradient;
    styles.WebkitBackgroundClip = 'text';
    styles.WebkitTextFillColor = 'transparent';
    styles.backgroundClip = 'text';
  }

  return styles;
};

// List styling utility
export const getListStyles = (data = {}) => {
  const styles = {};

  if (data.listStyle) styles.listStyleType = data.listStyle;
  if (data.listPosition) styles.listStylePosition = data.listPosition;
  if (data.listIndent) styles.paddingLeft = data.listIndent;

  return styles;
};

// Button styling utility with hover effects
export const getButtonStyles = (button = {}, isHover = false) => {
  const baseStyles = {
    display: 'inline-block',
    padding: `${button.paddingY || 12}px ${button.paddingX || 24}px`,
    fontSize: button.fontSize || '16px',
    fontWeight: button.fontWeight || '600',
    borderRadius: button.radius || '8px',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    transform: 'translateY(0)',
  };

  // Base button styles
  if (button.style === 'filled') {
    baseStyles.backgroundColor = button.color || '#3b82f6';
    baseStyles.color = button.textColor || '#ffffff';
    baseStyles.border = 'none';
  } else if (button.style === 'outline') {
    baseStyles.backgroundColor = 'transparent';
    baseStyles.color = button.color || '#3b82f6';
    baseStyles.border = `2px solid ${button.color || '#3b82f6'}`;
  } else if (button.style === 'ghost') {
    baseStyles.backgroundColor = 'transparent';
    baseStyles.color = button.color || '#3b82f6';
    baseStyles.border = 'none';
  }

  // Shadow
  if (button.shadow) {
    baseStyles.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  }

  // Hover effects
  if (isHover) {
    if (button.style === 'filled') {
      baseStyles.backgroundColor = button.hoverColor || '#2563eb';
      baseStyles.transform = 'translateY(-2px)';
      baseStyles.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else if (button.style === 'outline') {
      baseStyles.backgroundColor = button.color || '#3b82f6';
      baseStyles.color = button.textColor || '#ffffff';
      baseStyles.transform = 'translateY(-2px)';
    } else if (button.style === 'ghost') {
      baseStyles.backgroundColor = `${button.color || '#3b82f6'}20`;
      baseStyles.transform = 'translateY(-2px)';
    }
  }

  return baseStyles;
};
