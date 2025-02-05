import React, { useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase'; // Import Firestore instance
import ChevronDownIcon from '../icons/ChevronDownIcon';
import { useDispatch, useSelector } from 'react-redux';
import ThumbsUpIcon from '../icons/ThumbsUpIcon';
import ChatIcon from '../icons/ChatIcon';
import ShareIcon from '../icons/ShareIcon';
import { toast } from 'react-toastify';
import SolidThumbsUp from '../icons/SolidThumbsUp';
import SolidChatIcon from '../icons/SolidChatIcon';
import { openCommentModal, setComment } from '@/redux/modalSlice';
import PostHeader from './PostHeader';
import PostInfo from './PostInfo';
import ConfirmationModal from '../modals/ConfirmationModel';

function Post({ postComment, postId, post: existingPost, fetchData }) {
    const [owner, setOwner] = useState(null);
    const [comments, setComments] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false); // State for showing the confirmation modal  
    const [username, setUserName] = useState('')
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [edit, setEdit] = useState(false)
    const [collapsePost, setCollapsePost] = useState(false)
    const [likes, setLikes] = useState([]);
    const [post, setPost] = useState(existingPost)
    const confirmRemoveMember = () => {
        setShowConfirm(true);
    };

    const cancelDelete = () => {
        setShowConfirm(false); // Hide the confirmation modal
    };
    
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
            setLikes(post.likes || [])
            setComments(post.comments || [])
            console.log(post)
        }
        fetchComment()
    }, [post])
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
        if (postComment){
            const postRef = doc(db, "posts", postId);
            const postSnapshot = await getDoc(postRef);

            const postData = postSnapshot.data();
            const comments = postData.comments || []; 
            
            const updatedComments = comments.filter(comment => comment.commentId !== post.commentId); 
            await updateDoc(postRef, {
                comments: updatedComments,
            });
            setShowConfirm(false)
            fetchData()
        }
        else {
            try {
                await deleteDoc(doc(db, 'posts', post.id));
                setShowConfirm(false)
            } catch (error) {
                toast.error('There was an error with deleting the post')
            }
        }
        
    }
    async function handleLikes(e) {
        e.stopPropagation();
        if (!user.username) {
            return;
        }
        if (postComment) {
            const postRef = doc(db, "posts", postId);
            const postSnapshot = await getDoc(postRef);

            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                const comments = postData.comments || []; // Fallback to empty array if no comments
                // Step 2: Perform postComment logic
                let updatedComments;

                const targetComment = comments.find(comment => comment.commentId === post.commentId);                
                const likes = targetComment ? (targetComment.likes || []) : [];

                if (likes?.includes(user.uid)) {
                    console.log('test')
                    // Remove the user's UID from likes
                    updatedComments = comments.map(comment =>
                        comment.commentId === post.commentId
                            ? { ...comment, likes: likes.filter(uid => uid !== user.uid) }
                            : comment
                    );
                } else {                    
                    // Add the user's UID to likes
                    updatedComments = comments.map(comment =>
                        comment.commentId === post.commentId
                            ? { ...comment, likes: [...likes, user.uid] }
                            : comment
                    );
                }
                // Step 3: Update the comments array in Firestore
                await updateDoc(postRef, {
                    comments: updatedComments,
                });
                
                setPost(updatedComments.find(comment => comment.commentId === post.commentId))
            }

        }
        else {
            let newLikes
            if (likes?.includes(user.uid)) {
                newLikes = likes.filter(item => item !== user.uid)
            } else {
                newLikes = [...likes, user.uid]
            }
            await updateDoc(doc(db, "posts", post.id), {
                likes: newLikes
            });
            setPost(prevPost => ({
                ...prevPost,
                likes: newLikes
            }));
        }
    }
    return (
        <>
            {collapsePost ? <div className='post-container-collapsed click' onClick={() => setCollapsePost((prev) => !prev)}><ChevronDownIcon classes={'white icon-small'} /><div className='collapse-line'></div></div> :
                <div className='post-container'>
                    <PostHeader timeStamp={post.timeStamp} name={post.name} username={username} photoUrl={post.photoUrl} setCollapsePost={setCollapsePost} confirmRemoveMember={confirmRemoveMember} setEdit={setEdit} edit={edit} owner={post.owner} />

                    <PostInfo post={post} edit={edit} setEdit={setEdit} postComment={postComment}  />


                    <div className='post-footer'>
                        <div className='post-like-container'>
                            <div className='click' onClick={handleLikes}>
                                {likes?.includes(user.uid) ? <SolidThumbsUp classes={'xs-icon white'} /> : <ThumbsUpIcon classes={'xs-icon'} />}
                                <label className={`click + ${likes?.includes(user.uid) && 'mycommentorlike'}`}> Like</label>
                            </div>
                            {likes?.length > 0 &&
                                <div className='post-likes'>
                                    <label className={`${likes?.includes(user.uid) && 'mycommentorlike'}`}>{likes.length}</label>
                                </div>}
                            {!postComment && <div className='click' onClick={() => {
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
                                {comments?.length > 0 && comments?.some(comment => comment.owner === user.userRef) ? <SolidChatIcon classes={`xs-icon + ${comments?.some(comment => comment.owner === user.userRef) && 'mycommentorlike'}`} /> : <ChatIcon classes={'xs-icon'} />}

                                <label className={`click + ${comments?.some(comment => comment.owner === user.userRef) && 'mycommentorlike'}`}>Comments</label>
                            </div>}
                            {comments?.length > 0 &&
                                <div className='post-likes'>
                                    <label className={`${comments?.some(comment => comment.owner === user.userRef) && 'mycommentorlike'}`}>{comments?.length}</label>
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