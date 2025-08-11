import React from 'react';

export function ContentBlock({ data = {} }) {
  const containerStyles = {
    padding: data.padding || '40px 20px',
    backgroundColor: data.backgroundColor || 'transparent',
    minHeight: data.minHeight || 'auto'
  };

  const contentStyles = {
    maxWidth: data.maxWidth || '1200px',
    margin: '0 auto',
    textAlign: data.textAlign || 'left'
  };

  const renderContentItem = (item) => {
    const itemStyles = {
      textAlign: item.alignment || 'left',
      marginTop: item.marginTop || '16px',
      marginBottom: item.marginBottom || '16px',
      color: item.color || '#333333'
    };

    switch (item.type) {
      case 'heading':
        return React.createElement(item.level || 'h2', {
          key: item.id,
          style: {
            ...itemStyles,
            fontSize: item.fontSize || '32px',
            fontWeight: item.fontWeight || '600',
            margin: 0,
            marginTop: item.marginTop || '16px',
            marginBottom: item.marginBottom || '16px'
          }
        }, item.content || '');

      case 'paragraph':
        return (
          <div
            key={item.id}
            style={{
              ...itemStyles,
              fontSize: item.fontSize || '16px',
              fontWeight: item.fontWeight || '400',
              lineHeight: '1.6'
            }}
            dangerouslySetInnerHTML={{ __html: item.content || '' }}
          />
        );

      case 'image':
        return item.content ? (
          <div key={item.id} style={{ ...itemStyles, display: 'inline-block' }}>
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
        ) : null;

      case 'quote':
        return (
          <blockquote
            key={item.id}
            style={{
              ...itemStyles,
              borderLeft: '4px solid #3b82f6',
              paddingLeft: '20px',
              margin: '20px 0',
              fontStyle: 'italic',
              fontSize: item.fontSize || '18px',
              fontWeight: item.fontWeight || '400'
            }}
          >
            {item.content || ''}
          </blockquote>
        );

      case 'list':
        return item.content ? React.createElement(item.listType === 'ordered' ? 'ol' : 'ul', {
          key: item.id,
          style: {
            ...itemStyles,
            paddingLeft: '20px',
            fontSize: item.fontSize || '16px',
            fontWeight: item.fontWeight || '400'
          }
        }, item.content.split('\n').filter(line => line.trim()).map((line, index) => (
          React.createElement('li', { key: index, style: { marginBottom: '8px' } }, line.trim())
        ))) : null;

      case 'table':
        if (!item.content) return null;
        
        let tableData;
        try {
          tableData = JSON.parse(item.content);
        } catch {
          return null;
        }

        return (
          <table
            key={item.id}
            style={{
              ...itemStyles,
              width: '100%',
              borderCollapse: 'collapse',
              margin: '20px 0',
              fontSize: item.fontSize || '14px',
              fontWeight: item.fontWeight || '400'
            }}
          >
            <thead>
              <tr>
                {tableData.headers?.map((header, index) => (
                  <th key={index} style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
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
                      border: '1px solid #ddd',
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

      case 'divider':
        return (
          <hr
            key={item.id}
            style={{
              border: 'none',
              borderTop: `${item.thickness || '2px'} ${item.dividerStyle || 'solid'} #e5e7eb`,
              margin: '40px 0',
              width: '100%'
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <section style={containerStyles}>
      <div style={contentStyles}>
        {data.contentItems && data.contentItems.length > 0 ? (
          data.contentItems.map(renderContentItem)
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📝</div>
            <h3 style={{fontSize: '18px', fontWeight: '500', margin: '0 0 8px 0'}}>
              No content added
            </h3>
            <p style={{margin: 0}}>Add content items to see them here</p>
          </div>
        )}
      </div>
    </section>
  );
}
