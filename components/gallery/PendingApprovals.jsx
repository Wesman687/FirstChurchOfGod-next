import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function PendingApprovals() {
  const [pendingUploads, setPendingUploads] = useState([]);
  const [pendingMentions, setPendingMentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('uploads');
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (user.isAdmin) {
      fetchPendingItems();
    }
  }, [user.isAdmin]);

  const fetchPendingItems = async () => {
    try {
      // Fetch pending uploads
      const uploadsResponse = await fetch('/api/pending-uploads');
      if (uploadsResponse.ok) {
        const uploads = await uploadsResponse.json();
        setPendingUploads(uploads);
      }

      // Fetch pending people mentions using new API
      const mentionsResponse = await fetch('/api/pending-people-mentions');
      if (mentionsResponse.ok) {
        const mentions = await mentionsResponse.json();
        setPendingMentions(mentions);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      toast.error('Error loading pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const approveUpload = async (upload) => {
    try {
      const response = await fetch('/api/pending-uploads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: upload._id,
          action: 'approve'
        })
      });

      if (response.ok) {
        toast.success('Upload approved successfully!');
        fetchPendingItems(); // Refresh the list
      } else {
        throw new Error('Failed to approve upload');
      }
    } catch (error) {
      console.error('Error approving upload:', error);
      toast.error('Error approving upload');
    }
  };

  const rejectUpload = async (upload) => {
    try {
      const response = await fetch('/api/pending-uploads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: upload._id })
      });

      if (response.ok) {
        toast.success('Upload rejected');
        fetchPendingItems(); // Refresh the list
      } else {
        throw new Error('Failed to reject upload');
      }
    } catch (error) {
      console.error('Error rejecting upload:', error);
      toast.error('Error rejecting upload');
    }
  };

  const approveMention = async (mention) => {
    try {
      console.log('Approving mention with ID:', mention._id);
      
      const response = await fetch('/api/pending-people-mentions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: mention._id,
          action: 'approve'
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response data:', responseData);

      if (response.ok) {
        toast.success('People mention approved!');
        fetchPendingItems(); // Refresh the list
      } else {
        console.error('API Error:', responseData);
        throw new Error(`Failed to approve mention: ${responseData}`);
      }
    } catch (error) {
      console.error('Error approving mention:', error);
      toast.error('Error approving mention');
    }
  };

  const rejectMention = async (mention) => {
    try {
      const response = await fetch('/api/pending-people-mentions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: mention._id,
          action: 'reject'
        })
      });

      if (response.ok) {
        toast.success('People mention rejected');
        fetchPendingItems(); // Refresh the list
      } else {
        throw new Error('Failed to reject mention');
      }
    } catch (error) {
      console.error('Error rejecting mention:', error);
      toast.error('Error rejecting mention');
    }
  };

  if (!user.isAdmin) {
    return (
      <div className="pending-approvals-unauthorized">
        <h3>Access Denied</h3>
        <p>Only administrators can access pending approvals.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pending-approvals-loading">
        <p>Loading pending approvals...</p>
      </div>
    );
  }

  return (
    <div className="pending-approvals">
      <h3>Pending Approvals</h3>
      
      <div className="approval-tabs">
        <button
          className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploads')}
        >
          Photo Uploads ({pendingUploads.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'mentions' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentions')}
        >
          People Mentions ({pendingMentions.length})
        </button>
      </div>

      <div className="approval-content">
        {activeTab === 'uploads' && (
          <div className="pending-uploads">
            {pendingUploads.length === 0 ? (
              <p className="no-pending">No pending photo uploads.</p>
            ) : (
              <div className="uploads-grid">
                {pendingUploads.map((upload) => (
                  <div key={upload._id} className="pending-upload-card">
                    <div className="upload-image">
                      <img src={upload.imageUrl} alt="Pending upload" />
                    </div>
                    <div className="upload-details">
                      <h4>{upload.description || 'No description'}</h4>
                      <p className="upload-meta">
                        Uploaded by: {upload.uploadedBy?.name || 'Unknown'}<br/>
                        Date: {new Date(upload.uploadedAt).toLocaleDateString()}
                      </p>
                      {upload.peopleMentions && upload.peopleMentions.length > 0 && (
                        <div className="pending-people">
                          <strong>People:</strong>
                          <div className="people-tags">
                            {upload.peopleMentions.map((mention, index) => (
                              <span key={index} className="people-tag">
                                {mention.name}
                                {mention.context && ` (${mention.context})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="upload-actions">
                        <button
                          className="approve-btn"
                          onClick={() => approveUpload(upload)}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => rejectUpload(upload)}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mentions' && (
          <div className="pending-mentions">
            {pendingMentions.length === 0 ? (
              <p className="no-pending">No pending people mentions.</p>
            ) : (
              <div className="mentions-list">
                {pendingMentions.map((mention) => (
                  <div key={mention._id} className="pending-mention-card">
                    <div className="mention-image">
                      <img src={mention.media_url} alt="Image with pending mention" />
                    </div>
                    <div className="mention-details">
                      <h4>Person: {mention.name}</h4>
                      {mention.context && (
                        <p className="mention-context">Context: {mention.context}</p>
                      )}
                      <p className="mention-meta">
                        Added by: {mention.added_by || 'Unknown'}<br/>
                        Date: {new Date(mention.date).toLocaleDateString()}
                      </p>
                      <div className="mention-actions">
                        <button
                          className="approve-btn"
                          onClick={() => approveMention(mention)}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => rejectMention(mention)}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingApprovals;
