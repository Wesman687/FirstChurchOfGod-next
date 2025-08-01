import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PeopleMentionsInput from './PeopleMentionsInput';

function AddPeopleMentions({ image, onClose, onSuccess }) {
  const [peopleMentions, setPeopleMentions] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user);

  const handleSubmit = async () => {
    if (peopleMentions.length === 0) {
      toast.warning('Please add at least one person before submitting.');
      return;
    }

    setLoading(true);

    try {
      const promises = peopleMentions.map(mention =>
        fetch('/api/pending-people-mentions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: mention.name,
            context: mention.context || '',
            media_url: image.link,
            date: new Date().toISOString(),
            user_is_admin: user.isAdmin,
            added_by: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || 'member'
          })
        })
      );

      const results = await Promise.all(promises);
      
      // Check if any were approved (admin submissions)
      const responses = await Promise.all(results.map(r => r.json()));
      const anyApproved = responses.some(r => r.approved);

      if (user.isAdmin || anyApproved) {
        toast.success('People added to photo successfully!');
      } else {
        toast.success('People mentions submitted for approval!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error adding people mentions:', error);
      toast.error('Error adding people mentions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-people-modal-overlay" onClick={onClose}>
      <div className="add-people-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-people-header">
          <h3>Add People to Photo</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="add-people-body">
          <div className="image-preview">
            <img src={image.link} alt="Photo to tag" className="tag-image-preview" />
          </div>

          <div className="people-form">
            <p className="form-instructions">
              {user.isAdmin 
                ? 'Add people who appear in this photo. Your additions will be visible immediately.'
                : 'Add people who appear in this photo. Your suggestions will be reviewed by an admin before appearing.'
              }
            </p>

            <PeopleMentionsInput
              peopleMentions={peopleMentions}
              onPeopleMentionsChange={setPeopleMentions}
            />

            <div className="add-people-actions">
              <button
                className="submit-people-btn"
                onClick={handleSubmit}
                disabled={loading || peopleMentions.length === 0}
              >
                {loading ? 'Submitting...' : user.isAdmin ? 'Add People' : 'Submit for Approval'}
              </button>
              <button
                className="cancel-people-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>

            {!user.isAdmin && peopleMentions.length > 0 && (
              <p className="approval-notice">
                📝 Your people mentions will be reviewed by an admin before appearing in the gallery.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPeopleMentions;
