import React, { useState } from 'react';

const RichTextControls = ({ data = {}, updateData }) => {
  const [editorMode, setEditorMode] = useState('advanced'); // 'simple' or 'advanced'
  
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

  const codeEditorStyle = {
    width: '100%',
    padding: '16px',
    border: '1px solid #374151',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    backgroundColor: '#1a1a1a',
    color: '#e5e5e5',
    lineHeight: '1.6',
    minHeight: '400px',
    resize: 'vertical',
    outline: 'none'
  };

  // Advanced HTML templates for quick insertion
  const htmlTemplates = {
    article: `<article>
  <header>
    <h1>Article Title</h1>
    <p class="meta">By Author Name | Date</p>
  </header>
  <main>
    <p>Article content goes here...</p>
  </main>
</article>`,
    card: `<div class="card" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
  <a href="#" class="btn" style="display: inline-block; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">Learn More</a>
</div>`,
    callout: `<div class="callout" style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
  <h4 style="color: #1e40af; margin: 0 0 8px 0;">Important Note</h4>
  <p style="margin: 0;">Your important message here...</p>
</div>`,
    grid: `<div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin: 24px 0;">
  <div class="grid-item" style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <h3>Item 1</h3>
    <p>Content for first item...</p>
  </div>
  <div class="grid-item" style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <h3>Item 2</h3>
    <p>Content for second item...</p>
  </div>
</div>`,
    flexbox: `<div class="flex-container" style="display: flex; gap: 20px; align-items: center; margin: 24px 0;">
  <div class="flex-item" style="flex: 1;">
    <h3>Left Content</h3>
    <p>Content on the left side...</p>
  </div>
  <div class="flex-item" style="flex: 1;">
    <h3>Right Content</h3>
    <p>Content on the right side...</p>
  </div>
</div>`,
    cta: `<section class="cta" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 40px; text-align: center; border-radius: 12px; margin: 40px 0;">
  <h2 style="margin: 0 0 16px 0; font-size: 2rem;">Ready to Get Started?</h2>
  <p style="margin: 0 0 32px 0; font-size: 1.2rem; opacity: 0.9;">Join thousands of satisfied customers today</p>
  <a href="#" class="cta-btn" style="display: inline-block; padding: 16px 32px; background: white; color: #667eea; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease;">Get Started Now</a>
</section>`
  };

  // AI-friendly code snippets
  const aiSnippets = {
    dynamicContent: `<!-- AI Dynamic Content Block -->
<div id="ai-content-{{id}}" class="ai-generated" data-ai-prompt="{{prompt}}">
  <!-- AI will populate this content -->
  <p>Loading AI-generated content...</p>
</div>`,
    conditionalBlock: `<!-- AI Conditional Display -->
<div class="conditional-content" data-condition="{{condition}}" data-show-when="{{value}}">
  <!-- Content shown based on AI logic -->
  <p>Conditional content here...</p>
</div>`,
    dataBinding: `<!-- AI Data Binding -->
<div class="data-bound" data-source="{{dataSource}}" data-template="{{templateId}}">
  <h3>{{title}}</h3>
  <p>{{description}}</p>
  <span class="meta">{{metadata}}</span>
</div>`,
    interactiveElement: `<!-- AI Interactive Component -->
<div class="interactive-element" data-behavior="{{behavior}}" data-trigger="{{trigger}}">
  <button onclick="{{action}}">{{buttonText}}</button>
  <div class="response-area" id="response-{{id}}"></div>
</div>`
  };

  // Insert template helper
  const insertTemplate = (templateKey) => {
    const template = htmlTemplates[templateKey] || aiSnippets[templateKey];
    if (template) {
      const currentContent = data.content || '';
      updateData('content', currentContent + '\n' + template + '\n');
    }
  };

  // Format and validate HTML
  const formatHTML = () => {
    try {
      const content = data.content || '';
      // Basic HTML formatting - adds proper indentation
      const formatted = content
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index, array) => {
          let indent = 0;
          for (let i = 0; i < index; i++) {
            const prevLine = array[i];
            if (prevLine.includes('<') && !prevLine.includes('</') && !prevLine.includes('/>')) {
              indent += 2;
            }
            if (prevLine.includes('</')) {
              indent = Math.max(0, indent - 2);
            }
          }
          return ' '.repeat(indent) + line;
        })
        .join('\n');
      
      updateData('content', formatted);
    } catch (error) {
      console.error('HTML formatting error:', error);
    }
  };

  // Simple content helpers for backwards compatibility
  const insertFormatting = (tag, content = 'Text') => {
    const currentContent = data.content || '';
    const newContent = currentContent + `<${tag}>${content}</${tag}>\n`;
    updateData('content', newContent);
  };

  const insertLineBreak = () => {
    const currentContent = data.content || '';
    const newContent = currentContent + `<br>\n`;
    updateData('content', newContent);
  };

  const insertList = (type) => {
    const listTag = type === 'ordered' ? 'ol' : 'ul';
    const listHTML = `<${listTag}>
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</${listTag}>
`;
    const currentContent = data.content || '';
    updateData('content', currentContent + listHTML);
  };

  const insertLink = () => {
    const linkHTML = '<a href="https://example.com" target="_blank">Link Text</a>\n';
    const currentContent = data.content || '';
    updateData('content', currentContent + linkHTML);
  };

  const insertTable = () => {
    const tableHTML = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5;">Header 1</th>
      <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5;">Header 2</th>
      <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5;">Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;">Cell 1</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Cell 2</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Cell 3</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;">Cell 4</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Cell 5</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Cell 6</td>
    </tr>
  </tbody>
</table>
`;
    const currentContent = data.content || '';
    updateData('content', currentContent + tableHTML);
  };

  const insertDivider = () => {
    const dividerHTML = '<hr style="margin: 40px 0; border: none; border-top: 2px solid #e5e7eb;" />\n';
    const currentContent = data.content || '';
    updateData('content', currentContent + dividerHTML);
  };

  const insertQuote = () => {
    const quoteHTML = '<blockquote style="border-left: 4px solid #3b82f6; padding-left: 20px; margin: 20px 0; font-style: italic; color: #6b7280;">Your quote text here...</blockquote>\n';
    const currentContent = data.content || '';
    updateData('content', currentContent + quoteHTML);
  };

  return (
    <>
      {/* Editor Mode Toggle */}
      <div style={sectionStyle}>
        <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
          🔧 Editor Mode
        </h4>
        <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: editorMode === 'simple' ? '#3b82f6' : '#6b7280'
            }}
            onClick={() => setEditorMode('simple')}
          >
            📝 Simple Editor
          </button>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: editorMode === 'advanced' ? '#3b82f6' : '#6b7280'
            }}
            onClick={() => setEditorMode('advanced')}
          >
            💻 Advanced HTML Editor
          </button>
        </div>
      </div>

      {editorMode === 'simple' ? (
        /* Simple Editor Mode */
        <>
          <div style={sectionStyle}>
            <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
              📝 Content
            </h4>
            
            {/* Quick Formatting Buttons */}
            <div style={{marginBottom: '16px'}}>
              <h5 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600'}}>Quick Insert:</h5>
              <button style={buttonStyle} onClick={() => insertFormatting('h1', 'Heading 1')}>H1</button>
              <button style={buttonStyle} onClick={() => insertFormatting('h2', 'Heading 2')}>H2</button>
              <button style={buttonStyle} onClick={() => insertFormatting('h3', 'Heading 3')}>H3</button>
              <button style={buttonStyle} onClick={insertParagraph}>+ Paragraph</button>
              <button style={buttonStyle} onClick={insertLineBreak}>Line Break</button>
              <button style={buttonStyle} onClick={() => insertFormatting('strong', 'Bold text')}>Bold</button>
              <button style={buttonStyle} onClick={() => insertFormatting('em', 'Italic text')}>Italic</button>
              <button style={buttonStyle} onClick={() => insertList('unordered')}>• List</button>
              <button style={buttonStyle} onClick={() => insertList('ordered')}>1. List</button>
              <button style={buttonStyle} onClick={insertLink}>Link</button>
              <button style={buttonStyle} onClick={insertQuote}>Quote</button>
              <button style={buttonStyle} onClick={insertTable}>Table</button>
              <button style={buttonStyle} onClick={insertDivider}>Divider</button>
            </div>

            <div>
              <label style={labelStyle}>Content (HTML supported)</label>
              <textarea
                value={data.content || ''}
                onChange={(e) => updateData('content', e.target.value)}
                placeholder="<p>Start typing your content here...</p>"
                rows={12}
                style={{...inputStyle, fontFamily: 'monospace', lineHeight: '1.5'}}
              />
            </div>
          </div>
        </>
      ) : (
        /* Advanced HTML Editor Mode */
        <>
          <div style={sectionStyle}>
            <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
              💻 Advanced HTML Editor
            </h4>
            
            {/* HTML Templates */}
            <div style={{marginBottom: '16px'}}>
              <h5 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600'}}>HTML Templates:</h5>
              <button style={buttonStyle} onClick={() => insertTemplate('article')}>📄 Article</button>
              <button style={buttonStyle} onClick={() => insertTemplate('card')}>🃏 Card</button>
              <button style={buttonStyle} onClick={() => insertTemplate('callout')}>💡 Callout</button>
              <button style={buttonStyle} onClick={() => insertTemplate('grid')}>⚏ Grid Layout</button>
              <button style={buttonStyle} onClick={() => insertTemplate('flexbox')}>📐 Flexbox</button>
              <button style={buttonStyle} onClick={() => insertTemplate('cta')}>🎯 Call to Action</button>
            </div>

            {/* AI Code Snippets */}
            <div style={{marginBottom: '16px'}}>
              <h5 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600'}}>AI-Ready Components:</h5>
              <button style={buttonStyle} onClick={() => insertTemplate('dynamicContent')}>🤖 Dynamic Content</button>
              <button style={buttonStyle} onClick={() => insertTemplate('conditionalBlock')}>❓ Conditional</button>
              <button style={buttonStyle} onClick={() => insertTemplate('dataBinding')}>🔗 Data Binding</button>
              <button style={buttonStyle} onClick={() => insertTemplate('interactiveElement')}>⚡ Interactive</button>
            </div>

            {/* Code Actions */}
            <div style={{marginBottom: '16px'}}>
              <h5 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600'}}>Code Actions:</h5>
              <button style={buttonStyle} onClick={formatHTML}>🎨 Format HTML</button>
              <button 
                style={buttonStyle}
                onClick={() => {
                  const lines = (data.content || '').split('\n').length;
                  alert(`Lines: ${lines} | Characters: ${(data.content || '').length}`);
                }}
              >
                📊 Stats
              </button>
            </div>

            <div>
              <label style={labelStyle}>HTML Code (Full HTML/CSS/JS supported)</label>
              <div style={{position: 'relative'}}>
                <textarea
                  value={data.content || ''}
                  onChange={(e) => updateData('content', e.target.value)}
                  placeholder={`<!-- Advanced HTML Editor -->
<!-- You can write full HTML, CSS, and JavaScript here -->
<!-- This editor is designed for AI integration -->

<div class="advanced-content">
  <h1>Advanced HTML Content</h1>
  <p>Write any HTML code here...</p>
  
  <!-- AI placeholders are supported -->
  <div data-ai-component="{{type}}" data-ai-prompt="{{prompt}}">
    <!-- AI will populate this -->
  </div>
</div>

<style>
  .advanced-content {
    /* Your custom CSS */
  }
</style>

<script>
  // Your custom JavaScript
  console.log('Advanced editor ready');
</script>`}
                  rows={20}
                  style={codeEditorStyle}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  fontSize: '12px',
                  color: '#9ca3af',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  Lines: {(data.content || '').split('\n').length} | Chars: {(data.content || '').length}
                </div>
              </div>
            </div>

            {/* HTML Preview */}
            {data.content && (
              <div style={{marginTop: '16px'}}>
                <h5 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600'}}>Live Preview:</h5>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: data.content }} />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Typography */}
      <div style={sectionStyle}>
        <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
          🎨 Typography
        </h4>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
          <div>
            <label style={labelStyle}>Font Family</label>
            <select
              value={data.fontFamily || 'inherit'}
              onChange={(e) => updateData('fontFamily', e.target.value)}
              style={inputStyle}
            >
              <option value="inherit">Default</option>
              <option value="'Inter', sans-serif">Inter (Modern)</option>
              <option value="'Roboto', sans-serif">Roboto (Clean)</option>
              <option value="'Open Sans', sans-serif">Open Sans (Friendly)</option>
              <option value="'Montserrat', sans-serif">Montserrat (Elegant)</option>
              <option value="'Poppins', sans-serif">Poppins (Rounded)</option>
              <option value="'Playfair Display', serif">Playfair (Elegant Serif)</option>
              <option value="'Merriweather', serif">Merriweather (Readable Serif)</option>
              <option value="'Lora', serif">Lora (Classic Serif)</option>
              <option value="Georgia, serif">Georgia (Traditional)</option>
              <option value="Arial, sans-serif">Arial (Universal)</option>
              <option value="'Courier New', monospace">Courier (Code)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Base Font Size</label>
            <select
              value={data.fontSize || '16px'}
              onChange={(e) => updateData('fontSize', e.target.value)}
              style={inputStyle}
            >
              <option value="12px">Small (12px)</option>
              <option value="14px">Medium (14px)</option>
              <option value="16px">Normal (16px)</option>
              <option value="18px">Large (18px)</option>
              <option value="20px">XL (20px)</option>
              <option value="24px">XXL (24px)</option>
            </select>
          </div>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px'}}>
          <div>
            <label style={labelStyle}>Line Height</label>
            <select
              value={data.lineHeight || '1.6'}
              onChange={(e) => updateData('lineHeight', e.target.value)}
              style={inputStyle}
            >
              <option value="1.2">Tight</option>
              <option value="1.4">Snug</option>
              <option value="1.6">Normal</option>
              <option value="1.8">Relaxed</option>
              <option value="2.0">Loose</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Font Weight</label>
            <select
              value={data.fontWeight || '400'}
              onChange={(e) => updateData('fontWeight', e.target.value)}
              style={inputStyle}
            >
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Letter Spacing</label>
            <select
              value={data.letterSpacing || 'normal'}
              onChange={(e) => updateData('letterSpacing', e.target.value)}
              style={inputStyle}
            >
              <option value="-0.05em">Tight</option>
              <option value="normal">Normal</option>
              <option value="0.05em">Wide</option>
              <option value="0.1em">Wider</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Alignment */}
      <div style={sectionStyle}>
        <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
          📐 Content Alignment
        </h4>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <div>
            <label style={labelStyle}>Text Alignment</label>
            <select
              value={data.textAlign || 'left'}
              onChange={(e) => updateData('textAlign', e.target.value)}
              style={inputStyle}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Container Alignment</label>
            <select
              value={data.containerAlign || 'left'}
              onChange={(e) => updateData('containerAlign', e.target.value)}
              style={inputStyle}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>
      </div>

      {/* Colors & Effects */}
      <div style={sectionStyle}>
        <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
          🌈 Colors & Effects
        </h4>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
          <div>
            <label style={labelStyle}>Text Color</label>
            <input
              type="color"
              value={data.textColor || '#000000'}
              onChange={(e) => updateData('textColor', e.target.value)}
              style={{...inputStyle, height: '40px'}}
            />
          </div>
          <div>
            <label style={labelStyle}>Background Color</label>
            <input
              type="color"
              value={data.backgroundColor || '#ffffff'}
              onChange={(e) => updateData('backgroundColor', e.target.value)}
              style={{...inputStyle, height: '40px'}}
            />
          </div>
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '8px'}}>
            <input
              type="checkbox"
              checked={data.textGradient ? true : false}
              onChange={(e) => updateData('textGradient', e.target.checked ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : null)}
            />
            Use Gradient Text
          </label>
          {data.textGradient && (
            <textarea
              value={data.textGradient}
              onChange={(e) => updateData('textGradient', e.target.value)}
              placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              rows={2}
              style={{...inputStyle, fontFamily: 'monospace', marginTop: '8px'}}
            />
          )}
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <div>
            <label style={labelStyle}>Text Shadow</label>
            <select
              value={data.textShadow || 'none'}
              onChange={(e) => updateData('textShadow', e.target.value)}
              style={inputStyle}
            >
              <option value="none">None</option>
              <option value="1px 1px 2px rgba(0,0,0,0.1)">Subtle</option>
              <option value="2px 2px 4px rgba(0,0,0,0.2)">Medium</option>
              <option value="4px 4px 8px rgba(0,0,0,0.3)">Strong</option>
              <option value="0 0 10px rgba(255,255,255,0.8)">Glow White</option>
              <option value="0 0 10px rgba(59,130,246,0.5)">Glow Blue</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Border</label>
            <select
              value={data.border || 'none'}
              onChange={(e) => updateData('border', e.target.value)}
              style={inputStyle}
            >
              <option value="none">None</option>
              <option value="1px solid #e5e7eb">Light Gray</option>
              <option value="2px solid #d1d5db">Medium Gray</option>
              <option value="3px solid #3b82f6">Blue</option>
              <option value="3px solid #ef4444">Red</option>
              <option value="3px solid #10b981">Green</option>
              <option value="2px dashed #6b7280">Dashed</option>
              <option value="4px double #374151">Double</option>
            </select>
          </div>
        </div>
      </div>

      {/* List Styling */}
      <div style={sectionStyle}>
        <h4 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px'}}>
          📋 List Styling
        </h4>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px'}}>
          <div>
            <label style={labelStyle}>List Style</label>
            <select
              value={data.listStyle || 'disc'}
              onChange={(e) => updateData('listStyle', e.target.value)}
              style={inputStyle}
            >
              <option value="disc">• Bullet</option>
              <option value="circle">○ Circle</option>
              <option value="square">■ Square</option>
              <option value="decimal">1. Numbers</option>
              <option value="lower-alpha">a. Letters</option>
              <option value="upper-roman">I. Roman</option>
              <option value="none">No Bullets</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>List Position</label>
            <select
              value={data.listPosition || 'outside'}
              onChange={(e) => updateData('listPosition', e.target.value)}
              style={inputStyle}
            >
              <option value="outside">Outside</option>
              <option value="inside">Inside</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>List Indent</label>
            <select
              value={data.listIndent || '20px'}
              onChange={(e) => updateData('listIndent', e.target.value)}
              style={inputStyle}
            >
              <option value="0px">No Indent</option>
              <option value="20px">Small</option>
              <option value="40px">Medium</option>
              <option value="60px">Large</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default RichTextControls;
