import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { storage } from '@/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import PeopleMentionsInput from './PeopleMentionsInput';

function PublicImageUpload() {
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState('');
  const [peopleMentions, setPeopleMentions] = useState([]);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const user = useSelector(state => state.user);

  const addImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.addEventListener("load", e => {
      setImage(e.target.result);
    });
  };

  const generateRandomStringWithDate = () => {
    const now = new Date();
    const timestamp = now.getTime();
    const randomPart = Math.random().toString(36).substr(2, 6);
    return `public_upload_${timestamp}_${randomPart}`;
  };

  const handleSubmit = async () => {
    if (!user.isMember && !user.isAdmin) {
      toast.warning('Only members can upload photos. Please sign up first.');
      return;
    }

    if (!image) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);

    try {
      const string = generateRandomStringWithDate();
      
      if (user.isAdmin) {
        // Admin uploads go directly to the gallery
        const imageRef = ref(storage, `images/${string}`);
        await uploadString(imageRef, image, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // Add directly to gallery collection
        const response = await fetch('/api/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            link: downloadURL,
            desc: desc,
            gallery: 'Events', // Default gallery for admin uploads
            timeStamp: new Date(),
            uploadedBy: user.uid
          })
        });

        if (response.ok) {
          // Add people mentions if any
          if (peopleMentions && peopleMentions.length > 0) {
            const mentionPromises = peopleMentions.map(mention => 
              fetch('/api/image-people-mentions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: mention.name,
                  context: mention.context,
                  media_url: downloadURL,
                  date: new Date().toISOString(),
                  approved: true
                })
              })
            );
            await Promise.all(mentionPromises);
          }

          toast.success('Photo uploaded successfully!');
        } else {
          throw new Error('Failed to upload photo');
        }
      } else {
        // Member uploads go to pending approval
        const imageRef = ref(storage, `pending-images/${string}`);
        await uploadString(imageRef, image, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // Submit to pending approval API
        const response = await fetch('/api/pending-uploads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: downloadURL,
            description: desc,
            peopleMentions,
            uploadedBy: {
              uid: user.uid,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email
            },
            uploadedAt: new Date().toISOString()
          })
        });

        if (response.ok) {
          toast.success('Photo submitted for approval! It will appear in the gallery once approved by an admin.');
        } else {
          throw new Error('Failed to submit photo');
        }
      }

      // Reset form
      setImage(null);
      setDesc('');
      setPeopleMentions([]);
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error uploading photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user.isMember && !user.isAdmin) {
    return (
      <div className="public-upload-disabled">
        <h3>Photo Upload</h3>
        <p>Only church members can upload photos. Please sign up to become a member first.</p>
      </div>
    );
  }

  return (
    <div className="public-image-upload">
      <h3>{user.isAdmin ? 'Upload Photos' : 'Share Your Photos'}</h3>
      <p className="upload-instructions">
        {user.isAdmin 
          ? 'Upload photos directly to the gallery. Add people mentions to help others find photos.'
          : 'Upload photos from church events and activities. All photos will be reviewed before appearing in the gallery.'
        }
      </p>

      <div className="upload-container">
        {image ? (
          <div className="image-preview-container">
            <img src={image} alt="Preview" className="upload-preview" />
            <button 
              className="change-image-btn"
              onClick={() => filePickerRef.current.click()}
            >
              Change Photo
            </button>
          </div>
        ) : (
          <div className="upload-area" onClick={() => filePickerRef.current.click()}>
            <div className="upload-placeholder">
              <span className="upload-icon">📷</span>
              <p>Click to select a photo</p>
              <p className="upload-hint">Recommended: 2400 x 1200 or higher</p>
            </div>
          </div>
        )}

        <input
          ref={filePickerRef}
          type="file"
          accept="image/*"
          onChange={addImage}
          className="hidden"
        />

        {image && (
          <div className="upload-form">
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe what's happening in this photo..."
                className="upload-textarea"
              />
            </div>

            <PeopleMentionsInput
              peopleMentions={peopleMentions}
              onPeopleMentionsChange={setPeopleMentions}
            />

            <div className="upload-actions">
              <button
                className="submit-upload-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Uploading...' : user.isAdmin ? 'Upload Photo' : 'Submit for Approval'}
              </button>
              <button
                className="cancel-upload-btn"
                onClick={() => {
                  setImage(null);
                  setDesc('');
                  setPeopleMentions([]);
                }}
              >
                Cancel
              </button>
            </div>

            {!user.isAdmin && (
              <p className="approval-notice">
                📝 Your photo will be reviewed by an admin before appearing in the gallery.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicImageUpload;
