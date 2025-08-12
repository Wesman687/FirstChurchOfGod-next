import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import GradientPicker from '../../../components/cms/GradientPicker';
import ButtonStyler from '../../../components/cms/ButtonStyler';
import ImageSelector from '../../../components/cms/ImageSelector';
import AIAssistant from '../../../components/cms/AIAssistant';
import TemplateLibrary from '../../../components/cms/TemplateLibrary';
import AnalyticsDashboard from '../../../components/cms/AnalyticsDashboard';
import FormBuilderAdvanced from '../../../components/cms/FormBuilderAdvanced';
import UserManagement from '../../../components/cms/UserManagement';
import RichTextControls from '../../../components/cms/RichTextControls';
import ContentBuilder from '../../../components/cms/ContentBuilder';
import IndividualPositioning from '../../../components/cms/IndividualPositioning';
import Layout from '../../../components/Layout';

// Import all block components
import {
  HeroBlock,
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  VideoBlock,
  FormBlock,
  SpacerBlock,
  DividerBlock
} from '../../../components/blocks';
import { ContentBlock } from '../../../components/blocks/ContentBlock';

// Sortable Block Wrapper
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableBlock({ block, onUpdate, onDelete, isPreview = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: isPreview });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderBlock = () => {
    if (isPreview) {
      return renderPreviewBlock();
    }
    return renderEditableBlock();
  };

  const renderPreviewBlock = () => {
    const blockProps = { ...block.data };

    switch (block.type) {
      case 'hero':
        const getHeroBackground = () => {
          let background = '';
          
          if (block.data.backgroundType === 'gradient') {
            background = block.data.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          } else if (block.data.backgroundType === 'image' && block.data.backgroundImage) {
            const overlay = block.data.backgroundOverlay ? `linear-gradient(rgba(0,0,0,${block.data.overlayOpacity || 0.4}), rgba(0,0,0,${block.data.overlayOpacity || 0.4})), ` : '';
            background = `${overlay}url(${block.data.backgroundImage})`;
          } else {
            background = block.data.backgroundColor || '#3b82f6';
          }
          
          return background;
        };

        return (
          <div style={{
            background: getHeroBackground(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: block.data.height || '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: block.data.textColor || 'white',
            textAlign: block.data.textAlign || 'center',
            padding: block.data.padding || '60px 20px'
          }}>
            <div style={{maxWidth: '800px', width: '100%'}}>
              <h1 style={{
                fontSize: block.data.titleSize || '48px',
                fontWeight: block.data.titleWeight || 'bold',
                marginBottom: '16px',
                fontFamily: block.data.fontFamily || 'inherit',
                background: block.data.titleGradient ? block.data.titleGradient : 'none',
                WebkitBackgroundClip: block.data.titleGradient ? 'text' : 'initial',
                WebkitTextFillColor: block.data.titleGradient ? 'transparent' : 'inherit',
                lineHeight: '1.2'
              }}>
                {block.data.title || 'Welcome'}
              </h1>
              {block.data.subtitle && (
                <p style={{
                  fontSize: block.data.subtitleSize || '20px',
                  marginBottom: '32px',
                  opacity: 0.9,
                  fontFamily: block.data.fontFamily || 'inherit',
                  lineHeight: '1.5'
                }}>
                  {block.data.subtitle}
                </p>
              )}
              {block.data.showButton && block.data.ctaText && (
                <button style={{
                  backgroundColor: block.data.buttonColor || '#3b82f6',
                  color: block.data.buttonTextColor || 'white',
                  padding: '16px 32px',
                  borderRadius: block.data.buttonRadius || '8px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {block.data.ctaText}
                </button>
              )}
            </div>
          </div>
        );

      case 'richText':
        return (
          <div style={{
            padding: block.data.padding || '20px',
            backgroundColor: block.data.backgroundColor || 'transparent',
            color: block.data.textColor || 'inherit',
            textAlign: block.data.textAlign || 'left',
            fontFamily: block.data.fontFamily || 'inherit',
            fontSize: block.data.fontSize || '16px',
            lineHeight: block.data.lineHeight || '1.6',
            background: block.data.textGradient ? block.data.textGradient : block.data.backgroundColor || 'transparent',
            WebkitBackgroundClip: block.data.textGradient ? 'text' : 'initial',
            WebkitTextFillColor: block.data.textGradient ? 'transparent' : 'inherit'
          }}>
            <div dangerouslySetInnerHTML={{ __html: block.data.content || '<p>Your content here...</p>' }} />
            
            {/* Render Buttons */}
            {block.data.buttons && block.data.buttons.length > 0 && (
              <div style={{
                marginTop: '24px',
                display: 'flex',
                gap: '12px',
                justifyContent: block.data.buttonAlignment || 'flex-start',
                flexWrap: 'wrap'
              }}>
                {block.data.buttons.map((button, index) => (
                  <button
                    key={index}
                    style={{
                      backgroundColor: button.color || '#3b82f6',
                      color: button.textColor || 'white',
                      padding: `${button.paddingY || 12}px ${button.paddingX || 24}px`,
                      borderRadius: button.radius || '8px',
                      border: button.style === 'outline' ? `2px solid ${button.color || '#3b82f6'}` : 'none',
                      fontSize: button.fontSize || '16px',
                      fontWeight: button.fontWeight || '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: button.shadow ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      background: button.style === 'outline' ? 'transparent' : (button.gradient || button.color || '#3b82f6')
                    }}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div style={{
            textAlign: block.data.alignment || 'center',
            padding: block.data.padding || '20px',
            backgroundColor: block.data.backgroundColor || 'transparent'
          }}>
            {block.data.src ? (
              <img
                src={block.data.src}
                alt={block.data.alt || ''}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: block.data.borderRadius || '0px',
                  border: block.data.border || 'none'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                borderRadius: block.data.borderRadius || '0px'
              }}>
                No image selected
              </div>
            )}
            {block.data.caption && (
              <p style={{
                marginTop: '8px',
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                {block.data.caption}
              </p>
            )}
          </div>
        );

      case 'spacer':
        const getSpacerBackground = () => {
          if (block.data.backgroundType === 'gradient') {
            return block.data.backgroundGradient || 'transparent';
          }
          return block.data.backgroundColor || 'transparent';
        };

        return (
          <div style={{
            height: block.data.height || 50,
            background: getSpacerBackground(),
            borderRadius: block.data.borderRadius || '0px',
            margin: `${block.data.marginTop || 0}px 0 ${block.data.marginBottom || 0}px 0`,
            border: block.data.showBorder ? `${block.data.borderWidth || 1}px ${block.data.borderStyle || 'solid'} ${block.data.borderColor || '#e5e7eb'}` : 'none',
            boxShadow: block.data.showShadow ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
          }} />
        );

      case 'divider':
        return (
          <div style={{
            padding: block.data.padding || '20px 0',
            textAlign: 'center'
          }}>
            <hr style={{
              border: 'none',
              height: block.data.thickness || '2px',
              background: block.data.gradient || block.data.color || '#e5e7eb',
              borderRadius: block.data.borderRadius || '0px',
              width: block.data.width || '100%',
              margin: '0 auto',
              boxShadow: block.data.showShadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }} />
          </div>
        );

      case 'columns':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${block.data.columns || 2}, 1fr)`,
            gap: block.data.gap || '24px',
            padding: block.data.padding || '20px',
            backgroundColor: block.data.backgroundColor || 'transparent'
          }}>
            {(block.data.columnContent || [{}, {}]).map((column, index) => (
              <div key={index} style={{
                padding: column.padding || '16px',
                backgroundColor: column.backgroundColor || 'transparent',
                borderRadius: column.borderRadius || '8px',
                border: column.showBorder ? `1px solid ${column.borderColor || '#e5e7eb'}` : 'none'
              }}>
                {column.type === 'text' && (
                  <div dangerouslySetInnerHTML={{ __html: column.content || `<p>Column ${index + 1} content</p>` }} />
                )}
                {column.type === 'image' && column.src && (
                  <img src={column.src} alt={column.alt || ''} style={{width: '100%', height: 'auto', borderRadius: '4px'}} />
                )}
              </div>
            ))}
          </div>
        );

      case 'content':
        return <ContentBlock data={block.data} />;

      default:
        return <div style={{padding: '20px', textAlign: 'center', color: '#6b7280'}}>Preview for {block.type} block</div>;
    }
  };

  const renderEditableBlock = () => {
    const updateData = (field, value) => {
      onUpdate(block.id, { ...block.data, [field]: value });
    };

    const inputStyle = {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.2s',
    };

    const labelStyle = {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#374151'
    };

    const sectionStyle = {
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    };

    switch (block.type) {
      case 'hero':
        return (
          <div style={{padding: '24px'}}>
            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Content</h4>
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Title</label>
                <input
                  type="text"
                  value={block.data.title || ''}
                  onChange={(e) => updateData('title', e.target.value)}
                  placeholder="Enter hero title"
                  style={inputStyle}
                />
              </div>
              
              {/* Individual Title Positioning */}
              <IndividualPositioning
                label="Title"
                data={block.data}
                fieldPrefix="title"
                updateData={updateData}
              />
              
              <div style={{marginBottom: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <label style={labelStyle}>Content Lines</label>
                  <button
                    onClick={() => {
                      const currentLines = block.data.contentLines || [{ id: '1', text: block.data.subtitle || '', type: 'subtitle' }];
                      const newLine = {
                        id: Date.now().toString(),
                        text: '',
                        type: 'subtitle',
                        size: '20px',
                        color: block.data.textColor || '#ffffff',
                        backgroundColor: 'transparent',
                        padding: '0px'
                      };
                      updateData('contentLines', [...currentLines, newLine]);
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Line
                  </button>
                </div>
                
                {(() => {
                  // Initialize content lines if not exists
                  const contentLines = block.data.contentLines || [{ 
                    id: '1', 
                    text: block.data.subtitle || '', 
                    type: 'subtitle',
                    size: '20px',
                    color: block.data.textColor || '#ffffff',
                    backgroundColor: 'transparent',
                    padding: '0px'
                  }];
                  
                  return contentLines.map((line, index) => (
                    <div key={line.id} style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                        <span style={{fontSize: '12px', fontWeight: '600', color: '#6b7280'}}>
                          Line {index + 1}
                        </span>
                        <div>
                          <button
                            onClick={() => {
                              const newLines = contentLines.filter(l => l.id !== line.id);
                              updateData('contentLines', newLines);
                            }}
                            style={{
                              padding: '2px 6px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      
                      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '8px'}}>
                        <div>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Text</label>
                          <textarea
                            value={line.text || ''}
                            onChange={(e) => {
                              const newLines = contentLines.map(l => 
                                l.id === line.id ? { ...l, text: e.target.value } : l
                              );
                              updateData('contentLines', newLines);
                            }}
                            placeholder="Enter text..."
                            rows={2}
                            style={{...inputStyle, fontSize: '12px', padding: '6px'}}
                          />
                        </div>
                        <div>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Type</label>
                          <select
                            value={line.type || 'subtitle'}
                            onChange={(e) => {
                              const newLines = contentLines.map(l => 
                                l.id === line.id ? { ...l, type: e.target.value } : l
                              );
                              updateData('contentLines', newLines);
                            }}
                            style={{...inputStyle, fontSize: '12px', padding: '4px'}}
                          >
                            <option value="subtitle">Subtitle</option>
                            <option value="heading">Heading</option>
                            <option value="text">Text</option>
                          </select>
                        </div>
                        <div>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Size</label>
                          <select
                            value={line.size || '20px'}
                            onChange={(e) => {
                              const newLines = contentLines.map(l => 
                                l.id === line.id ? { ...l, size: e.target.value } : l
                              );
                              updateData('contentLines', newLines);
                            }}
                            style={{...inputStyle, fontSize: '12px', padding: '4px'}}
                          >
                            <option value="14px">Small</option>
                            <option value="16px">Normal</option>
                            <option value="20px">Medium</option>
                            <option value="24px">Large</option>
                            <option value="32px">XL</option>
                            <option value="40px">XXL</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Color, Background, and Padding Controls */}
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px'}}>
                        <div>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Text Color</label>
                          <input
                            type="color"
                            value={line.color || block.data.textColor || '#ffffff'}
                            onChange={(e) => {
                              const newLines = contentLines.map(l => 
                                l.id === line.id ? { ...l, color: e.target.value } : l
                              );
                              updateData('contentLines', newLines);
                            }}
                            style={{...inputStyle, height: '30px', padding: '2px'}}
                          />
                        </div>
                        <div>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Background</label>
                          <select
                            value={line.backgroundColor || 'transparent'}
                            onChange={(e) => {
                              const newLines = contentLines.map(l => 
                                l.id === line.id ? { ...l, backgroundColor: e.target.value } : l
                              );
                              updateData('contentLines', newLines);
                            }}
                            style={{...inputStyle, fontSize: '12px', padding: '4px'}}
                          >
                            <option value="transparent">No Background</option>
                            <option value="#000000">Black</option>
                            <option value="#ffffff">White</option>
                            <option value="#3b82f6">Blue</option>
                            <option value="#ef4444">Red</option>
                            <option value="#10b981">Green</option>
                            <option value="#f59e0b">Yellow</option>
                            <option value="#8b5cf6">Purple</option>
                            <option value="rgba(0,0,0,0.5)">Semi-transparent Black</option>
                            <option value="rgba(255,255,255,0.5)">Semi-transparent White</option>
                            <option value="custom">Custom Color</option>
                          </select>
                        </div>
                        <div>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Padding</label>
                          <select
                            value={line.padding || '0px'}
                            onChange={(e) => {
                              const newLines = contentLines.map(l => 
                                l.id === line.id ? { ...l, padding: e.target.value } : l
                              );
                              updateData('contentLines', newLines);
                            }}
                            style={{...inputStyle, fontSize: '12px', padding: '4px'}}
                          >
                            <option value="0px">None</option>
                            <option value="4px 8px">Small (4px 8px)</option>
                            <option value="8px 16px">Medium (8px 16px)</option>
                            <option value="12px 24px">Large (12px 24px)</option>
                            <option value="16px 32px">XL (16px 32px)</option>
                            <option value="20px 40px">XXL (20px 40px)</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Custom background color input when needed */}
                      {line.backgroundColor === 'custom' && (
                        <div style={{marginTop: '8px'}}>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Custom Background Color</label>
                          <input
                            type="color"
                            value={line.customBackgroundColor || '#3b82f6'}
                            onChange={(e) => {
                              const newLines = contentLines.map(l => 
                                l.id === line.id ? { ...l, customBackgroundColor: e.target.value, backgroundColor: e.target.value } : l
                              );
                              updateData('contentLines', newLines);
                            }}
                            style={{...inputStyle, height: '30px', padding: '2px'}}
                          />
                        </div>
                      )}
                      
                      {/* Live Preview of the Line */}
                      {line.text && (
                        <div style={{marginTop: '8px', padding: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px'}}>
                          <label style={{...labelStyle, fontSize: '11px', marginBottom: '4px'}}>Preview:</label>
                          <div style={{
                            fontSize: line.size || '20px',
                            fontWeight: line.type === 'heading' ? '600' : '400',
                            color: line.color || block.data.textColor || '#ffffff',
                            backgroundColor: line.backgroundColor && line.backgroundColor !== 'transparent' ? line.backgroundColor : 'transparent',
                            padding: line.padding || '0px',
                            borderRadius: line.backgroundColor && line.backgroundColor !== 'transparent' ? '4px' : '0px',
                            width: 'fit-content',
                            textAlign: 'center',
                            lineHeight: '1.5',
                            margin: '0 auto'
                          }}>
                            {line.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
              
              {/* Legacy subtitle support - hidden now */}
              <div style={{display: 'none'}}>
                <textarea
                  value={block.data.subtitle || ''}
                  onChange={(e) => updateData('subtitle', e.target.value)}
                />
              </div>
              
              {/* Individual Subtitle Positioning */}
              <IndividualPositioning
                label="Content Lines"
                data={block.data}
                fieldPrefix="subtitle"
                updateData={updateData}
              />
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Background</h4>
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Background Type</label>
                <select
                  value={block.data.backgroundType || 'color'}
                  onChange={(e) => updateData('backgroundType', e.target.value)}
                  style={inputStyle}
                >
                  <option value="color">Solid Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              {block.data.backgroundType === 'color' && (
                <div style={{marginBottom: '16px'}}>
                  <label style={labelStyle}>Background Color</label>
                  <input
                    type="color"
                    value={block.data.backgroundColor || '#3b82f6'}
                    onChange={(e) => updateData('backgroundColor', e.target.value)}
                    style={{...inputStyle, height: '40px'}}
                  />
                </div>
              )}
              
              {block.data.backgroundType === 'gradient' && (
                <div style={{marginBottom: '16px'}}>
                  <label style={labelStyle}>Background Gradient</label>
                  <GradientPicker
                    value={block.data.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                    onChange={(gradient) => updateData('backgroundGradient', gradient)}
                  />
                </div>
              )}
              
              {block.data.backgroundType === 'image' && (
                <div>
                  <div style={{marginBottom: '16px'}}>
                    <ImageSelector
                      label="Background Image"
                      value={block.data.backgroundImage || ''}
                      onChange={(url) => updateData('backgroundImage', url)}
                      placeholder="Enter image URL or browse from library"
                    />
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    <div>
                      <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                          type="checkbox"
                          checked={block.data.backgroundOverlay || false}
                          onChange={(e) => updateData('backgroundOverlay', e.target.checked)}
                        />
                        Dark Overlay
                      </label>
                    </div>
                    <div>
                      <label style={labelStyle}>Overlay Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={block.data.overlayOpacity || 0.4}
                        onChange={(e) => updateData('overlayOpacity', parseFloat(e.target.value))}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px'}}>
                <div>
                  <label style={labelStyle}>Height</label>
                  <select
                    value={block.data.height || '400px'}
                    onChange={(e) => updateData('height', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="300px">Small (300px)</option>
                    <option value="400px">Medium (400px)</option>
                    <option value="500px">Large (500px)</option>
                    <option value="100vh">Full Screen</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Width</label>
                  <select
                    value={block.data.width || '100%'}
                    onChange={(e) => updateData('width', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="100%">Full Width</option>
                    <option value="1200px">Desktop (1200px)</option>
                    <option value="992px">Tablet (992px)</option>
                    <option value="768px">Mobile (768px)</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px'}}>
                <div>
                  <label style={labelStyle}>Padding</label>
                  <select
                    value={block.data.padding || '60px 20px'}
                    onChange={(e) => updateData('padding', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="40px 20px">Small</option>
                    <option value="60px 20px">Medium</option>
                    <option value="80px 20px">Large</option>
                    <option value="120px 20px">Extra Large</option>
                  </select>
                </div>
                <div></div>
              </div>
              
              <div style={sectionStyle}>
                <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Content Positioning</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                  <div>
                    <label style={labelStyle}>Horizontal Position</label>
                    <select
                      value={block.data.contentHorizontal || 'center'}
                      onChange={(e) => updateData('contentHorizontal', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Vertical Position</label>
                    <select
                      value={block.data.contentVertical || 'center'}
                      onChange={(e) => updateData('contentVertical', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                  <div>
                    <label style={labelStyle}>Content Width</label>
                    <select
                      value={block.data.contentWidth || 'normal'}
                      onChange={(e) => updateData('contentWidth', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="narrow">Narrow (600px)</option>
                      <option value="normal">Normal (800px)</option>
                      <option value="wide">Wide (1200px)</option>
                      <option value="full">Full Width</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Content Offset</label>
                    <select
                      value={block.data.contentOffset || 'none'}
                      onChange={(e) => updateData('contentOffset', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="none">None</option>
                      <option value="left">Offset Left</option>
                      <option value="right">Offset Right</option>
                      <option value="up">Offset Up</option>
                      <option value="down">Offset Down</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Typography</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                <div>
                  <label style={labelStyle}>Font Family</label>
                  <select
                    value={block.data.fontFamily || 'inherit'}
                    onChange={(e) => updateData('fontFamily', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="inherit">Default</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Open Sans', sans-serif">Open Sans</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                    <option value="'Poppins', sans-serif">Poppins</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Merriweather', serif">Merriweather</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Text Align</label>
                  <select
                    value={block.data.textAlign || 'center'}
                    onChange={(e) => updateData('textAlign', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                <div>
                  <label style={labelStyle}>Title Size (px)</label>
                  <input
                    type="number"
                    value={parseInt(block.data.titleSize) || 48}
                    onChange={(e) => updateData('titleSize', e.target.value + 'px')}
                    min="12"
                    max="120"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Subtitle Size (px)</label>
                  <input
                    type="number"
                    value={parseInt(block.data.subtitleSize) || 20}
                    onChange={(e) => updateData('subtitleSize', e.target.value + 'px')}
                    min="12"
                    max="48"
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Text Color</label>
                <input
                  type="color"
                  value={block.data.textColor || '#ffffff'}
                  onChange={(e) => updateData('textColor', e.target.value)}
                  style={{...inputStyle, height: '40px'}}
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="checkbox"
                    checked={!!block.data.titleGradient}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateData('titleGradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                      } else {
                        updateData('titleGradient', null);
                      }
                    }}
                  />
                  Use Gradient Text
                </label>
                {block.data.titleGradient && (
                  <div style={{marginTop: '8px'}}>
                    <GradientPicker
                      value={block.data.titleGradient}
                      onChange={(gradient) => updateData('titleGradient', gradient)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Button</h4>
              <div style={{marginBottom: '16px'}}>
                <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="checkbox"
                    checked={block.data.showButton !== false}
                    onChange={(e) => updateData('showButton', e.target.checked)}
                  />
                  Show Button
                </label>
              </div>
              
              {block.data.showButton !== false && (
                <div style={{marginTop: '16px'}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                    <div>
                      <label style={labelStyle}>Button Text</label>
                      <input
                        type="text"
                        value={block.data.ctaText || 'Learn More'}
                        onChange={(e) => updateData('ctaText', e.target.value)}
                        placeholder="Button text"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Button URL</label>
                      <input
                        type="text"
                        value={block.data.ctaLink || '#'}
                        onChange={(e) => updateData('ctaLink', e.target.value)}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                    <div>
                      <label style={labelStyle}>Button Background</label>
                      <input
                        type="color"
                        value={block.data.buttonColor || '#3b82f6'}
                        onChange={(e) => updateData('buttonColor', e.target.value)}
                        style={{...inputStyle, height: '40px'}}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Button Text Color</label>
                      <input
                        type="color"
                        value={block.data.buttonTextColor || '#ffffff'}
                        onChange={(e) => updateData('buttonTextColor', e.target.value)}
                        style={{...inputStyle, height: '40px'}}
                      />
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                    <div>
                      <label style={labelStyle}>Button Size</label>
                      <select
                        value={block.data.buttonSize || 'medium'}
                        onChange={(e) => updateData('buttonSize', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Button Style</label>
                      <select
                        value={block.data.buttonStyle || 'rounded'}
                        onChange={(e) => updateData('buttonStyle', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="pill">Pill</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Button Shadow</label>
                      <select
                        value={block.data.buttonShadow || 'medium'}
                        onChange={(e) => updateData('buttonShadow', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="none">None</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{marginBottom: '16px'}}>
                    <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <input
                        type="checkbox"
                        checked={!!block.data.buttonGradient}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateData('buttonGradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
                          } else {
                            updateData('buttonGradient', null);
                          }
                        }}
                      />
                      Use Gradient Background
                    </label>
                    {block.data.buttonGradient && (
                      <div style={{marginTop: '8px'}}>
                        <GradientPicker
                          value={block.data.buttonGradient}
                          onChange={(gradient) => updateData('buttonGradient', gradient)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div style={sectionStyle}>
                    <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Button Effects</h4>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                      <div>
                        <label style={labelStyle}>Hover Background</label>
                        <input
                          type="color"
                          value={block.data.buttonHoverColor || '#2563eb'}
                          onChange={(e) => updateData('buttonHoverColor', e.target.value)}
                          style={{...inputStyle, height: '40px'}}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Hover Text Color</label>
                        <input
                          type="color"
                          value={block.data.buttonHoverTextColor || '#ffffff'}
                          onChange={(e) => updateData('buttonHoverTextColor', e.target.value)}
                          style={{...inputStyle, height: '40px'}}
                        />
                      </div>
                    </div>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                      <div>
                        <label style={labelStyle}>Hover Effect</label>
                        <select
                          value={block.data.buttonHoverEffect || 'lift'}
                          onChange={(e) => updateData('buttonHoverEffect', e.target.value)}
                          style={inputStyle}
                        >
                          <option value="none">None</option>
                          <option value="lift">Lift Up</option>
                          <option value="scale">Scale Up</option>
                          <option value="glow">Glow</option>
                          <option value="bounce">Bounce</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Click Effect</label>
                        <select
                          value={block.data.buttonClickEffect || 'press'}
                          onChange={(e) => updateData('buttonClickEffect', e.target.value)}
                          style={inputStyle}
                        >
                          <option value="none">None</option>
                          <option value="press">Press Down</option>
                          <option value="scale">Scale Down</option>
                          <option value="ripple">Ripple</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{marginBottom: '16px'}}>
                      <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                          type="checkbox"
                          checked={!!block.data.buttonHoverGradient}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateData('buttonHoverGradient', 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)');
                            } else {
                              updateData('buttonHoverGradient', null);
                            }
                          }}
                        />
                        Use Gradient for Hover
                      </label>
                      {block.data.buttonHoverGradient && (
                        <div style={{marginTop: '8px'}}>
                          <GradientPicker
                            value={block.data.buttonHoverGradient}
                            onChange={(gradient) => updateData('buttonHoverGradient', gradient)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <ContentBuilder 
              data={block.data} 
              updateData={updateData} 
            />
          </div>
        );

      case 'richText':
        return (
          <div style={{padding: '24px'}}>
            <RichTextControls 
              data={block.data} 
              updateData={updateData} 
            />
          </div>
        );

      case 'image':
        return (
          <div style={{padding: '24px'}}>
            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Image</h4>
              <div style={{marginBottom: '16px'}}>
                <ImageSelector
                  label="Image"
                  value={block.data.src || ''}
                  onChange={(url) => updateData('src', url)}
                  placeholder="Enter image URL or browse from library"
                />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={labelStyle}>Alt Text</label>
                  <input
                    type="text"
                    value={block.data.alt || ''}
                    onChange={(e) => updateData('alt', e.target.value)}
                    placeholder="Describe the image"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Caption</label>
                  <input
                    type="text"
                    value={block.data.caption || ''}
                    onChange={(e) => updateData('caption', e.target.value)}
                    placeholder="Optional caption"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Layout & Style</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={labelStyle}>Alignment</label>
                  <select
                    value={block.data.alignment || 'center'}
                    onChange={(e) => updateData('alignment', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Border Radius</label>
                  <select
                    value={block.data.borderRadius || '0px'}
                    onChange={(e) => updateData('borderRadius', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="0px">None</option>
                    <option value="4px">Small</option>
                    <option value="8px">Medium</option>
                    <option value="16px">Large</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Padding</label>
                  <select
                    value={block.data.padding || '20px'}
                    onChange={(e) => updateData('padding', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="0px">None</option>
                    <option value="10px">Small</option>
                    <option value="20px">Medium</option>
                    <option value="40px">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div style={{padding: '24px'}}>
            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Spacer Settings</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                <div>
                  <label style={labelStyle}>Height (pixels)</label>
                  <input
                    type="number"
                    value={block.data.height || 50}
                    onChange={(e) => updateData('height', parseInt(e.target.value))}
                    min="10"
                    max="500"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Border Radius (px)</label>
                  <input
                    type="number"
                    value={parseInt(block.data.borderRadius) || 0}
                    onChange={(e) => updateData('borderRadius', e.target.value + 'px')}
                    min="0"
                    max="50"
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                <div>
                  <label style={labelStyle}>Margin Top (px)</label>
                  <input
                    type="number"
                    value={block.data.marginTop || 0}
                    onChange={(e) => updateData('marginTop', parseInt(e.target.value))}
                    min="0"
                    max="200"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Margin Bottom (px)</label>
                  <input
                    type="number"
                    value={block.data.marginBottom || 0}
                    onChange={(e) => updateData('marginBottom', parseInt(e.target.value))}
                    min="0"
                    max="200"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Background</h4>
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Background Type</label>
                <select
                  value={block.data.backgroundType || 'color'}
                  onChange={(e) => updateData('backgroundType', e.target.value)}
                  style={inputStyle}
                >
                  <option value="color">Solid Color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              
              {block.data.backgroundType === 'color' ? (
                <div>
                  <label style={labelStyle}>Background Color</label>
                  <input
                    type="color"
                    value={block.data.backgroundColor || '#ffffff'}
                    onChange={(e) => updateData('backgroundColor', e.target.value)}
                    style={{...inputStyle, height: '40px'}}
                  />
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>Background Gradient</label>
                  <GradientPicker
                    value={block.data.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                    onChange={(gradient) => updateData('backgroundGradient', gradient)}
                  />
                </div>
              )}
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Effects</h4>
              <div style={{marginBottom: '16px'}}>
                <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="checkbox"
                    checked={block.data.showBorder || false}
                    onChange={(e) => updateData('showBorder', e.target.checked)}
                  />
                  Show Border
                </label>
              </div>
              
              {block.data.showBorder && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                  <div>
                    <label style={labelStyle}>Border Width (px)</label>
                    <input
                      type="number"
                      value={block.data.borderWidth || 1}
                      onChange={(e) => updateData('borderWidth', parseInt(e.target.value))}
                      min="1"
                      max="10"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Border Style</label>
                    <select
                      value={block.data.borderStyle || 'solid'}
                      onChange={(e) => updateData('borderStyle', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Border Color</label>
                    <input
                      type="color"
                      value={block.data.borderColor || '#e5e7eb'}
                      onChange={(e) => updateData('borderColor', e.target.value)}
                      style={{...inputStyle, height: '32px'}}
                    />
                  </div>
                </div>
              )}
              
              <div style={{marginBottom: '16px'}}>
                <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="checkbox"
                    checked={block.data.showShadow || false}
                    onChange={(e) => updateData('showShadow', e.target.checked)}
                  />
                  Drop Shadow
                </label>
              </div>
              
              <div style={{
                height: block.data.height || 50,
                background: block.data.backgroundType === 'gradient' ? block.data.backgroundGradient : block.data.backgroundColor || '#f3f4f6',
                marginTop: '16px',
                border: block.data.showBorder ? `${block.data.borderWidth || 1}px ${block.data.borderStyle || 'solid'} ${block.data.borderColor || '#e5e7eb'}` : '2px dashed #d1d5db',
                borderRadius: block.data.borderRadius || '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: block.data.showShadow ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}>
                <span style={{color: '#6b7280', fontSize: '14px'}}>
                  Preview ({block.data.height || 50}px)
                </span>
              </div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div style={{padding: '24px'}}>
            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Divider Settings</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                <div>
                  <label style={labelStyle}>Thickness (px)</label>
                  <input
                    type="number"
                    value={block.data.thickness || 2}
                    onChange={(e) => updateData('thickness', parseInt(e.target.value))}
                    min="1"
                    max="20"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Width (%)</label>
                  <input
                    type="number"
                    value={parseInt(block.data.width) || 100}
                    onChange={(e) => updateData('width', e.target.value + '%')}
                    min="10"
                    max="100"
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Border Radius (px)</label>
                <input
                  type="number"
                  value={parseInt(block.data.borderRadius) || 0}
                  onChange={(e) => updateData('borderRadius', e.target.value + 'px')}
                  min="0"
                  max="50"
                  style={inputStyle}
                />
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Padding</label>
                <select
                  value={block.data.padding || '20px 0'}
                  onChange={(e) => updateData('padding', e.target.value)}
                  style={inputStyle}
                >
                  <option value="10px 0">Small</option>
                  <option value="20px 0">Medium</option>
                  <option value="40px 0">Large</option>
                  <option value="60px 0">Extra Large</option>
                </select>
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Styling</h4>
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Style Type</label>
                <select
                  value={block.data.styleType || 'color'}
                  onChange={(e) => updateData('styleType', e.target.value)}
                  style={inputStyle}
                >
                  <option value="color">Solid Color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              
              {block.data.styleType === 'color' ? (
                <div>
                  <label style={labelStyle}>Color</label>
                  <input
                    type="color"
                    value={block.data.color || '#e5e7eb'}
                    onChange={(e) => updateData('color', e.target.value)}
                    style={{...inputStyle, height: '40px'}}
                  />
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>Gradient CSS</label>
                  <textarea
                    value={block.data.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                    onChange={(e) => updateData('gradient', e.target.value)}
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    rows={2}
                    style={{...inputStyle, fontFamily: 'monospace'}}
                  />
                </div>
              )}
              
              <div style={{marginTop: '16px'}}>
                <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="checkbox"
                    checked={block.data.showShadow || false}
                    onChange={(e) => updateData('showShadow', e.target.checked)}
                  />
                  Drop Shadow
                </label>
              </div>
              
              <div style={{
                padding: block.data.padding || '20px 0',
                textAlign: 'center',
                marginTop: '16px',
                border: '1px dashed #d1d5db',
                borderRadius: '4px'
              }}>
                <hr style={{
                  border: 'none',
                  height: block.data.thickness || '2px',
                  background: block.data.styleType === 'gradient' ? block.data.gradient : block.data.color || '#e5e7eb',
                  borderRadius: block.data.borderRadius || '0px',
                  width: block.data.width || '100%',
                  margin: '0 auto',
                  boxShadow: block.data.showShadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }} />
              </div>
            </div>
          </div>
        );

      case 'columns':
        return (
          <div style={{padding: '24px'}}>
            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Layout Settings</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                <div>
                  <label style={labelStyle}>Columns</label>
                  <select
                    value={block.data.columns || 2}
                    onChange={(e) => {
                      const newColumns = parseInt(e.target.value);
                      const currentContent = block.data.columnContent || [];
                      const newContent = [];
                      
                      for (let i = 0; i < newColumns; i++) {
                        if (currentContent[i]) {
                          newContent.push(currentContent[i]);
                        } else {
                          newContent.push({
                            type: 'text',
                            content: `<p>Column ${i + 1} content</p>`,
                            padding: '16px'
                          });
                        }
                      }
                      
                      updateData('columns', newColumns);
                      updateData('columnContent', newContent);
                    }}
                    style={inputStyle}
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Gap</label>
                  <select
                    value={block.data.gap || '24px'}
                    onChange={(e) => updateData('gap', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="12px">Small</option>
                    <option value="24px">Medium</option>
                    <option value="36px">Large</option>
                    <option value="48px">Extra Large</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Padding</label>
                  <select
                    value={block.data.padding || '20px'}
                    onChange={(e) => updateData('padding', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="10px">Small</option>
                    <option value="20px">Medium</option>
                    <option value="40px">Large</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>Background Color</label>
                <input
                  type="color"
                  value={block.data.backgroundColor || '#ffffff'}
                  onChange={(e) => updateData('backgroundColor', e.target.value)}
                  style={{...inputStyle, height: '40px'}}
                />
              </div>
            </div>

            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Column Content</h4>
              {(block.data.columnContent || []).map((column, index) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: '#fafbfc'
                }}>
                  <h5 style={{margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600'}}>
                    Column {index + 1}
                  </h5>
                  
                  <div style={{marginBottom: '12px'}}>
                    <label style={labelStyle}>Content Type</label>
                    <select
                      value={column.type || 'text'}
                      onChange={(e) => {
                        const updatedColumns = [...block.data.columnContent];
                        updatedColumns[index] = { ...column, type: e.target.value };
                        if (e.target.value === 'text') {
                          updatedColumns[index].content = updatedColumns[index].content || `<p>Column ${index + 1} content</p>`;
                        } else if (e.target.value === 'image') {
                          updatedColumns[index].src = updatedColumns[index].src || '';
                          updatedColumns[index].alt = updatedColumns[index].alt || '';
                        }
                        updateData('columnContent', updatedColumns);
                      }}
                      style={inputStyle}
                    >
                      <option value="text">Text Content</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  
                  {column.type === 'text' ? (
                    <div style={{marginBottom: '12px'}}>
                      <label style={labelStyle}>Content (HTML)</label>
                      <textarea
                        value={column.content || ''}
                        onChange={(e) => {
                          const updatedColumns = [...block.data.columnContent];
                          updatedColumns[index] = { ...column, content: e.target.value };
                          updateData('columnContent', updatedColumns);
                        }}
                        rows={4}
                        style={{...inputStyle, fontFamily: 'monospace'}}
                      />
                    </div>
                  ) : (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                      <div>
                        <ImageSelector
                          label="Image"
                          value={column.src || ''}
                          onChange={(url) => {
                            const updatedColumns = [...block.data.columnContent];
                            updatedColumns[index] = { ...column, src: url };
                            updateData('columnContent', updatedColumns);
                          }}
                          placeholder="Enter image URL or browse from library"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Alt Text</label>
                        <input
                          type="text"
                          value={column.alt || ''}
                          onChange={(e) => {
                            const updatedColumns = [...block.data.columnContent];
                            updatedColumns[index] = { ...column, alt: e.target.value };
                            updateData('columnContent', updatedColumns);
                          }}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    <div>
                      <label style={labelStyle}>Padding</label>
                      <select
                        value={column.padding || '16px'}
                        onChange={(e) => {
                          const updatedColumns = [...block.data.columnContent];
                          updatedColumns[index] = { ...column, padding: e.target.value };
                          updateData('columnContent', updatedColumns);
                        }}
                        style={inputStyle}
                      >
                        <option value="8px">Small</option>
                        <option value="16px">Medium</option>
                        <option value="24px">Large</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Background</label>
                      <input
                        type="color"
                        value={column.backgroundColor || '#ffffff'}
                        onChange={(e) => {
                          const updatedColumns = [...block.data.columnContent];
                          updatedColumns[index] = { ...column, backgroundColor: e.target.value };
                          updateData('columnContent', updatedColumns);
                        }}
                        style={{...inputStyle, height: '32px'}}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'form':
        return (
          <div style={{padding: '24px'}}>
            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Form Configuration</h4>
              <p style={{margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px'}}>
                Use the advanced Form Builder for complete form creation and management.
              </p>
              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                <button
                  onClick={() => setActiveTab('forms')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  🚀 Open Form Builder
                </button>
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  📋 Select Existing Form
                </button>
              </div>
            </div>
            
            <div style={sectionStyle}>
              <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>Basic Settings</h4>
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Form Title</label>
                <input
                  type="text"
                  value={block.data.title || ''}
                  onChange={(e) => updateData('title', e.target.value)}
                  placeholder="Enter form title"
                  style={inputStyle}
                />
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={block.data.description || ''}
                  onChange={(e) => updateData('description', e.target.value)}
                  placeholder="Enter form description"
                  rows={3}
                  style={inputStyle}
                />
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={labelStyle}>Submit Button Text</label>
                <input
                  type="text"
                  value={block.data.submitText || 'Submit'}
                  onChange={(e) => updateData('submitText', e.target.value)}
                  placeholder="Submit"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div style={{padding: '24px'}}>
            <ContentBuilder 
              data={block.data} 
              updateData={updateData} 
            />
          </div>
        );

      default:
        return (
          <div style={{padding: '24px', textAlign: 'center', color: '#6b7280'}}>
            <h4>Advanced Editor for {block.type}</h4>
            <p>Advanced editing features coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`block-container ${isDragging ? 'dragging' : ''}`}>
      {!isPreview && (
        <div className="block-header">
          <div className="block-info">
            <div className="drag-handle" {...attributes} {...listeners}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
              </svg>
            </div>
            <div className="block-type-info">
              <span className="block-type">{getBlockTypeLabel(block.type)}</span>
              <span className="block-id">#{block.id.slice(-4)}</span>
            </div>
          </div>
          <button 
            onClick={() => onDelete(block.id)}
            className="delete-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      )}
      <div className="block-content">
        {renderBlock()}
      </div>
    </div>
  );
}

function getBlockTypeLabel(type) {
  const labels = {
    hero: 'Hero Section',
    richText: 'Rich Text',
    image: 'Image',
    gallery: 'Gallery',
    video: 'Video',
    form: 'Form',
    columns: 'Columns',
    spacer: 'Spacer',
    divider: 'Divider',
    content: 'Content Builder'
  };
  return labels[type] || type;
}

export default function NewPage() {
  const user = useSelector((state) => state.user);
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    content: [],
    status: 'draft',
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    nav: {
      showInNav: false,
      navTitle: '',
      order: 0
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit', 'preview', 'forms', 'analytics', 'templates'
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentAIContext, setCurrentAIContext] = useState('');
  const router = useRouter();

  // Define block types for the palette
  const blockTypes = [
    { type: 'hero', name: 'Hero Section', icon: '🎯', description: 'Large banner with text and CTA' },
    { type: 'richText', name: 'Rich Text', icon: '📝', description: 'Formatted text content' },
    { type: 'content', name: 'Content Builder', icon: '🏗️', description: 'Rich content with headings, images, tables' },
    { type: 'image', name: 'Image', icon: '🖼️', description: 'Single image with caption' },
    { type: 'gallery', name: 'Gallery', icon: '🖼️', description: 'Multiple images in grid' },
    { type: 'video', name: 'Video', icon: '🎥', description: 'Embedded video player' },
    { type: 'form', name: 'Form', icon: '📋', description: 'Contact or custom form' },
    { type: 'columns', name: 'Columns', icon: '📰', description: 'Multi-column layout' },
    { type: 'spacer', name: 'Spacer', icon: '↕️', description: 'Add vertical spacing' },
    { type: 'divider', name: 'Divider', icon: '➖', description: 'Horizontal line separator' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Don't redirect immediately, let user state load
    console.log('User state:', user);
  }, [user]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleTitleChange = (title) => {
    setPageData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo: {
        ...prev.seo,
        title: title || prev.seo.title
      }
    }));
  };

  const addBlock = (type, defaultData = {}) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      data: { ...getDefaultBlockData(type), ...defaultData }
    };

    setPageData(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };

  const getDefaultBlockData = (type) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Welcome',
          subtitle: 'Your subtitle here',
          backgroundType: 'color',
          backgroundColor: '#3b82f6',
          backgroundImage: '',
          backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          ctaText: 'Learn More',
          ctaLink: '#',
          showButton: true,
          height: '400px',
          padding: '60px 20px'
        };
      case 'richText':
        return {
          content: '<p>Your content here...</p>',
          buttons: []
        };
      case 'image':
        return {
          src: '',
          alt: 'Image description',
          caption: ''
        };
      case 'gallery':
        return {
          images: [],
          columns: 3
        };
      case 'video':
        return {
          url: '',
          title: 'Video Title',
          description: ''
        };
      case 'form':
        return {
          title: 'Contact Form',
          fields: [
            { type: 'text', name: 'name', label: 'Name', required: true },
            { type: 'email', name: 'email', label: 'Email', required: true },
            { type: 'textarea', name: 'message', label: 'Message', required: true }
          ],
          submitText: 'Submit'
        };
      case 'columns':
        return {
          columns: 2,
          gap: '24px',
          padding: '20px',
          columnContent: [
            { type: 'text', content: '<p>Column 1 content</p>', padding: '16px' },
            { type: 'text', content: '<p>Column 2 content</p>', padding: '16px' }
          ]
        };
      case 'spacer':
        return {
          height: 50,
          backgroundType: 'color',
          backgroundColor: 'transparent'
        };
      case 'divider':
        return {
          color: '#e5e7eb',
          thickness: 2,
          width: '100%',
          padding: '20px 0'
        };
      default:
        return {};
    }
  };

  const updateBlock = (blockId, newData) => {
    setPageData(prev => ({
      ...prev,
      content: prev.content.map(block =>
        block.id === blockId ? { ...block, data: newData } : block
      )
    }));
  };

  const deleteBlock = (blockId) => {
    setPageData(prev => ({
      ...prev,
      content: prev.content.filter(block => block.id !== blockId)
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPageData(prev => {
        const oldIndex = prev.content.findIndex(block => block.id === active.id);
        const newIndex = prev.content.findIndex(block => block.id === over.id);

        return {
          ...prev,
          content: arrayMove(prev.content, oldIndex, newIndex)
        };
      });
    }
  };

  const savePage = async () => {
    if (!pageData.title.trim()) {
      alert('Please enter a page title');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        const result = await response.json();
        router.push('/admin/cms');
      } else {
        const error = await response.json();
        alert('Error saving page: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <>
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{textAlign: 'center'}}>
            <h1>Admins Only Area</h1>
            <p>Please login as admin to create pages.</p>
            <Link href="/">
              <button className="submit" style={{padding: '8px 16px', borderRadius: '4px', color: 'white', fontWeight: '500'}}>
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Create New Page - First Church of God</title>
        <meta name="description" content="Create a new page for First Church of God with our professional drag-and-drop CMS. Easily build, style, and publish beautiful pages." />
        <meta name="keywords" content="First Church of God, CMS, page builder, drag and drop, church website, form builder, image library, template library" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.palatka-firstchurchofgod.org/admin/cms/new" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Create New Page - First Church of God" />
        <meta property="og:description" content="Create a new page for First Church of God with our professional drag-and-drop CMS. Easily build, style, and publish beautiful pages." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.palatka-firstchurchofgod.org/admin/cms/new" />
        <meta property="og:image" content="https://www.palatka-firstchurchofgod.org/images/og-card.png" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create New Page - First Church of God" />
        <meta name="twitter:description" content="Create a new page for First Church of God with our professional drag-and-drop CMS. Easily build, style, and publish beautiful pages." />
        <meta name="twitter:image" content="https://www.palatka-firstchurchofgod.org/images/og-card.png" />
        <meta name="twitter:site" content="@FirstChurchOfGod" />
      </Head>

      <div style={{minHeight: '100vh', backgroundColor: '#f8fafc'}}>
        {/* Professional Header */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 0',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <Link href="/admin/cms">
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back
                  </button>
                </Link>
                <div>
                  <h1 style={{fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0}}>
                    Create New Page
                  </h1>
                  <p style={{fontSize: '14px', color: '#6b7280', margin: '2px 0 0 0'}}>
                    Build your page with drag-and-drop blocks
                  </p>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                {/* Tab Switcher */}
                <div style={{
                  display: 'flex',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  padding: '4px'
                }}>
                  <button
                    onClick={() => setActiveTab('edit')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: activeTab === 'edit' ? 'white' : 'transparent',
                      color: activeTab === 'edit' ? '#1f2937' : '#6b7280',
                      boxShadow: activeTab === 'edit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: activeTab === 'preview' ? 'white' : 'transparent',
                      color: activeTab === 'preview' ? '#1f2937' : '#6b7280',
                      boxShadow: activeTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('forms')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: activeTab === 'forms' ? 'white' : 'transparent',
                      color: activeTab === 'forms' ? '#1f2937' : '#6b7280',
                      boxShadow: activeTab === 'forms' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Forms
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: activeTab === 'analytics' ? 'white' : 'transparent',
                      color: activeTab === 'analytics' ? '#1f2937' : '#6b7280',
                      boxShadow: activeTab === 'analytics' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('templates')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: activeTab === 'templates' ? 'white' : 'transparent',
                      color: activeTab === 'templates' ? '#1f2937' : '#6b7280',
                      boxShadow: activeTab === 'templates' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Templates
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: activeTab === 'users' ? 'white' : 'transparent',
                      color: activeTab === 'users' ? '#1f2937' : '#6b7280',
                      boxShadow: activeTab === 'users' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Users
                  </button>
                </div>

                <button 
                  onClick={savePage}
                  disabled={isSaving || !pageData.title.trim()}
                  className="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '14px',
                    opacity: (!pageData.title.trim() || isSaving) ? 0.6 : 1,
                    cursor: (!pageData.title.trim() || isSaving) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Page'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{maxWidth: '1400px', margin: '0 auto', padding: '24px'}}>
          {activeTab === 'edit' ? (
            <div style={{display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', height: 'calc(100vh - 140px)'}}>
              {/* Sidebar */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                {/* Page Settings */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{padding: '20px', borderBottom: '1px solid #f3f4f6'}}>
                    <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>
                      Page Settings
                    </h3>
                  </div>
                  <div style={{padding: '20px'}}>
                    <div style={{marginBottom: '20px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Page Title *
                      </label>
                      <input
                        type="text"
                        value={pageData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter page title"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'border-color 0.2s'
                        }}
                      />
                    </div>

                    <div style={{marginBottom: '20px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={pageData.slug}
                        onChange={(e) => setPageData(prev => ({...prev, slug: e.target.value}))}
                        placeholder="page-url"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <p style={{fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0'}}>
                        yoursite.com/{pageData.slug || 'page-url'}
                      </p>
                    </div>

                    <div style={{marginBottom: '20px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Status
                      </label>
                      <select
                        value={pageData.status}
                        onChange={(e) => setPageData(prev => ({...prev, status: e.target.value}))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={pageData.nav.showInNav}
                          onChange={(e) => setPageData(prev => ({
                            ...prev,
                            nav: {...prev.nav, showInNav: e.target.checked}
                          }))}
                          style={{margin: 0}}
                        />
                        <span style={{fontSize: '14px', color: '#374151'}}>Show in Navigation</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Content Blocks Palette */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{padding: '20px', borderBottom: '1px solid #f3f4f6'}}>
                    <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>
                      Add Content Blocks
                    </h3>
                  </div>
                  <div style={{padding: '16px', display: 'grid', gap: '8px'}}>
                    {blockTypes.map((blockType) => (
                      <button
                        key={blockType.type}
                        onClick={() => addBlock(blockType.type)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.backgroundColor = 'white';
                        }}
                      >
                        <div style={{
                          fontSize: '20px',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {blockType.icon}
                        </div>
                        <div>
                          <div style={{fontWeight: '500', fontSize: '14px', color: '#1f2937'}}>
                            {blockType.name}
                          </div>
                          <div style={{fontSize: '12px', color: '#6b7280'}}>
                            {blockType.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Editor Area */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{padding: '20px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafbfc'}}>
                  <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>
                    Page Content
                  </h3>
                  <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280'}}>
                    {pageData.content.length} block{pageData.content.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div style={{flex: 1, overflow: 'auto', padding: '20px'}}>
                  {pageData.content.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      color: '#6b7280'
                    }}>
                      <div style={{fontSize: '48px', marginBottom: '16px'}}>📄</div>
                      <h3 style={{fontSize: '18px', fontWeight: '500', margin: '0 0 8px 0'}}>
                        Start building your page
                      </h3>
                      <p style={{margin: 0}}>Add blocks from the sidebar to create your content</p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis]}
                    >
                      <SortableContext
                        items={pageData.content.map(block => block.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {pageData.content.map((block) => (
                          <SortableBlock
                            key={block.id}
                            block={block}
                            onUpdate={updateBlock}
                            onDelete={deleteBlock}
                            isPreview={false}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'preview' ? (
            /* Preview Mode */
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              minHeight: 'calc(100vh - 140px)',
              overflow: 'auto'
            }}>
              <div style={{padding: '20px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafbfc'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div>
                    <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>
                      Preview: {pageData.title || 'Untitled Page'}
                    </h3>
                    <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280'}}>
                      How your page will look to visitors
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{padding: '0'}}>
                <Layout>
                  {pageData.content.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      color: '#6b7280',
                      minHeight: '400px'
                    }}>
                      <div style={{fontSize: '48px', marginBottom: '16px'}}>👁️</div>
                      <h3 style={{fontSize: '18px', fontWeight: '500', margin: '0 0 8px 0'}}>
                        No content to preview
                      </h3>
                      <p style={{margin: 0}}>Add some blocks to see the preview</p>
                    </div>
                  ) : (
                    <div>
                      {pageData.content.map((block) => (
                        <div key={block.id}>
                          <SortableBlock
                            block={block}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                            isPreview={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Layout>
              </div>
            </div>
          ) : activeTab === 'forms' ? (
            <div style={{ height: 'calc(100vh - 140px)' }}>
              <FormBuilderAdvanced />
            </div>
          ) : activeTab === 'analytics' ? (
            <div style={{ height: 'calc(100vh - 140px)' }}>
              <AnalyticsDashboard />
            </div>
          ) : activeTab === 'templates' ? (
            <div style={{ height: 'calc(100vh - 140px)' }}>
              <TemplateLibrary onSelectTemplate={(template) => {
                // Apply template to current page
                setPageData(prev => ({
                  ...prev,
                  content: template.content || []
                }));
                setActiveTab('edit');
              }} />
            </div>
          ) : activeTab === 'users' ? (
            <div style={{ height: 'calc(100vh - 140px)' }}>
              <UserManagement />
            </div>
          ) : null}
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        onGenerate={(type, content) => {
          // Handle AI generated content
          if (type === 'hero') {
            addBlock('hero', {
              title: content.title || content,
              subtitle: content.subtitle || '',
              buttonText: content.buttonText || 'Learn More'
            });
          } else if (type === 'richText') {
            addBlock('richText', {
              content: content
            });
          } else {
            // For other content types, add as rich text
            addBlock('richText', {
              content: content
            });
          }
          setActiveTab('edit');
        }}
        context={currentAIContext}
      />

      <style jsx>{`
        .block-container {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 16px;
          background: white;
          transition: all 0.2s ease;
          overflow: hidden;
        }
        
        .block-container:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        
        .block-container.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
        }
        
        .block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e5e7eb;
        }
        
        .block-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .drag-handle {
          cursor: grab;
          padding: 4px;
          border-radius: 4px;
          color: #6b7280;
          transition: all 0.2s;
        }
        
        .drag-handle:hover {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .drag-handle:active {
          cursor: grabbing;
        }
        
        .block-type-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .block-type {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }
        
        .block-id {
          font-size: 11px;
          color: #9ca3af;
          font-family: monospace;
        }
        
        .delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 6px;
          background: #fee2e2;
          color: #dc2626;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .delete-btn:hover {
          background: #fca5a5;
          color: #991b1b;
        }
        
        .block-content {
          position: relative;
        }
      `}</style>
    </>
  );
}
