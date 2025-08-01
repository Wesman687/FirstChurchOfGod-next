import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PeopleMentionsAdmin() {
  const [unapprovedMentions, setUnapprovedMentions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnapprovedMentions();
  }, []);

  const fetchUnapprovedMentions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/unapproved-mentions');
      if (response.ok) {
        const data = await response.json();
        setUnapprovedMentions(data);
      }
    } catch (error) {
      console.error('Error fetching unapproved mentions:', error);
      toast.error('Error fetching pending mentions');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMention = async (mentionId) => {
    try {
      const response = await fetch(`/api/approve-mention?id=${mentionId}`, { 
        method: 'POST' 
      });
      
      if (response.ok) {
        setUnapprovedMentions(prev => prev.filter(m => m._id !== mentionId));
        toast.success('Mention approved successfully');
      } else {
        throw new Error('Failed to approve mention');
      }
    } catch (error) {
      console.error('Error approving mention:', error);
      toast.error('Error approving mention');
    }
  };

  const handleRejectMention = async (mentionId) => {
    try {
      const response = await fetch(`/api/image-people-mentions?id=${mentionId}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        setUnapprovedMentions(prev => prev.filter(m => m._id !== mentionId));
        toast.success('Mention rejected and deleted');
      } else {
        throw new Error('Failed to reject mention');
      }
    } catch (error) {
      console.error('Error rejecting mention:', error);
      toast.error('Error rejecting mention');
    }
  };

  if (loading) {
    return <div className="admin-section-loading">Loading pending mentions...</div>;
  }

  return (
    <div className="people-mentions-admin">
      <h3>Pending People Mentions Approval</h3>
      
      {unapprovedMentions.length === 0 ? (
        <p className="no-pending-mentions">No pending mentions for approval.</p>
      ) : (
        <div className="mentions-approval-list">
          {unapprovedMentions.map(mention => (
            <div key={mention._id} className="mention-approval-item">
              <div className="mention-info">
                <div className="mention-details">
                  <strong>{mention.name}</strong>
                  {mention.context && <span className="mention-context"> - {mention.context}</span>}
                  <div className="mention-meta">
                    <span className="mention-date">
                      {new Date(mention.date).toLocaleDateString()}
                    </span>
                    <span className="mention-type">{mention.mention_type}</span>
                  </div>
                </div>
                
                {mention.media_url && (
                  <div className="mention-image-preview">
                    <img 
                      src={mention.media_url} 
                      alt="Preview" 
                      className="mention-preview-img"
                    />
                  </div>
                )}
              </div>
              
              <div className="mention-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApproveMention(mention._id)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleRejectMention(mention._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeopleMentionsAdmin;
