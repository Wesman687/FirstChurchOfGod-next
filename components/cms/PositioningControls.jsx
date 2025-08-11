import React from 'react';

const PositioningControls = ({ data = {}, updateData }) => {
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

  return (
    <div style={sectionStyle}>
      <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
        📍 Layout & Positioning
      </h4>
      
      {/* Container Width */}
      <div style={{marginBottom: '16px'}}>
        <label style={labelStyle}>Container Width</label>
        <select
          value={data.containerWidth || 'normal'}
          onChange={(e) => updateData('containerWidth', e.target.value)}
          style={inputStyle}
        >
          <option value="narrow">Narrow (600px)</option>
          <option value="normal">Normal (1200px)</option>
          <option value="wide">Wide (1400px)</option>
          <option value="full">Full Width</option>
        </select>
      </div>

      {/* Horizontal Alignment */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
        <div>
          <label style={labelStyle}>Horizontal Alignment</label>
          <select
            value={data.horizontalAlign || 'center'}
            onChange={(e) => updateData('horizontalAlign', e.target.value)}
            style={inputStyle}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Vertical Alignment</label>
          <select
            value={data.verticalAlign || 'top'}
            onChange={(e) => updateData('verticalAlign', e.target.value)}
            style={inputStyle}
          >
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>

      {/* Content Alignment */}
      <div style={{marginBottom: '16px'}}>
        <label style={labelStyle}>Content Text Alignment</label>
        <select
          value={data.contentAlign || 'left'}
          onChange={(e) => updateData('contentAlign', e.target.value)}
          style={inputStyle}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>

      {/* Spacing Controls */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '16px'}}>
        <div>
          <label style={labelStyle}>Margin Top</label>
          <select
            value={data.marginTop || '0'}
            onChange={(e) => updateData('marginTop', e.target.value)}
            style={inputStyle}
          >
            <option value="0">None</option>
            <option value="20px">Small</option>
            <option value="40px">Medium</option>
            <option value="60px">Large</option>
            <option value="80px">XL</option>
            <option value="120px">XXL</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Margin Bottom</label>
          <select
            value={data.marginBottom || '0'}
            onChange={(e) => updateData('marginBottom', e.target.value)}
            style={inputStyle}
          >
            <option value="0">None</option>
            <option value="20px">Small</option>
            <option value="40px">Medium</option>
            <option value="60px">Large</option>
            <option value="80px">XL</option>
            <option value="120px">XXL</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Padding X</label>
          <select
            value={data.paddingX || '20px'}
            onChange={(e) => updateData('paddingX', e.target.value)}
            style={inputStyle}
          >
            <option value="0">None</option>
            <option value="10px">Small</option>
            <option value="20px">Medium</option>
            <option value="40px">Large</option>
            <option value="60px">XL</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Padding Y</label>
          <select
            value={data.paddingY || '40px'}
            onChange={(e) => updateData('paddingY', e.target.value)}
            style={inputStyle}
          >
            <option value="0">None</option>
            <option value="20px">Small</option>
            <option value="40px">Medium</option>
            <option value="60px">Large</option>
            <option value="80px">XL</option>
            <option value="120px">XXL</option>
          </select>
        </div>
      </div>

      {/* Advanced Positioning */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
        <div>
          <label style={labelStyle}>Float</label>
          <select
            value={data.float || 'none'}
            onChange={(e) => updateData('float', e.target.value)}
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
            value={data.display || 'block'}
            onChange={(e) => updateData('display', e.target.value)}
            style={inputStyle}
          >
            <option value="block">Block</option>
            <option value="inline-block">Inline Block</option>
            <option value="flex">Flex</option>
            <option value="inline">Inline</option>
          </select>
        </div>
      </div>

      {/* Flex Controls (when display is flex) */}
      {data.display === 'flex' && (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>
          <div>
            <label style={labelStyle}>Flex Direction</label>
            <select
              value={data.flexDirection || 'row'}
              onChange={(e) => updateData('flexDirection', e.target.value)}
              style={inputStyle}
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
              <option value="row-reverse">Row Reverse</option>
              <option value="column-reverse">Column Reverse</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Justify Content</label>
            <select
              value={data.justifyContent || 'flex-start'}
              onChange={(e) => updateData('justifyContent', e.target.value)}
              style={inputStyle}
            >
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Align Items</label>
            <select
              value={data.alignItems || 'flex-start'}
              onChange={(e) => updateData('alignItems', e.target.value)}
              style={inputStyle}
            >
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="stretch">Stretch</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>
        </div>
      )}

      {/* Z-Index */}
      <div style={{marginBottom: '16px'}}>
        <label style={labelStyle}>Layer Order (Z-Index)</label>
        <select
          value={data.zIndex || 'auto'}
          onChange={(e) => updateData('zIndex', e.target.value)}
          style={inputStyle}
        >
          <option value="auto">Auto</option>
          <option value="1">Above (1)</option>
          <option value="10">Higher (10)</option>
          <option value="100">Top (100)</option>
          <option value="1000">Max (1000)</option>
        </select>
      </div>

      {/* Custom CSS */}
      <div style={{marginBottom: '0'}}>
        <label style={labelStyle}>Custom CSS (Advanced)</label>
        <textarea
          value={data.customCSS || ''}
          onChange={(e) => updateData('customCSS', e.target.value)}
          placeholder="/* Custom CSS rules */&#10;border: 2px solid #blue;&#10;transform: rotate(5deg);"
          rows={3}
          style={{...inputStyle, fontFamily: 'monospace', fontSize: '12px'}}
        />
      </div>
    </div>
  );
};

export default PositioningControls;
