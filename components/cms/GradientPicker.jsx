import React, { useState, useEffect } from 'react';

const GradientPicker = ({ value = '', onChange, className = '' }) => {
  const [gradientType, setGradientType] = useState('linear');
  const [direction, setDirection] = useState('to right');
  const [colorStops, setColorStops] = useState([
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 }
  ]);

  // Initialize from value prop
  useEffect(() => {
    if (value && value !== generateGradient()) {
      // Parse existing gradient if different from current
      try {
        if (value.includes('radial-gradient')) {
          setGradientType('radial');
        } else {
          setGradientType('linear');
        }
      } catch (e) {
        // If parsing fails, keep current state
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to prevent infinite loops

  // Preset gradients
  const presets = [
    { name: 'Sunset', gradient: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb)' },
    { name: 'Ocean', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { name: 'Forest', gradient: 'linear-gradient(120deg, #a8edea, #fed6e3)' },
    { name: 'Fire', gradient: 'linear-gradient(45deg, #ff9a9e, #fecfef)' },
    { name: 'Sky', gradient: 'linear-gradient(135deg, #74b9ff, #0984e3)' },
    { name: 'Purple', gradient: 'linear-gradient(45deg, #a29bfe, #6c5ce7)' },
    { name: 'Pink', gradient: 'linear-gradient(135deg, #fd79a8, #e84393)' },
    { name: 'Green', gradient: 'linear-gradient(120deg, #00b894, #00cec9)' }
  ];

  const directions = [
    { label: 'Right', value: 'to right' },
    { label: 'Left', value: 'to left' },
    { label: 'Bottom', value: 'to bottom' },
    { label: 'Top', value: 'to top' },
    { label: 'Bottom Right', value: 'to bottom right' },
    { label: 'Bottom Left', value: 'to bottom left' },
    { label: 'Top Right', value: 'to top right' },
    { label: 'Top Left', value: 'to top left' }
  ];

  // Trigger onChange when relevant values change
  useEffect(() => {
    if (onChange) {
      const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
      const stopStrings = sortedStops.map(stop => `${stop.color} ${stop.position}%`);
      
      let gradient;
      if (gradientType === 'radial') {
        gradient = `radial-gradient(circle, ${stopStrings.join(', ')})`;
      } else {
        gradient = `linear-gradient(${direction}, ${stopStrings.join(', ')})`;
      }
      
      onChange(gradient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorStops, gradientType, direction]); // Removed onChange from dependencies to prevent infinite loop

  const generateGradient = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map(stop => `${stop.color} ${stop.position}%`);
    
    if (gradientType === 'radial') {
      return `radial-gradient(circle, ${stopStrings.join(', ')})`;
    }
    return `linear-gradient(${direction}, ${stopStrings.join(', ')})`;
  };

  const addColorStop = () => {
    const newPosition = colorStops.length > 0 ? 
      Math.max(...colorStops.map(s => s.position)) + 20 : 50;
    setColorStops([...colorStops, { color: '#ffffff', position: Math.min(newPosition, 100) }]);
  };

  const removeColorStop = (index) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  };

  const updateColorStop = (index, field, value) => {
    const updated = [...colorStops];
    updated[index][field] = value;
    setColorStops(updated);
  };

  const applyPreset = (preset) => {
    // Update parent component
    if (onChange) {
      onChange(preset.gradient);
    }
    
    // Update internal state to match the preset for preview
    try {
      if (preset.gradient.includes('radial-gradient')) {
        setGradientType('radial');
      } else {
        setGradientType('linear');
        // Extract direction if it's a linear gradient
        const directionMatch = preset.gradient.match(/linear-gradient\(([^,]+),/);
        if (directionMatch) {
          const extractedDirection = directionMatch[1].trim();
          if (extractedDirection.startsWith('to ') || extractedDirection.includes('deg')) {
            setDirection(extractedDirection);
          }
        }
      }
      
      // Extract colors from preset gradient
      const colorMatches = preset.gradient.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g);
      if (colorMatches && colorMatches.length >= 2) {
        const newColorStops = colorMatches.map((color, index) => ({
          color: color,
          position: index === 0 ? 0 : index === colorMatches.length - 1 ? 100 : (100 / (colorMatches.length - 1)) * index
        }));
        setColorStops(newColorStops);
      }
    } catch (e) {
      console.warn('Could not parse preset gradient:', e);
    }
  };

  return (
    <div className={`gradient-picker ${className}`}>
      <style jsx>{`
        .gradient-picker {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          width: 100%;
          max-width: 400px;
        }
        
        .gradient-preview {
          width: 100%;
          height: 80px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          margin-bottom: 16px;
          position: relative;
          background-image: linear-gradient(45deg, #f1f5f9 25%, transparent 25%), 
                            linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #f1f5f9 75%), 
                            linear-gradient(-45deg, transparent 75%, #f1f5f9 75%);
          background-size: 12px 12px;
          background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
        }
        
        .gradient-overlay {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
        
        .gradient-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .control-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .gradient-type-buttons {
          display: flex;
          gap: 4px;
        }
        
        .type-button {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          background: white;
          color: #3b82f6;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .type-button:hover {
          border-color: #3b82f6;
          background: #f0f7ff;
        }
        
        .type-button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .direction-select {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
          flex: 1;
        }
        
        .color-stops {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .color-stop {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 4px;
        }
        
        .color-input {
          width: 40px;
          height: 30px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .position-input {
          width: 60px;
          padding: 4px 6px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .remove-stop {
          width: 24px;
          height: 24px;
          border: none;
          background: #ef4444;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .add-stop-btn {
          padding: 6px 12px;
          border: 1px solid #3b82f6;
          background: white;
          color: #3b82f6;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .add-stop-btn:hover {
          background: #3b82f6;
          color: white;
        }
        
        .presets {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 12px;
        }
        
        .preset {
          height: 30px;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }
        
        .preset:hover {
          border-color: #3b82f6;
        }
        
        .preset-label {
          font-size: 10px;
          text-align: center;
          margin-top: 2px;
          color: #6b7280;
        }
        
        .label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }
      `}</style>

      {/* Preview */}
      <div className="gradient-preview">
        <div 
          className="gradient-overlay"
          style={{ backgroundImage: generateGradient() }}
        />
      </div>

      <div className="gradient-controls">
        {/* Type Selection */}
        <div className="control-group">
          <label className="label">Type</label>
          <div className="gradient-type-buttons">
            <button
              className={`type-button ${gradientType === 'linear' ? 'active' : ''}`}
              onClick={() => setGradientType('linear')}
            >
              Linear
            </button>
            <button
              className={`type-button ${gradientType === 'radial' ? 'active' : ''}`}
              onClick={() => setGradientType('radial')}
            >
              Radial
            </button>
          </div>
        </div>

        {/* Direction (only for linear) */}
        {gradientType === 'linear' && (
          <div className="control-group">
            <label className="label">Direction</label>
            <select 
              className="direction-select"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              {directions.map(dir => (
                <option key={dir.value} value={dir.value}>
                  {dir.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Color Stops */}
        <div className="control-group">
          <label className="label">Colors</label>
          <div className="color-stops">
            {colorStops.map((stop, index) => (
              <div key={index} className="color-stop">
                <input
                  type="color"
                  className="color-input"
                  value={stop.color}
                  onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                />
                <input
                  type="number"
                  className="position-input"
                  value={stop.position}
                  min="0"
                  max="100"
                  onChange={(e) => updateColorStop(index, 'position', parseInt(e.target.value))}
                />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>%</span>
                {colorStops.length > 2 && (
                  <button
                    className="remove-stop"
                    onClick={() => removeColorStop(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="add-stop-btn" onClick={addColorStop}>
            + Add Color
          </button>
        </div>

        {/* Presets */}
        <div className="control-group">
          <label className="label">Presets</label>
          <div className="presets">
            {presets.map((preset, index) => (
              <div key={index}>
                <div
                  className="preset"
                  style={{ backgroundImage: preset.gradient }}
                  onClick={() => applyPreset(preset)}
                  title={preset.name}
                />
                <div className="preset-label">{preset.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientPicker;
