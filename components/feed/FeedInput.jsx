import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import GalleryIcon from '../icons/GalleryIcon';
import EmojiModal from '../modals/EmojiModal';
import PostConfirmationModal from '../modals/PostConfirmationModel';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import RingSpinner from '../RingSpinner';

function FeedInput() {
    const [loading, setLoading] = useState(false)
    const [postContent, setPostContent] = useState('');
    const [image, setImage] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false); // State to control the confirmation modal
    const [uploadSuccess, setUploadSuccess] = useState(true); // To track whether the post was successful
    const filePickerRef = useRef(null);
    const user = useSelector(state => state.user);

    function addImage(e) {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.addEventListener("load", e => {
            setImage(e.target.result);
        });
    }

    async function handleAdd() {
        let downloadURL;
        setLoading(true)
        try {
            if (image) {
                const string = generateRandomStringWithDate();
                const imageRef = await ref(storage, `post-images/${string}`);
                const uploadImage = await uploadString(imageRef, image, "data_url");
                downloadURL = await getDownloadURL(imageRef);
            }
            await addDoc(collection(db, 'posts'), {
                image: downloadURL || null,
                timeStamp: new Date(),
                comment: postContent,
                owner: user.userRef,
            });
            setUploadSuccess(true);
        } catch (error) {
            console.error("Error uploading post:", error);
            setUploadSuccess(false);
        }
        setLoading(false)
        setShowConfirmation(true);
        setImage(null);
        setPostContent('');
    }

    function generateRandomStringWithDate() {
        const now = new Date();
        const timestamp = now.getTime(); // Get milliseconds since epoch
        const randomPart = Math.random().toString(36).substr(2, 6); // Generate random string
        return `image_${timestamp}_${randomPart}`;
    }

    return (
        <div className='feedinput-container'>Feed
            <div className='feedinput-wrapper'>
                <img src={user.photoUrl} className='feedinput-image' alt='Picture of yourself' />
                <div className='feedinput-input-wrapper'>
                    <div className="feedinput-textandimage-wrapper">
                        {loading ? (
                            <RingSpinner />
                        ) : (
                            <>
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder='Whats on your mind?'
                                    className='postfeed-input'
                                />
                                {image && (
                                    <figure className='feedinput-uploadimage-wrapper'>
                                        <div
                                            className='feeedinput-addimage-wrapper'
                                            onClick={() => filePickerRef.current.click()}
                                        >
                                            <img src={image} alt={'new image'} className='feedinput-uploadimage' />
                                            <input
                                                onChange={addImage}
                                                ref={filePickerRef}
                                                className="hidden"
                                                type="file"
                                            />
                                        </div>
                                    </figure>
                                )}
                            </>
                        )}
                    </div>

                    <div className='feedinput-input-buttons-wrapper'>
                        <div className='feedinput-icons-container'>
                            <div className='' onClick={() => filePickerRef.current.click()}>
                                <GalleryIcon classes={'sm-icon click inputs-galleryicon'} />
                            </div>
                            <EmojiModal setPostContent={setPostContent} postContent={postContent} />
                            <input onChange={addImage} ref={filePickerRef} className="hidden" type="file" />
                        </div>
                        <button className='light-blue-button' onClick={handleAdd}>Post</button>
                    </div>
                </div>
            </div>

            {/* Show the confirmation modal */}
            <PostConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)} // Close the modal when the button is clicked
                success={uploadSuccess} // Conditionally show success or failure message
            />
        </div>
    );
}

export default FeedInput;
