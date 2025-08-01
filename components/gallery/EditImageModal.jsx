import React, { useState, useEffect } from 'react';
import PeopleMentionsInput from './PeopleMentionsInput';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

function EditImageModal({ image, onClose, onUpdate }) {
  const [desc, setDesc] = useState(image?.desc || '');
  const [gallery, setGallery] = useState(image?.gallery || '');
  const [peopleMentions, setPeopleMentions] = useState([]);
  const [existingMentions, setExistingMentions] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExistingMentions = async () => {
      try {
        const response = await fetch(`/api/image-people-mentions?media_url=${encodeURIComponent(image.link)}`);
        if (response.ok) {
          const mentions = await response.json();
          setExistingMentions(mentions);
          setPeopleMentions(mentions.map(m => ({ name: m.name, context: m.context || '' })));
        }
      } catch (error) {
        console.error('Error fetching existing mentions:', error);
      }
    };

    const fetchFilters = async () => {
      try {
        // This would need to be implemented to fetch available gallery filters
        // For now, using a default set
        setFilters(['Events', 'Worship', 'Community', 'Youth', 'Other']);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    if (image) {
      fetchExistingMentions();
      fetchFilters();
    }
  }, [image]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update image document in Firestore
      if (!image.id) {
        throw new Error('Image ID is missing');
      }

      const imageRef = doc(db, 'images', image.id);
      await updateDoc(imageRef, {
        desc,
        gallery
      });

      // Delete existing mentions and add new ones
      const deletePromises = existingMentions.map(mention => 
        fetch(`/api/image-people-mentions?id=${mention._id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);

      // Add new mentions
      if (peopleMentions && peopleMentions.length > 0) {
        const addPromises = peopleMentions.map(mention => 
          fetch('/api/image-people-mentions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: mention.name,
              context: mention.context,
              media_url: image.link,
              date: new Date().toISOString(),
              approved: true // Admin edits are auto-approved
            })
          })
        );
        await Promise.all(addPromises);
      }

      toast.success('Image updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error(`Error updating image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!image) return null;

  return (
    <div className="edit-image-modal-overlay" onClick={onClose}>
      <div className="edit-image-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h3>Edit Image</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="edit-modal-body">
          <div className="image-preview">
            <img src={image.link} alt="Preview" className="edit-image-preview" />
          </div>

          <div className="edit-form">
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Image description"
                className="edit-textarea"
              />
            </div>

            <div className="form-group">
              <label>Gallery:</label>
              <select
                value={gallery}
                onChange={(e) => setGallery(e.target.value)}
                className="edit-select"
              >
                {filters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>

            <PeopleMentionsInput
              peopleMentions={peopleMentions}
              onPeopleMentionsChange={setPeopleMentions}
            />
          </div>
        </div>

        <div className="edit-modal-footer">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditImageModal;
