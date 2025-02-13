import React, { useEffect, useRef, useState } from 'react'
import XIcon from '../icons/XIcon';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { generateRandomStringWithDate } from '../functions/Functions';
import RingSpinner from '../RingSpinner';

function PostInfo({ post, edit, setEdit, postComment, postId  }) {
    const [comment, setComment] = useState(post.comment || '')
    const [image, setImage] = useState(post.image || null)
    const [newImage, setNewImage] = useState(false)
    const filePickerRef = useRef(null);
    const textareaRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to calculate full height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
        }
    };
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
        let imageRef
        setLoading(true)
        if (image && image !== post.image) {
            if (newImage) {
                const string = generateRandomStringWithDate();
                imageRef = ref(storage, `post-images/${string}`);
            } else {
                imageRef = ref(storage, `post-images/${post.image}`);
            }
    
            try {
                // Upload the image and get the download URL
                await uploadString(imageRef, image, "data_url");
                downloadURL = await getDownloadURL(imageRef);
            } catch (error) {
                console.error("Error uploading image:", error);
                return;
            }
        }
    
        // Perform Firestore document update
        if (postComment){
            const postRef = doc(db, "posts", postId);
            const postSnapshot = await getDoc(postRef);
            const postData = postSnapshot.data();
            const targetComment = postData.comments.find(comment => comment.commentId === post.commentId)
            const updateComment = [...targetComment, comment, image]
            const updatedComments = [...postData.comments, updateComment ]
            await updateDoc(postRef, {
                comments: updatedComments,
            });
        }
        else {
            try {
                await updateDoc(doc(db, 'posts', post.id), {
                    comment,
                    image: downloadURL ? downloadURL : (image ? post.image : null)  // Use existing image URL if no new upload
                });
            } catch (error) {
                console.error("Error updating document:", error);
            } 
        }
        
        setLoading(false)
        setEdit(false)
    }
    
    function handleCommentChange(e) {
        setComment(e.target.value);
        adjustTextareaHeight(); // Adjust height on each change
    }
    useEffect(() => {
        adjustTextareaHeight(); // Adjust height on initial render
    }, [comment]);
    return (
        <>
        {loading ? <RingSpinner /> : <div className='post-info-container'>
            {edit ? <>
                <textarea className='updatecomment-input' value={comment} onChange={(e) => handleCommentChange(e)} ref={textareaRef}   style={{ overflow: 'hidden', resize: 'none' }}/>
                {image && <div
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
                </div>}
                <div className='updatecomment-container'>
                    {image && <label>Click photo to change</label>}
                    <div className='updatecomment-button-container'>
                        <button onClick={handleAdd} className='submit updatecomment-submit'>Update Comment</button>
                        <div>
                        {post.image ? <button className='red-button' onClick={()=>{
                            setImage(null)
                        }}>Remove Photo</button>  : <div
                    className='red-button homecomment-red-button'
                    onClick={() => {
                        filePickerRef.current.click()
                         setNewImage(true)}}                >
                    Add Image
                    <input
                        onChange={addImage}
                        ref={filePickerRef}
                        className="hidden"
                        type="file"
                    />
                    
                </div>} 
                </div>
                    </div>
                    
                </div>
                
            </> : <><h4>{comment}</h4>
                {image && <img src={image} className='post-image' alt='Image' />}</>}
        </div>}
        </>
    )
}

export default PostInfo