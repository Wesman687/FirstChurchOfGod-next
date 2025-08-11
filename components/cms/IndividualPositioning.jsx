import React, { useState } from 'react';

const IndividualPositioning = ({ label, data = {}, fieldPrefix, updateData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sectionStyle = {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #e2e8f0'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#ffffff'
  };

  const toggleButtonStyle = {
    padding: '8px 16px',
    backgroundColor: isOpen ? '#3b82f6' : '#f3f4f6',
    color: isOpen ? 'white' : '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <div style={{marginBottom: '12px'}}>
      <button
        style={toggleButtonStyle}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>📍 {label} Positioning</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>
      
      {isOpen && (
        <div style={sectionStyle}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
            <div>
              <label style={labelStyle}>Text Alignment</label>
              <select
                value={data[`${fieldPrefix}TextAlign`] || 'inherit'}
                onChange={(e) => updateData(`${fieldPrefix}TextAlign`, e.target.value)}
                style={inputStyle}
              >
                <option value="inherit">Inherit</option>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Vertical Position</label>
              <select
                value={data[`${fieldPrefix}VerticalAlign`] || 'inherit'}
                onChange={(e) => updateData(`${fieldPrefix}VerticalAlign`, e.target.value)}
                style={inputStyle}
              >
                <option value="inherit">Inherit</option>
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
            <div>
              <label style={labelStyle}>Margin Top</label>
              <select
                value={data[`${fieldPrefix}MarginTop`] || '0px'}
                onChange={(e) => updateData(`${fieldPrefix}MarginTop`, e.target.value)}
                style={inputStyle}
              >
                <option value="0px">None</option>
                <option value="8px">XS (8px)</option>
                <option value="16px">SM (16px)</option>
                <option value="24px">MD (24px)</option>
                <option value="32px">LG (32px)</option>
                <option value="48px">XL (48px)</option>
                <option value="64px">2XL (64px)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Margin Bottom</label>
              <select
                value={data[`${fieldPrefix}MarginBottom`] || '16px'}
                onChange={(e) => updateData(`${fieldPrefix}MarginBottom`, e.target.value)}
                style={inputStyle}
              >
                <option value="0px">None</option>
                <option value="8px">XS (8px)</option>
                <option value="16px">SM (16px)</option>
                <option value="24px">MD (24px)</option>
                <option value="32px">LG (32px)</option>
                <option value="48px">XL (48px)</option>
                <option value="64px">2XL (64px)</option>
              </select>
            </div>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <div>
              <label style={labelStyle}>Float Position</label>
              <select
                value={data[`${fieldPrefix}Float`] || 'none'}
                onChange={(e) => updateData(`${fieldPrefix}Float`, e.target.value)}
                style={inputStyle}
              >
                <option value="none">None</option>
                <option value="left">Float Left</option>
                <option value="right">Float Right</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Display</label>
              <select
                value={data[`${fieldPrefix}Display`] || 'block'}
                onChange={(e) => updateData(`${fieldPrefix}Display`, e.target.value)}
                style={inputStyle}
              >
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="none">Hidden</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualPositioning;
