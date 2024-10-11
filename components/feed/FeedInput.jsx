import React, { useRef, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import GalleryIcon from '../icons/GalleryIcon';
import EmojiModal from '../modals/EmojiModal';
import PostConfirmationModal from '../modals/PostConfirmationModel';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import RingSpinner from '../RingSpinner';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';

function FeedInput({ user, comment, collapse }) {
    const [loading, setLoading] = useState(false)
    const [postContent, setPostContent] = useState('');
    const [image, setImage] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false); // State to control the confirmation modal
    const [uploadSuccess, setUploadSuccess] = useState(true); // To track whether the post was successful
    const [collapseInput, setCollapseInput] = useState(collapse || false)
    const filePickerRef = useRef(null);

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
        let downloadURL = null;
        setLoading(true);
    
        if (image) {
            const string = generateRandomStringWithDate();
            const imageRef = ref(storage, `post-images/${string}`);
            
            try {
                await uploadString(imageRef, image, "data_url");
                downloadURL = await getDownloadURL(imageRef);
            } catch (error) {
                console.error("Error uploading image:", error);
                setLoading(false);
                return;
            }
        }
    
        if (comment) { // Assuming 'comment' is the post ID for the comment section
            try {
                const docRef = doc(db, "posts", comment);
                const commentDetails = {
                    commentId: Date.now().toString(), 
                    username: user.email.split('@')[0],
                    name:  `${user.firstName} ${user.lastName}`,
                    timeStamp: Timestamp.now(),
                    owner: user.userRef,
                    photoUrl: user.photoUrl,
                    comment: postContent, // Ensure this contains the comment text
                    image: downloadURL || null,
                };
    
                await updateDoc(docRef, {
                    comments: arrayUnion(commentDetails)
                });                
                setUploadSuccess(true);
            } catch (error) {
                console.error("Error uploading comment:", error);
                setUploadSuccess(false);
            }
        } else {
            try {
                await addDoc(collection(db, 'posts'), {
                    image: downloadURL || null,
                    timeStamp: new Date(),
                    comment: postContent, // This should be the main post content
                    owner: user.userRef,
                    name: `${user.firstName} ${user.lastName}`,
                });
                setUploadSuccess(true);
            } catch (error) {
                console.error("Error uploading post:", error);
                setUploadSuccess(false);
            }
        }
        setLoading(false);
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
        <>
        {collapseInput ? <div className='feedinput-collapse-container click'  onClick={()=>{            
                setCollapseInput((prev)=> !prev)            
        }}><label className='click'><ChevronUpIcon classes={'xs-icon gap-12'} />{comment ? 'Comment' : 'Feed'}</label></div> :
        <div className='feedinput-container'><label onClick={()=>{            
                setCollapseInput((prev)=> !prev)            
        }} className='click'><ChevronDownIcon classes={'xs-icon gap-12'} />{comment ? 'Comment' : 'Feed'}</label>
             <div className='feedinput-wrapper'>
                <img src={user.photoUrl} className='feedinput-image' alt={'photo url'} />
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
                            <div className='feedinput-galleryicon' onClick={() => filePickerRef.current.click()}>
                                <GalleryIcon classes={'sm-icon click inputs-galleryicon'} />
                            </div>
                            <EmojiModal setPostContent={setPostContent} postContent={postContent} />
                            <input onChange={addImage} ref={filePickerRef} className="hidden" type="file" />
                        </div>
                        <button className='orange-btn click' onClick={handleAdd}>{comment ? 'Comment' : 'Post'}</button>
                    </div>
                </div>
            </div>

            {/* Show the confirmation modal */}
            <PostConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)} // Close the modal when the button is clicked
                success={uploadSuccess} // Conditionally show success or failure message
            />
        </div>}
        </>
    );
}

export default FeedInput;
