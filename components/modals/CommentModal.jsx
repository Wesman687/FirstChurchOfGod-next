import { Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import RingSpinner from '../RingSpinner';
import XIcon from '../icons/XIcon';
import { useDispatch, useSelector } from 'react-redux';
import { closeCommentModal } from '@/redux/modalSlice';
import FeedInput from '../feed/FeedInput';
import PostHeader from '../feed/PostHeader';
import PostInfo from '../feed/PostInfo';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Post from '../feed/Post';

function CommentModal() {
    const [loading, setLoading] = useState(false);
    const [owner, setOwner] = useState([]);
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([])    

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isOpen = useSelector(state => state.modals.commentModalOpen);
    const commentDetails = useSelector(state => state.modals.commentDetails);

    const fetchData = async () => {
        try {
            if (isOpen && commentDetails.id) {
                setLoading(true);

                const postDocRef = doc(db, 'posts', commentDetails.id);
                const postSnapshot = await getDoc(postDocRef);

                if (postSnapshot.exists()) {
                    const postData = postSnapshot.data();
                    setPost({ id: postSnapshot.id, ...postData });
                    setComments(postData.comments || [])

                    if (postData.owner) {
                        const userDocRef = doc(db, 'user', postData.owner);
                        const userSnapshot = await getDoc(userDocRef);

                        if (userSnapshot.exists()) {
                            const userData = userSnapshot.data();
                            setOwner(userData);
                        } else {
                            toast.error('User not found');
                        }
                    }
                } else {
                    toast.error('Post not found');
                }
            }
        } catch (error) {
            toast.error(`Error fetching data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        

        fetchData();
    }, [isOpen, commentDetails.id]);
    return (
        <Modal
            open={isOpen}
            onClose={() => dispatch(closeCommentModal())}
            className="settings__modal contact__modal"
        >
            <div className="login__container">
                <div className="comment-wrapper">
                    {loading ? (
                        <RingSpinner />
                    ) : (
                        <div className="comment-input-container comment-modal-container">
                            <div className="login-close-container">
                                <div
                                    className="login__x"
                                    onClick={() => dispatch(closeCommentModal())}
                                >
                                    <XIcon classes={'xs-icon'} />
                                </div>
                            </div>                            
                                <PostHeader timeStamp={post.timeStamp} name={post.name} username={commentDetails.username} photoUrl={owner.photoUrl} dotsOn={false} />                                
                                <div className="postcomment-info">
                                    <PostInfo post={post} />

                                </div>
                               
                                <div className='comments-post-container'>
                                {comments.length > 0 && comments.map((item, index) => (                                    
                                        <Post post={item} key={index} postComment={true} postId={post.id} fetchData={fetchData} />                                        
                                ))}
                                </div>
                            <FeedInput user={user} comment={commentDetails.id} fetchData={fetchData} collapse={true} postId={post.id} />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CommentModal;
