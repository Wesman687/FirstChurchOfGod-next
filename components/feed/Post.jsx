import React, { useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase'; // Import Firestore instance
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import DotsIcon from '../icons/DotsIcon';
import ConfirmationModal from '../modals/ConfirmationModel';
import { useSelector } from 'react-redux';
import ThumbsUpIcon from '../icons/ThumbsUpIcon';
import ThumbsDownIcon from '../icons/ThumbsDownIcon';
import ChatIcon from '../icons/ChatIcon';
import ShareIcon from '../icons/ShareIcon';
import { deleteObject, ref } from 'firebase/storage';
import { toast } from 'react-toastify';
import SolidThumbsUp from '../icons/SolidThumbsUp';

function Post({ post }) {
    const [owner, setOwner] = useState(null);
    const [edit, setEdit] = useState(false)
    const [collapsePost, setCollapsePost] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false); // State for showing the confirmation modal
    const [likes, setLikes] = useState(post.likes || []);
    const [comments, setComments] = useState(post.comment || []);
    const user = useSelector(state => state.user)
    useEffect(() => {
        // Fetch the user from the Firestore users collection
        const fetchUser = async () => {
            if (post.owner) {                
                try {
                    const userDocRef = doc(db, 'user', post.owner); // Assuming the user ID matches the document ID
                    const userSnapshot = await getDoc(userDocRef);
                    if (userSnapshot.exists()) {
                        setOwner(userSnapshot.data());
                    } else {
                        toast.error('User not found');
                    }
                } catch (error) {
                    toast.error('Error fetching user:', error);
                }
            }
        };

        fetchUser();
    }, [post.owner]);
    useEffect(()=>{
        setLikes(post.likes)
        setComments(post.comments)
    },[post.likes, post.comments])
    const confirmRemoveMember = () => {
        setShowConfirm(true);
    };

    const cancelDelete = () => {
        setShowConfirm(false); // Hide the confirmation modal
    };
    async function handleRemove() {
        if (post.image) {
            // Get a reference to the image in Firebase Storage
            const imageRef = ref(storage, post.image);

            // Delete the image from Firebase Storage
            await deleteObject(imageRef).then(() => {
                console.log('Image deleted successfully from Firebase Storage');
            }).catch((error) => {
                console.error('Error deleting image from Firebase Storage:', error);
                toast.error('Error deleting image');
            });
        }
        try {
            await deleteDoc(doc(db, 'posts', post.id));

        } catch (error) {
            toast.error('There was an error with deleting the post')
        }
    }
    async function handleLikes(e) {
        e.stopPropagation();
        if (!user.username) {
          return;
        }
        if (likes?.includes(user.uid)) {
          await updateDoc(doc(db, "posts", post.id), {
            likes: arrayRemove(user.uid),
          });
        } else {
          await updateDoc(doc(db, "posts", post.id), {
            likes: arrayUnion(user.uid),
          });
        }
      }
      console.log(post)
    return (
        <>
            {collapsePost ? <div className='post-container-collapsed click' onClick={() => setCollapsePost((prev) => !prev)}><ChevronDownIcon classes={'white icon-small'} /><div className='collapse-line'></div></div> :
                <div className='post-container'>

                    <div className='post-owner-container'>
                        {owner && <>
                            <div className='posts-owner-photoandname'>

                                <div className='post-feed-chevron click' onClick={() => setCollapsePost((prev) => !prev)}>
                                    <ChevronUpIcon classes={'white icon-small '} />
                                </div>
                                <img src={owner.photoUrl} className='posts-owner-photourl' alt="" />
                                <h4>{owner.firstName + ' ' + owner.lastName}</h4>
                                <label>@{owner.email.slice(0, owner.email.indexOf('@'))}</label>
                            </div>
                            <h5>{post.timeStamp &&
                                post.timeStamp
                                    .toDate()
                                    .toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true, // This makes the time format 12-hour, e.g., 10:30 AM
                                    })}</h5>
                        </>}
                        <div className='post-dropdown'>
                            <div className='list-prayer-item-chevron'>
                                <DotsIcon classes={'white icon-small'} />
                            </div>
                            <div className='post-prayer-menudropdown'>
                                {(user.isAdmin || user.userRef === post.owner) && <><label className='click' onClick={() => setEdit((prev) => !prev)}>{edit ? 'Cancel Edit' : 'Edit'}</label>
                                    <label className='click' onClick={() => confirmRemoveMember()}>Remove</label></>}
                            </div>
                        </div>
                    </div>
                    <div className='post-info-container'>
                        <h4>{post.comment}</h4>
                        {post.image && <img src={post.image} className='post-image' alt='Image' />}
                    </div>
                    <div className='post-footer'>
                        <div className='post-likes'>

                            <label>{likes?.length > 0 && likes.length}</label>
                        </div>
                        <div className='post-like-container'>
                            <div className='click' onClick={handleLikes}>
                                {likes?.includes(user.uid) ? <SolidThumbsUp classes={'xs-icon white'} /> : <ThumbsUpIcon classes={'xs-icon'} />}
                                <label className='click'> Like</label>
                            </div>
                            <div className='click'>
                                <ChatIcon classes={'xs-icon'} />
                                <label className='click'>Comment</label>
                            </div>
                            <div className='click'>
                                <ShareIcon classes={'xs-icon'} />
                                <label className='click'>Share</label>
                            </div>
                        </div>
                    </div>
                </div>}
            {showConfirm && (
                <ConfirmationModal
                    title="Confirm Removal"
                    message={`Are you sure you want to remove @${owner.email.slice(0, owner.email.indexOf('@'))} post?`}
                    onConfirm={handleRemove}
                    onCancel={cancelDelete}
                />
            )}
        </>
    )
}

export default Post