import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import GalleryIcon from '../icons/GalleryIcon'
import EmojiPicker from 'emoji-picker-react';
import { Modal } from '@mui/material';
import EmojiModal from '../modals/EmojiModal';

function FeedInput() {
    const [postContent, setPostContent] = useState('');
    const user = useSelector(state => state.user)

    


    return (
        <div className='feedinput-container'>Feed
            <div className='feedinput-wrapper'>
                <img src={user.photoUrl} className='feedinput-image' alt='Picture of yourself' />
                <div className='feedinput-input-wrapper'>
                    <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder='Whats on your mind?' className='postfeed-input' />
                    <div className='feedinput-input-buttons-wrapper'>
                        <div className='feedinput-icons-container'>
                        <GalleryIcon classes={'sm-icon click inputs-galleryicon'} />
                        <EmojiModal setPostContent={setPostContent} postContent={postContent}/>
                        </div>
                        
                        
                        <button className='light-blue-button'>Post</button>
                    </div>

                </div>
            </div>
            
        </div>
    )
}

export default FeedInput