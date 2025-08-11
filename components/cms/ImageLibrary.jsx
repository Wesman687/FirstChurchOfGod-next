// components/cms/ImageLibrary.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ImageLibrary = ({ isOpen, onClose, onSelect, allowMultiple = false }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen && user?.uid) {
      fetchImages();
    }
  }, [isOpen, user?.uid]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/upload/list?userId=${user.uid}`);
      const data = await response.json();
      if (data.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (files) => {
    if (!user?.uid) return;
    
    setUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('userId', user.uid);

    try {
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (result.success) {
        fetchImages(); // Refresh the list
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const toggleImageSelection = (image) => {
    if (allowMultiple) {
      setSelectedImages(prev => {
        const isSelected = prev.find(img => img.id === image.id);
        if (isSelected) {
          return prev.filter(img => img.id !== image.id);
        } else {
          return [...prev, image];
        }
      });
    } else {
      setSelectedImages([image]);
    }
  };

  const handleSelect = () => {
    if (allowMultiple) {
      onSelect(selectedImages);
    } else {
      onSelect(selectedImages[0]);
    }
    onClose();
  };

  const deleteImage = async (image) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          imageId: image.id,
          storagePath: image.storagePath || image.url, // Fallback to URL if no storagePath
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Remove the image from the local state immediately for better UX
        setImages(prevImages => prevImages.filter(img => img.id !== image.id));
        // Also refresh from server to be sure
        fetchImages();
      } else {
        console.error('Delete failed:', result.error);
        alert('Failed to delete image: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="image-library-overlay">
      <style jsx>{`
        .image-library-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .image-library {
          background: white;
          border-radius: 12px;
          width: 90vw;
          max-width: 1000px;
          height: 80vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }
        
        .library-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .library-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .upload-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .upload-btn:hover {
          background: #2563eb;
        }
        
        .close-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .close-btn:hover {
          background: #dc2626;
        }
        
        .close-x-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          color: #6b7280;
          transition: all 0.2s;
        }
        
        .close-x-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }
        
        .library-content {
          flex: 1;
          overflow: auto;
          padding: 20px;
        }
        
        .upload-zone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          margin-bottom: 24px;
          transition: border-color 0.2s;
        }
        
        .upload-zone.drag-over {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        
        .upload-text {
          color: #6b7280;
          margin-bottom: 16px;
        }
        
        .upload-input {
          display: none;
        }
        
        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .image-item {
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        
        .image-item:hover {
          border-color: #e2e8f0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .image-item.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px #3b82f6;
        }
        
        .image-preview {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        .image-info {
          padding: 12px;
        }
        
        .image-name {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
          word-break: break-word;
        }
        
        .image-meta {
          font-size: 11px;
          color: #6b7280;
        }
        
        .image-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .image-item:hover .image-actions {
          opacity: 1;
        }
        
        .action-btn {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .delete-btn {
          background: #ef4444;
          color: white;
        }
        
        .library-footer {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .selected-count {
          color: #6b7280;
          font-size: 14px;
        }
        
        .footer-actions {
          display: flex;
          gap: 12px;
        }
        
        .select-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .select-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
        
        .uploading {
          background: #f59e0b;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
        }
      `}</style>

      <div className="image-library">
        <button className="close-x-btn" onClick={onClose} title="Close">
          ×
        </button>
        
        <div className="library-header">
          <h2 className="library-title">Image Library</h2>
          <div className="header-actions">
            {uploading && <div className="uploading">Uploading...</div>}
            <label className="upload-btn">
              Browse Images
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="upload-input"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>

        <div className="library-content">
          {/* Upload Zone */}
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <div className="upload-text">
              Drag and drop images here, or click here to browse
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              Supports: JPG, PNG, GIF, WebP
            </div>
          </div>

          {/* Images Grid */}
          {loading ? (
            <div className="loading">Loading images...</div>
          ) : (
            <div className="images-grid">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`image-item ${selectedImages.find(img => img.id === image.id) ? 'selected' : ''}`}
                  onClick={() => toggleImageSelection(image)}
                >
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={image.alt || image.filename}
                    className="image-preview"
                  />
                  <div className="image-info">
                    <div className="image-name">{image.filename}</div>
                    <div className="image-meta">
                      {image.dimensions?.width}×{image.dimensions?.height} • {Math.round(image.size / 1024)}KB
                    </div>
                  </div>
                  <div className="image-actions">
                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(image);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="library-footer">
          <div className="selected-count">
            {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
          </div>
          <div className="footer-actions">
            <button className="close-btn" onClick={onClose}>Cancel</button>
            <button
              className="select-btn"
              disabled={selectedImages.length === 0}
              onClick={handleSelect}
            >
              {allowMultiple ? 'Select Images' : 'Select Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLibrary;
