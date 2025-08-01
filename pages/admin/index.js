// pages/admin.js
import React, { useState, useEffect } from 'react';
import PeopleMentionsAdmin from '@/components/admin/PeopleMentionsAdmin';

const AdminPage = () => {
  const [sermons, setSermons] = useState([]);
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [peopleMentions, setPeopleMentions] = useState([]);

  useEffect(() => {
    // Fetch sermons from API (replace with your endpoint)
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => setSermons(data))
      .catch(err => console.error(err));
  }, []);

  const handleSelectSermon = (sermon) => {
    setSelectedSermon(sermon);
    // Fetch people mentions for this sermon (replace with your endpoint)
    fetch(`/api/people-mentions?video_id=${sermon.video_id}`)
      .then(res => res.json())
      .then(data => setPeopleMentions(data))
      .catch(err => console.error(err));
  };

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleSaveField = (field, value) => {
    const updatedSermon = { ...selectedSermon, [field]: value };
    // Save to API (replace with your endpoint)
    fetch('/api/update-sermon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSermon),
    })
      .then(() => {
        setSelectedSermon(updatedSermon);
        setEditingField(null);
      })
      .catch(err => console.error(err));
  };

  const handleApproveMention = (mentionId) => {
    // Approve mention API call (replace with your endpoint)
    fetch(`/api/approve-mention?id=${mentionId}`, { method: 'POST' })
      .then(() => {
        setPeopleMentions(peopleMentions.map(m => m._id === mentionId ? { ...m, approved: true } : m));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="sermon-list">
        <h2>Sermons</h2>
        <ul>
          {sermons.map(sermon => (
            <li key={sermon._id} onClick={() => handleSelectSermon(sermon)}>
              {sermon.title} ({sermon.author})
            </li>
          ))}
        </ul>
      </div>
      {selectedSermon && (
        <div className="sermon-details">
          <h2>Edit Sermon: {selectedSermon.title}</h2>
          <div className="metadata-field">
            <label>Title:</label>
            {editingField === 'title' ? (
              <input
                type="text"
                defaultValue={selectedSermon.title}
                onBlur={(e) => handleSaveField('title', e.target.value)}
              />
            ) : (
              <span onClick={() => handleEditField('title')}>{selectedSermon.title}</span>
            )}
          </div>
          <div className="metadata-field">
            <label>Author:</label>
            {editingField === 'author' ? (
              <input
                type="text"
                defaultValue={selectedSermon.author}
                onBlur={(e) => handleSaveField('author', e.target.value)}
              />
            ) : (
              <span onClick={() => handleEditField('author')}>{selectedSermon.author}</span>
            )}
          </div>
          <div className="metadata-field">
            <label>Description:</label>
            {editingField === 'description' ? (
              <textarea
                defaultValue={selectedSermon.description}
                onBlur={(e) => handleSaveField('description', e.target.value)}
              />
            ) : (
              <span onClick={() => handleEditField('description')}>{selectedSermon.description}</span>
            )}
          </div>
          {/* Add similar editable fields for other metadata like scriptures, sections, etc. */}
          <h3>People Mentions</h3>
          <ul>
            {peopleMentions.map(mention => (
              <li key={mention._id}>
                {mention.name} ({mention.mention_type}) - {mention.context}
                {!mention.approved && (
                  <button onClick={() => handleApproveMention(mention._id)}>Approve</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gallery People Mentions Admin Section */}
      <PeopleMentionsAdmin />
    </div>
  );
};

export default AdminPage;