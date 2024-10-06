import React from 'react';

function PostConfirmationModal({ isOpen, onClose, success }) {
    if (!isOpen) return null; // If the modal is not open, return null

    return (
        <div className='modal-overlay-confirm'>
            <div className='modal-box-confirm confirmation-box'>
                <h3>{success ? 'Success!' : 'Error'}</h3>
                <p>{success ? 'Your Post has been posted.' : 'Post not uploaded, try again.'}</p>
                <div className='confirmation-modal-buttons'>
                    <button className='red-button' onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostConfirmationModal;
