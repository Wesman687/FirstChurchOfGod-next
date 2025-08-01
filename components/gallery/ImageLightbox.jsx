import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ImagePeopleMentions from './ImagePeopleMentions';
import AddPeopleMentions from './AddPeopleMentions';

function ImageLightbox({ image, onClose, onNext, onPrev, showNavigation = true }) {
  const [showMentions, setShowMentions] = useState(false);
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [mentions, setMentions] = useState([]);
  const user = useSelector(state => state.user);

  useEffect(() => {
    const fetchMentions = async () => {
      try {
        const response = await fetch(`/api/image-people-mentions?media_url=${encodeURIComponent(image.link)}`);
        if (response.ok) {
          const data = await response.json();
          setMentions(data);
        }
      } catch (error) {
        console.error('Error fetching people mentions:', error);
      }
    };

    if (image?.link) {
      fetchMentions();
    }
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept keys if user is typing in an input or textarea
      const isTyping = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      
      switch (e.key) {
        case 'Escape':
          if (!isTyping) {
            onClose();
          }
          break;
        case 'ArrowLeft':
          if (!isTyping && onPrev) onPrev();
          break;
        case 'ArrowRight':
          if (!isTyping && onNext) onNext();
          break;
        case ' ':
        case 'Enter':
          if (!isTyping && e.target === document.activeElement) {
            e.preventDefault();
            setShowMentions(true);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const focusableElements = document.querySelectorAll('.lightbox-content button, .lightbox-content [tabindex="0"]');
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onPrev, onNext]);

  if (!image) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="lightbox-close" 
          onClick={onClose}
          aria-label="Close lightbox"
          tabIndex={0}
        >
          ×
        </button>
        
        {showNavigation && onPrev && (
          <button 
            className="lightbox-nav lightbox-prev" 
            onClick={onPrev}
            aria-label="Previous image"
            tabIndex={0}
          >
            ‹
          </button>
        )}
        
        {showNavigation && onNext && (
          <button 
            className="lightbox-nav lightbox-next" 
            onClick={onNext}
            aria-label="Next image"
            tabIndex={0}
          >
            ›
          </button>
        )}
        
        <div className="lightbox-image-container">
          <img 
            src={image.link} 
            alt={image.desc || 'Gallery image'} 
            className="lightbox-image" 
          />
        </div>
        
        <div className="lightbox-info">
          <div className="lightbox-header">
            {image.desc && <h3 id="lightbox-title" className="lightbox-title">{image.desc}</h3>}
            {image.timeStamp && (
              <p className="lightbox-date">
                {new Date(image.timeStamp.seconds ? image.timeStamp.toDate() : image.timeStamp).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="lightbox-actions">
            <button 
              className="lightbox-mentions-btn"
              onClick={() => setShowMentions(true)}
              tabIndex={0}
              aria-label={`View people in photo (${mentions.length} people)`}
            >
              👥 People ({mentions.length})
            </button>
            
            {user.isMember && (
              <button 
                className="lightbox-add-people-btn"
                onClick={() => setShowAddPeople(true)}
                tabIndex={0}
                aria-label="Add people to this photo"
              >
                ➕ Add People
              </button>
            )}
            
            {image.gallery && (
              <span className="lightbox-category">{image.gallery}</span>
            )}
          </div>
          
          {mentions.length > 0 && (
            <div className="lightbox-people-preview">
              <p className="people-preview-label">People in photo:</p>
              <div className="people-tags" role="list">
                {mentions.slice(0, 3).map((mention, index) => (
                  <span key={index} className="people-tag" role="listitem">
                    {mention.name}
                  </span>
                ))}
                {mentions.length > 3 && (
                  <span className="people-tag more" role="listitem">+{mentions.length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showMentions && (
        <ImagePeopleMentions 
          imageUrl={image.link} 
          onClose={() => setShowMentions(false)} 
        />
      )}

      {/* Add People Mentions Modal */}
      {showAddPeople && (
        <AddPeopleMentions 
          image={image}
          onClose={() => setShowAddPeople(false)}
          onSuccess={() => {
            setShowAddPeople(false);
            // Refresh mentions
            const fetchMentions = async () => {
              try {
                const response = await fetch(`/api/image-people-mentions?media_url=${encodeURIComponent(image.link)}`);
                if (response.ok) {
                  const data = await response.json();
                  setMentions(data);
                }
              } catch (error) {
                console.error('Error fetching people mentions:', error);
              }
            };
            fetchMentions();
          }}
        />
      )}
    </div>
  );
}

export default ImageLightbox;
