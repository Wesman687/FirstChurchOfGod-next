import React, { useState } from 'react';
import Image from 'next/image';

const ContentBuilder = ({ data = {}, updateData }) => {
  const [showImageUpload, setShowImageUpload] = useState(false);

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

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '8px',
    marginBottom: '8px'
  };

  const addButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981'
  };

  const removeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    padding: '4px 8px',
    fontSize: '12px'
  };

  // Initialize content items if not exists
  const contentItems = data.contentItems || [];

  const addContentItem = (type) => {
    const newItem = {
      id: Date.now().toString(),
      type: type,
      content: type === 'heading' ? 'New Heading' :
               type === 'paragraph' ? 'New paragraph text...' :
               type === 'image' ? '' :
               type === 'table' ? JSON.stringify({
                 headers: ['Header 1', 'Header 2', 'Header 3'],
                 rows: [
                   ['Cell 1', 'Cell 2', 'Cell 3'],
                   ['Cell 4', 'Cell 5', 'Cell 6']
                 ]
               }) : 'New content...',
      level: type === 'heading' ? 'h2' : undefined,
      alt: type === 'image' ? 'Image description' : undefined,
      alignment: 'left',
      fontSize: type === 'heading' ? '32px' : '16px',
      fontWeight: type === 'heading' ? '600' : '400',
      color: '#000000',
      marginTop: '16px',
      marginBottom: '16px'
    };

    const newContentItems = [...contentItems, newItem];
    updateData('contentItems', newContentItems);
  };

  const updateContentItem = (itemId, field, value) => {
    const newContentItems = contentItems.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateData('contentItems', newContentItems);
  };

  const removeContentItem = (itemId) => {
    const newContentItems = contentItems.filter(item => item.id !== itemId);
    updateData('contentItems', newContentItems);
  };

  const moveContentItem = (itemId, direction) => {
    const currentIndex = contentItems.findIndex(item => item.id === itemId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === contentItems.length - 1)
    ) {
      return;
    }

    const newContentItems = [...contentItems];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newContentItems[currentIndex], newContentItems[newIndex]] = 
    [newContentItems[newIndex], newContentItems[currentIndex]];
    
    updateData('contentItems', newContentItems);
  };

  const handleImageUpload = (itemId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateContentItem(itemId, 'content', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={sectionStyle}>
      <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
        📝 Content Builder
      </h4>

      {/* Add Content Buttons */}
      <div style={{marginBottom: '20px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
        <h5 style={{margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151'}}>Add Content:</h5>
        <button style={addButtonStyle} onClick={() => addContentItem('heading')}>
          + Heading
        </button>
        <button style={addButtonStyle} onClick={() => addContentItem('paragraph')}>
          + Paragraph
        </button>
        <button style={addButtonStyle} onClick={() => addContentItem('image')}>
          + Image
        </button>
        <button style={addButtonStyle} onClick={() => addContentItem('quote')}>
          + Quote
        </button>
        <button style={addButtonStyle} onClick={() => addContentItem('list')}>
          + List
        </button>
        <button style={addButtonStyle} onClick={() => addContentItem('table')}>
          + Table
        </button>
        <button style={addButtonStyle} onClick={() => addContentItem('divider')}>
          + Divider
        </button>
      </div>

      {/* Content Items */}
      {contentItems.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#6b7280',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '2px dashed #d1d5db'
        }}>
          <div style={{fontSize: '32px', marginBottom: '12px'}}>📄</div>
          <p style={{margin: 0, fontSize: '14px'}}>No content added yet. Click the buttons above to add content.</p>
        </div>
      ) : (
        <div>
          {contentItems.map((item, index) => (
            <div key={item.id} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              {/* Item Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {item.type === 'heading' ? `${item.level?.toUpperCase()} Heading` : 
                   item.type === 'paragraph' ? 'Paragraph' :
                   item.type === 'image' ? 'Image' :
                   item.type === 'quote' ? 'Quote' :
                   item.type === 'list' ? 'List' :
                   item.type === 'table' ? 'Table' :
                   item.type === 'divider' ? 'Divider' : item.type}
                </span>
                <div>
                  <button 
                    style={{...buttonStyle, backgroundColor: '#6b7280', padding: '4px 8px', fontSize: '12px'}}
                    onClick={() => moveContentItem(item.id, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button 
                    style={{...buttonStyle, backgroundColor: '#6b7280', padding: '4px 8px', fontSize: '12px'}}
                    onClick={() => moveContentItem(item.id, 'down')}
                    disabled={index === contentItems.length - 1}
                  >
                    ↓
                  </button>
                  <button 
                    style={removeButtonStyle}
                    onClick={() => removeContentItem(item.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Item Content Based on Type */}
              {item.type === 'heading' && (
                <div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                    <div>
                      <label style={labelStyle}>Heading Level</label>
                      <select
                        value={item.level || 'h2'}
                        onChange={(e) => updateContentItem(item.id, 'level', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="h1">H1 - Main Title</option>
                        <option value="h2">H2 - Section</option>
                        <option value="h3">H3 - Subsection</option>
                        <option value="h4">H4 - Minor</option>
                        <option value="h5">H5 - Small</option>
                        <option value="h6">H6 - Tiny</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Font Size</label>
                      <select
                        value={item.fontSize || '32px'}
                        onChange={(e) => updateContentItem(item.id, 'fontSize', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="48px">Extra Large</option>
                        <option value="36px">Large</option>
                        <option value="32px">Medium</option>
                        <option value="24px">Small</option>
                        <option value="20px">Extra Small</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Heading Text</label>
                    <input
                      type="text"
                      value={item.content || ''}
                      onChange={(e) => updateContentItem(item.id, 'content', e.target.value)}
                      style={inputStyle}
                      placeholder="Enter heading text..."
                    />
                  </div>
                </div>
              )}

              {item.type === 'paragraph' && (
                <div>
                  <label style={labelStyle}>Paragraph Text</label>
                  <textarea
                    value={item.content || ''}
                    onChange={(e) => updateContentItem(item.id, 'content', e.target.value)}
                    rows={4}
                    style={inputStyle}
                    placeholder="Enter paragraph text... You can use basic HTML tags like <strong>, <em>, <br>, etc."
                  />
                </div>
              )}

              {item.type === 'image' && (
                <div>
                  <div style={{marginBottom: '12px'}}>
                    <label style={labelStyle}>Image Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(item.id, e)}
                      style={inputStyle}
                    />
                  </div>
                  {item.content && (
                    <div style={{marginBottom: '12px'}}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.content} 
                        alt={item.alt || 'Preview'} 
                        style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '4px'}}
                      />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Alt Text (for accessibility)</label>
                    <input
                      type="text"
                      value={item.alt || ''}
                      onChange={(e) => updateContentItem(item.id, 'alt', e.target.value)}
                      style={inputStyle}
                      placeholder="Describe the image..."
                    />
                  </div>
                </div>
              )}

              {item.type === 'quote' && (
                <div>
                  <label style={labelStyle}>Quote Text</label>
                  <textarea
                    value={item.content || ''}
                    onChange={(e) => updateContentItem(item.id, 'content', e.target.value)}
                    rows={3}
                    style={inputStyle}
                    placeholder="Enter quote text..."
                  />
                </div>
              )}

              {item.type === 'list' && (
                <div>
                  <div style={{marginBottom: '12px'}}>
                    <label style={labelStyle}>List Type</label>
                    <select
                      value={item.listType || 'unordered'}
                      onChange={(e) => updateContentItem(item.id, 'listType', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="unordered">• Bullet Points</option>
                      <option value="ordered">1. Numbered List</option>
                    </select>
                  </div>
                  <label style={labelStyle}>List Items (one per line)</label>
                  <textarea
                    value={item.content || ''}
                    onChange={(e) => updateContentItem(item.id, 'content', e.target.value)}
                    rows={4}
                    style={inputStyle}
                    placeholder="List item 1&#10;List item 2&#10;List item 3"
                  />
                </div>
              )}

              {item.type === 'table' && (
                <div>
                  {(() => {
                    let tableData;
                    try {
                      tableData = JSON.parse(item.content || '{"headers":[],"rows":[]}');
                    } catch {
                      tableData = { headers: ['Header 1', 'Header 2'], rows: [['Cell 1', 'Cell 2']] };
                    }

                    const updateTable = (newTableData) => {
                      updateContentItem(item.id, 'content', JSON.stringify(newTableData));
                    };

                    return (
                      <div>
                        <div style={{marginBottom: '12px', display: 'flex', gap: '8px'}}>
                          <button
                            style={{...buttonStyle, backgroundColor: '#10b981', padding: '4px 8px', fontSize: '12px'}}
                            onClick={() => {
                              const newData = { ...tableData };
                              newData.headers.push(`Header ${newData.headers.length + 1}`);
                              newData.rows = newData.rows.map(row => [...row, `Cell ${row.length + 1}`]);
                              updateTable(newData);
                            }}
                          >
                            + Column
                          </button>
                          <button
                            style={{...buttonStyle, backgroundColor: '#10b981', padding: '4px 8px', fontSize: '12px'}}
                            onClick={() => {
                              const newData = { ...tableData };
                              newData.rows.push(new Array(newData.headers.length).fill('').map((_, i) => `Cell ${i + 1}`));
                              updateTable(newData);
                            }}
                          >
                            + Row
                          </button>
                          <button
                            style={{...buttonStyle, backgroundColor: '#ef4444', padding: '4px 8px', fontSize: '12px'}}
                            onClick={() => {
                              const newData = { ...tableData };
                              if (newData.headers.length > 1) {
                                newData.headers.pop();
                                newData.rows = newData.rows.map(row => row.slice(0, -1));
                                updateTable(newData);
                              }
                            }}
                          >
                            - Column
                          </button>
                          <button
                            style={{...buttonStyle, backgroundColor: '#ef4444', padding: '4px 8px', fontSize: '12px'}}
                            onClick={() => {
                              const newData = { ...tableData };
                              if (newData.rows.length > 1) {
                                newData.rows.pop();
                                updateTable(newData);
                              }
                            }}
                          >
                            - Row
                          </button>
                        </div>

                        {/* Headers */}
                        <div style={{marginBottom: '8px'}}>
                          <label style={{...labelStyle, fontSize: '12px', fontWeight: '600'}}>Headers:</label>
                          <div style={{display: 'grid', gridTemplateColumns: `repeat(${tableData.headers.length}, 1fr)`, gap: '4px'}}>
                            {tableData.headers.map((header, colIndex) => (
                              <input
                                key={colIndex}
                                type="text"
                                value={header}
                                onChange={(e) => {
                                  const newData = { ...tableData };
                                  newData.headers[colIndex] = e.target.value;
                                  updateTable(newData);
                                }}
                                style={{...inputStyle, fontSize: '12px', padding: '4px'}}
                                placeholder={`Header ${colIndex + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Rows */}
                        <div>
                          <label style={{...labelStyle, fontSize: '12px', fontWeight: '600'}}>Rows:</label>
                          {tableData.rows.map((row, rowIndex) => (
                            <div key={rowIndex} style={{display: 'grid', gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: '4px', marginBottom: '4px'}}>
                              {row.map((cell, colIndex) => (
                                <input
                                  key={`${rowIndex}-${colIndex}`}
                                  type="text"
                                  value={cell}
                                  onChange={(e) => {
                                    const newData = { ...tableData };
                                    newData.rows[rowIndex][colIndex] = e.target.value;
                                    updateTable(newData);
                                  }}
                                  style={{...inputStyle, fontSize: '12px', padding: '4px'}}
                                  placeholder={`Cell ${colIndex + 1}`}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {item.type === 'divider' && (
                <div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    <div>
                      <label style={labelStyle}>Divider Style</label>
                      <select
                        value={item.dividerStyle || 'solid'}
                        onChange={(e) => updateContentItem(item.id, 'dividerStyle', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="solid">Solid Line</option>
                        <option value="dashed">Dashed Line</option>
                        <option value="dotted">Dotted Line</option>
                        <option value="double">Double Line</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Thickness</label>
                      <select
                        value={item.thickness || '2px'}
                        onChange={(e) => updateContentItem(item.id, 'thickness', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="1px">Thin</option>
                        <option value="2px">Medium</option>
                        <option value="4px">Thick</option>
                        <option value="8px">Extra Thick</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Common Styling Options */}
              {item.type !== 'divider' && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <h6 style={{margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280'}}>Styling</h6>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px'}}>
                    <div>
                      <label style={{...labelStyle, fontSize: '12px'}}>Alignment</label>
                      <select
                        value={item.alignment || 'left'}
                        onChange={(e) => updateContentItem(item.id, 'alignment', e.target.value)}
                        style={{...inputStyle, fontSize: '12px', padding: '4px 8px'}}
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    <div>
                      <label style={{...labelStyle, fontSize: '12px'}}>Color</label>
                      <input
                        type="color"
                        value={item.color || '#000000'}
                        onChange={(e) => updateContentItem(item.id, 'color', e.target.value)}
                        style={{...inputStyle, height: '28px', padding: '2px'}}
                      />
                    </div>
                    <div>
                      <label style={{...labelStyle, fontSize: '12px'}}>Weight</label>
                      <select
                        value={item.fontWeight || '400'}
                        onChange={(e) => updateContentItem(item.id, 'fontWeight', e.target.value)}
                        style={{...inputStyle, fontSize: '12px', padding: '4px 8px'}}
                      >
                        <option value="300">Light</option>
                        <option value="400">Normal</option>
                        <option value="600">Bold</option>
                        <option value="700">Extra Bold</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentBuilder;
