

function ConfirmationModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className='modal-overlay-confirm'>
            <div className='modal-box-confirm confirmation-box' style={{ zIndex: 3000 }}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className='confirmation-modal-buttons'>
                    <button className='red-button' onClick={onConfirm}>Yes</button>
                    <button className='light-blue-button confirm-button' onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
