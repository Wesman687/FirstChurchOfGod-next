function ErrorModal({ title, message, onClose }) {
    return (
        <div className='modal-overlay-confirm'>
            <div className='modal-box-confirm confirmation-box'>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className='confirmation-modal-buttons'>
                    <button className='red-button' onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ErrorModal;
