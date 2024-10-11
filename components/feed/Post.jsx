import React, { useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase'; // Import Firestore instance
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import { useDispatch, useSelector } from 'react-redux';
import ThumbsUpIcon from '../icons/ThumbsUpIcon';
import ChatIcon from '../icons/ChatIcon';
import ShareIcon from '../icons/ShareIcon';
import { toast } from 'react-toastify';
import SolidThumbsUp from '../icons/SolidThumbsUp';
import SolidChatIcon from '../icons/SolidChatIcon';
import { openCommentModal, setComment } from '@/redux/modalSlice';
import PostHeader from './PostHeader';
import DotsIcon from '../icons/DotsIcon';
import PostInfo from './PostInfo';
import ConfirmationModal from '../modals/ConfirmationModel';

function Post({ post }) {
    const [owner, setOwner] = useState(null);
    const [collapsePost, setCollapsePost] = useState(false)
    const [likes, setLikes] = useState(post.likes || []);
    const [comments, setComments] = useState(post.comment || []);
    const [showConfirm, setShowConfirm] = useState(false); // State for showing the confirmation modal  
    const [username, setUserName] = useState('')
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()    
    const [edit, setEdit] = useState(false)
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
            setShowConfirm(false)

        } catch (error) {
            toast.error('There was an error with deleting the post')
        }
    }
    useEffect(() => {
        // Fetch the user from the Firestore users collection
        const fetchUser = async () => {
            if (post.owner) {
                try {
                    const userDocRef = doc(db, 'user', post.owner); // Assuming the user ID matches the document ID
                    const userSnapshot = await getDoc(userDocRef);
                    if (userSnapshot.exists()) {
                        setOwner(userSnapshot.data());
                        setUserName(userSnapshot.data().email.slice(0, userSnapshot.data().email.indexOf('@')))
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
    useEffect(() => {
        const fetchComment = () => {
            setLikes(post.likes)
            setComments(post.comments)
        }
        fetchComment()
    }, [post.likes, post.comments])

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
    return (
        <>
            {collapsePost ? <div className='post-container-collapsed click' onClick={() => setCollapsePost((prev) => !prev)}><ChevronDownIcon classes={'white icon-small'} /><div className='collapse-line'></div></div> :
                <div className='post-container'>
                    <div className="post-header">
                        <div className='post-feed-chevron click' onClick={() => setCollapsePost((prev) => !prev)}>
                            <ChevronUpIcon classes={'white icon-small '} />
                        </div>
                        <PostHeader owner={owner} post={post} username={username} setCollapsePost={setCollapsePost} />
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
                        <PostInfo post={post} />


                    <div className='post-footer'>
                        <div className='post-like-container'>
                            <div className='click' onClick={handleLikes}>
                                {likes?.includes(user.uid) ? <SolidThumbsUp classes={'xs-icon white'} /> : <ThumbsUpIcon classes={'xs-icon'} />}
                                <label className='click'> Like</label>
                            </div>
                            {likes?.length > 0 &&
                                <div className='post-likes'>
                                    <label>{likes.length}</label>
                                </div>}
                            <div className='click' onClick={() => {
                                dispatch(setComment({
                                    id: post.id,
                                    comment: post.comment,
                                    photoUrl: owner.photoUrl,
                                    name: post.name,
                                    username: owner.username,
                                    userRef: owner.userRef,
                                    username: username
                                }))
                                dispatch(openCommentModal())
                            }}>
                                {comments?.includes(user.uid) ? <SolidChatIcon classes={'xs-icon white'} /> : <ChatIcon classes={'xs-icon'} />}

                                <label className='click'>Comment</label>
                            </div>
                            {comments?.length > 0 &&
                                <div className='post-likes'>
                                    <label>{comments?.length}</label>
                                </div>}
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
                    message={`Are you sure you want to remove @${username} post?`}
                    onConfirm={handleRemove}
                    onCancel={cancelDelete}
                />
            )}
        </>
    )
}

export default Post