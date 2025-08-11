// components/cms/ImageSelector.jsx
import React, { useState } from 'react';
import ImageLibrary from './ImageLibrary';

const ImageSelector = ({ 
  value = '', 
  onChange, 
  label = 'Image URL',
  allowMultiple = false,
  placeholder = 'Enter image URL or click "Browse Images"'
}) => {
  const [showLibrary, setShowLibrary] = useState(false);

  const handleImageSelect = (selectedImages) => {
    if (allowMultiple) {
      // For multiple images, pass array of URLs
      const urls = Array.isArray(selectedImages) 
        ? selectedImages.map(img => img.url)
        : [selectedImages.url];
      onChange(urls);
    } else {
      // For single image, pass just the URL
      const url = Array.isArray(selectedImages) 
        ? selectedImages[0]?.url || ''
        : selectedImages?.url || '';
      onChange(url);
    }
  };

  const handleUrlChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="image-selector">
      <style jsx>{`
        .image-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .selector-row {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }
        
        .url-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .browse-btn {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
        }
        
        .browse-btn:hover {
          background: #2563eb;
        }
        
        .image-preview {
          margin-top: 8px;
          max-width: 200px;
          max-height: 120px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        
        .multiple-preview {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        
        .preview-item {
          position: relative;
        }
        
        .preview-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }
        
        .remove-btn {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }
      `}</style>

      {label && <label className="label">{label}</label>}
      
      <div className="selector-row">
        <input
          type="text"
          className="url-input"
          value={Array.isArray(value) ? value.join(', ') : value}
          onChange={handleUrlChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="browse-btn"
          onClick={() => setShowLibrary(true)}
        >
          Browse Images
        </button>
      </div>

      {/* Preview */}
      {value && !allowMultiple && typeof value === 'string' && (
        <img
          src={value}
          alt="Preview"
          className="image-preview"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      {allowMultiple && Array.isArray(value) && value.length > 0 && (
        <div className="multiple-preview">
          {value.map((url, index) => (
            <div key={index} className="preview-item">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <button
                className="remove-btn"
                onClick={() => {
                  const newValue = value.filter((_, i) => i !== index);
                  onChange(newValue);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <ImageLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={handleImageSelect}
        allowMultiple={allowMultiple}
      />
    </div>
  );
};

export default ImageSelector;
