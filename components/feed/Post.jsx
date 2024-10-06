import React, { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Import Firestore instance
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import DotsIcon from '../icons/DotsIcon';
import ConfirmationModal from '../modals/ConfirmationModel';
import { useSelector } from 'react-redux';
import ThumbsUpIcon from '../icons/ThumbsUpIcon';
import ThumbsDownIcon from '../icons/ThumbsDownIcon';
import ChatIcon from '../icons/ChatIcon';
import ShareIcon from '../icons/ShareIcon';

function Post({ post }) {
    const [owner, setOwner] = useState(null);
    const [edit, setEdit] = useState(false)
    const [collapsePost, setCollapsePost] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false); // State for showing the confirmation modal
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
                        console.log('User not found');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };

        fetchUser();
    }, [post.owner]);
    const confirmRemoveMember = () => {
        setShowConfirm(true);
    };

    const cancelDelete = () => {
        setShowConfirm(false); // Hide the confirmation modal
    };
    async function handleRemove() {
        try {
            await deleteDoc(doc(db, 'posts', post.id));

        } catch (error) {
            toast.error('There was an error with deleting the post')
        }
    }
    function handleLikes() {
        console.log('test')
        return '0'
    }
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

                            <label>{handleLikes}0</label>
                        </div>
                        <div className='post-like-container'>
                            <div className='click'>
                                <ThumbsUpIcon classes={'xs-icon'} />
                                <label className='click'> Likes</label>
                            </div>
                            <div className='click'>
                                <ThumbsDownIcon classes={'xs-icon'} />
                                <label className='click'>DisLikes</label>
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