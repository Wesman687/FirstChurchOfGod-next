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

function CommentModal() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [owner, setOwner] = useState([]);
    const [post, setPost] = useState([]);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isOpen = useSelector(state => state.modals.commentModalOpen);
    const commentDetails = useSelector(state => state.modals.commentDetails);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isOpen && commentDetails.id) {
                    setLoading(true);

                    const postDocRef = doc(db, 'posts', commentDetails.id);
                    const postSnapshot = await getDoc(postDocRef);

                    if (postSnapshot.exists()) {
                        const postData = postSnapshot.data();
                        setPost({ id: postSnapshot.id, ...postData });

                        if (postData.owner) {
                            const userDocRef = doc(db, 'user', postData.owner);
                            const userSnapshot = await getDoc(userDocRef);

                            if (userSnapshot.exists()) {
                                const userData = userSnapshot.data();
                                setOwner(userData);
                                setUsername(userData.email.split('@')[0]);
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
                        <div className="comment-input-container">
                            <div className="login-close-container">
                                <div
                                    className="login__x"
                                    onClick={() => dispatch(closeCommentModal())}
                                >
                                    <XIcon />
                                </div>
                            </div>
                            <div className="postcomment-header">
                                <PostHeader post={post} owner={owner} username={username} />
                                <div className="postcomment-info">

                                    <PostInfo post={post} />

                                </div>
                            </div>
                            <FeedInput user={user} comment={true} />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CommentModal;
