import React, { useState, useEffect } from 'react';

function ImagePeopleMentions({ imageUrl, onClose }) {
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/image-people-mentions?media_url=${encodeURIComponent(imageUrl)}`);
        if (response.ok) {
          const data = await response.json();
          setMentions(data);
        }
      } catch (error) {
        console.error('Error fetching people mentions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (imageUrl) {
      fetchMentions();
    }
  }, [imageUrl]);

  if (loading) {
    return (
      <div className="image-mentions-modal">
        <div className="mentions-content">
          <div className="mentions-header">
            <h3>People in this Photo</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="mentions-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-mentions-modal" onClick={onClose}>
      <div className="mentions-content" onClick={(e) => e.stopPropagation()}>
        <div className="mentions-header">
          <h3>People in this Photo</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="mentions-body">
          {mentions.length > 0 ? (
            <ul className="mentions-list">
              {mentions.map((mention, index) => (
                <li key={mention._id || index} className="mention-item">
                  <strong>{mention.name}</strong>
                  {mention.context && <span className="mention-context"> - {mention.context}</span>}
                  {mention.date && (
                    <span className="mention-date">
                      {new Date(mention.date).toLocaleDateString()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-mentions">No people tagged in this photo yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImagePeopleMentions;
