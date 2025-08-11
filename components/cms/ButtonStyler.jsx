import React, { useState } from 'react';

const ButtonStyler = ({ 
  buttonData = {}, 
  onChange, 
  label = "Button Settings",
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('normal');

  const defaultButton = {
    text: 'Click Me',
    url: '#',
    openInNewTab: false,
    styles: {
      normal: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '500',
        fontFamily: 'inherit',
        textDecoration: 'none',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundImage: '',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transform: 'scale(1)'
      },
      hover: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        backgroundImage: '',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        transform: 'scale(1.02) translateY(-1px)'
      },
      active: {
        backgroundColor: '#1d4ed8',
        color: '#ffffff',
        backgroundImage: '',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        transform: 'scale(0.98)'
      }
    }
  };

  const currentButton = { ...defaultButton, ...buttonData };

  const updateButtonData = (updates) => {
    const updated = { ...currentButton, ...updates };
    onChange?.(updated);
  };

  const updateStyle = (state, property, value) => {
    const updatedStyles = {
      ...currentButton.styles,
      [state]: {
        ...currentButton.styles[state],
        [property]: value
      }
    };
    updateButtonData({ styles: updatedStyles });
  };

  const gradientPresets = [
    { name: 'Blue', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Purple', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Green', gradient: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'Orange', gradient: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
    { name: 'Pink', gradient: 'linear-gradient(120deg, #ffecd2 0%, #fcb69f 100%)' },
    { name: 'Sunset', gradient: 'linear-gradient(120deg, #ff9a9e 0%, #fecfef 100%)' }
  ];

  const fontOptions = [
    'inherit', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 
    'Verdana', 'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS',
    'Montserrat', 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro'
  ];

  const renderStyleInputs = (state) => {
    const styles = currentButton.styles[state];
    
    return (
      <div className="style-inputs">
        {/* Background */}
        <div className="input-group">
          <label>Background</label>
          <div className="background-controls">
            <input
              type="color"
              value={styles.backgroundColor || '#3b82f6'}
              onChange={(e) => updateStyle(state, 'backgroundColor', e.target.value)}
              className="color-input"
            />
            <input
              type="text"
              placeholder="Or use gradient/image..."
              value={styles.backgroundImage || ''}
              onChange={(e) => updateStyle(state, 'backgroundImage', e.target.value)}
              className="gradient-input"
            />
          </div>
          
          {/* Gradient Presets */}
          <div className="gradient-presets">
            {gradientPresets.map((preset, index) => (
              <div
                key={index}
                className="gradient-preset"
                style={{ backgroundImage: preset.gradient }}
                onClick={() => updateStyle(state, 'backgroundImage', preset.gradient)}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div className="input-group">
          <label>Text Color</label>
          <input
            type="color"
            value={styles.color || '#ffffff'}
            onChange={(e) => updateStyle(state, 'color', e.target.value)}
            className="color-input"
          />
        </div>

        {/* Typography */}
        <div className="input-row">
          <div className="input-group">
            <label>Font Size</label>
            <input
              type="number"
              value={parseInt(styles.fontSize) || 16}
              onChange={(e) => updateStyle(state, 'fontSize', `${e.target.value}px`)}
              className="number-input"
              min="8"
              max="48"
            />
          </div>
          <div className="input-group">
            <label>Font Weight</label>
            <select
              value={styles.fontWeight || '500'}
              onChange={(e) => updateStyle(state, 'fontWeight', e.target.value)}
              className="select-input"
            >
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Font Family</label>
          <select
            value={styles.fontFamily || 'inherit'}
            onChange={(e) => updateStyle(state, 'fontFamily', e.target.value)}
            className="select-input"
          >
            {fontOptions.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {/* Spacing */}
        <div className="input-group">
          <label>Padding</label>
          <input
            type="text"
            value={styles.padding || '12px 24px'}
            onChange={(e) => updateStyle(state, 'padding', e.target.value)}
            placeholder="12px 24px"
            className="text-input"
          />
        </div>

        {/* Border */}
        <div className="input-row">
          <div className="input-group">
            <label>Border Radius</label>
            <input
              type="number"
              value={parseInt(styles.borderRadius) || 6}
              onChange={(e) => updateStyle(state, 'borderRadius', `${e.target.value}px`)}
              className="number-input"
              min="0"
              max="50"
            />
          </div>
          <div className="input-group">
            <label>Border</label>
            <input
              type="text"
              value={styles.border || 'none'}
              onChange={(e) => updateStyle(state, 'border', e.target.value)}
              placeholder="1px solid #ccc"
              className="text-input"
            />
          </div>
        </div>

        {/* Effects */}
        <div className="input-group">
          <label>Box Shadow</label>
          <input
            type="text"
            value={styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)'}
            onChange={(e) => updateStyle(state, 'boxShadow', e.target.value)}
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
            className="text-input"
          />
        </div>

        <div className="input-group">
          <label>Transform</label>
          <input
            type="text"
            value={styles.transform || 'scale(1)'}
            onChange={(e) => updateStyle(state, 'transform', e.target.value)}
            placeholder="scale(1.05) translateY(-2px)"
            className="text-input"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`button-styler ${className}`}>
      <style jsx>{`
        .button-styler {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          max-width: 500px;
        }
        
        .button-preview {
          margin-bottom: 20px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 6px;
          text-align: center;
        }
        
        .preview-button {
          transition: all 0.3s ease !important;
        }
        
        .preview-button:hover {
          background-color: var(--hover-bg) !important;
          color: var(--hover-color) !important;
          background-image: var(--hover-bg-image) !important;
          box-shadow: var(--hover-shadow) !important;
          transform: var(--hover-transform) !important;
        }
        
        .preview-button:active {
          background-color: var(--active-bg) !important;
          color: var(--active-color) !important;
          background-image: var(--active-bg-image) !important;
          box-shadow: var(--active-shadow) !important;
          transform: var(--active-transform) !important;
        }
        
        .button-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .content-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .input-row {
          display: flex;
          gap: 12px;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        
        .input-group label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }
        
        .background-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .color-input {
          width: 40px;
          height: 32px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .gradient-input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .gradient-presets {
          display: flex;
          gap: 4px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        
        .gradient-preset {
          width: 30px;
          height: 20px;
          border-radius: 3px;
          cursor: pointer;
          border: 2px solid transparent;
        }
        
        .gradient-preset:hover {
          border-color: #3b82f6;
        }
        
        .text-input, .number-input, .select-input {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .number-input {
          width: 70px;
        }
        
        .style-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 16px;
        }
        
        .tab-button {
          padding: 8px 16px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }
        
        .tab-button.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }
        
        .style-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }
      `}</style>

      <div className="section-title">{label}</div>

      {/* Button Preview */}
      <div className="button-preview">
        <a
          href={currentButton.url}
          className="preview-button"
          style={{
            ...currentButton.styles.normal,
            '--hover-bg': currentButton.styles.hover.backgroundColor,
            '--hover-color': currentButton.styles.hover.color,
            '--hover-bg-image': currentButton.styles.hover.backgroundImage,
            '--hover-shadow': currentButton.styles.hover.boxShadow,
            '--hover-transform': currentButton.styles.hover.transform,
            '--active-bg': currentButton.styles.active.backgroundColor,
            '--active-color': currentButton.styles.active.color,
            '--active-bg-image': currentButton.styles.active.backgroundImage,
            '--active-shadow': currentButton.styles.active.boxShadow,
            '--active-transform': currentButton.styles.active.transform,
          }}
          onClick={(e) => e.preventDefault()}
        >
          {currentButton.text}
        </a>
      </div>

      <div className="button-content">
        {/* Button Content */}
        <div className="content-inputs">
          <div className="input-group">
            <label>Button Text</label>
            <input
              type="text"
              value={currentButton.text}
              onChange={(e) => updateButtonData({ text: e.target.value })}
              className="text-input"
            />
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <label>URL</label>
              <input
                type="text"
                value={currentButton.url}
                onChange={(e) => updateButtonData({ url: e.target.value })}
                placeholder="https://example.com"
                className="text-input"
              />
            </div>
            <div className="input-group">
              <label style={{ marginBottom: '10px' }}>Open in new tab</label>
              <input
                type="checkbox"
                checked={currentButton.openInNewTab}
                onChange={(e) => updateButtonData({ openInNewTab: e.target.checked })}
              />
            </div>
          </div>
        </div>

        {/* Style Tabs */}
        <div className="style-tabs">
          <button
            className={`tab-button ${activeTab === 'normal' ? 'active' : ''}`}
            onClick={() => setActiveTab('normal')}
          >
            Normal
          </button>
          <button
            className={`tab-button ${activeTab === 'hover' ? 'active' : ''}`}
            onClick={() => setActiveTab('hover')}
          >
            Hover
          </button>
          <button
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Click
          </button>
        </div>

        {/* Style Inputs */}
        {renderStyleInputs(activeTab)}
      </div>
    </div>
  );
};

export default ButtonStyler;
