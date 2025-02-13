import { closeEmojiModal, openEmojiModal } from '@/redux/modalSlice'
import { Modal } from '@mui/material'
import EmojiPicker from 'emoji-picker-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import XIcon from '../icons/XIcon'

function EmojiModal({postContent, setPostContent}) {
    const dispatch = useDispatch()
    const isOpen = useSelector(state => state.modals.emojiModalOpen)
    const onEmojiClick = (event, emojiData) => {
          setPostContent(postContent + event.emoji); // Safely access the emoji
        
      };
    return (
        <>
            <label className='emoji-button click' onClick={() => dispatch(openEmojiModal())}>😊</label>
            
                <Modal open={isOpen} onClose={() => dispatch(closeEmojiModal())}>
                <div className="emoji-container">
                    <div
                        className="resizable-modal"
                    >
                        <div className="close-icon" onClick={() => dispatch(closeEmojiModal())}>
              <XIcon classes="close-icon-svg" /> {/* Close icon */}
            </div>
                        <EmojiPicker onEmojiClick={onEmojiClick}  searchDisabled={true} />
                    </div>
                    </div>
                </Modal>
        </>
    )
}

export default EmojiModal