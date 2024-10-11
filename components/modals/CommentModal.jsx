import { Modal } from '@mui/material'
import React, { useState } from 'react'
import RingSpinner from '../RingSpinner'
import XIcon from '../icons/XIcon'
import { useDispatch, useSelector } from 'react-redux'
import { closeCommentModal, openCommentModal } from '@/redux/modalSlice'
import FeedInput from '../feed/FeedInput'

function CommentModal() {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const commentDetails = useSelector(state => state.commentDetails)
    const isOpen = useSelector((state) => state.modals.commentModalOpen)    
    return (
        <>

            <Modal
                open={isOpen}
                onClose={() => dispatch(closeCommentModal())}
                className="settings__modal contact__modal"
            >
                <div className="login__container">
                    <div className="login">

                        <div className="login-form account-settings">
                            <div className="login-close-container">
                                <div
                                    className="login__x"
                                    onClick={() => dispatch(closeCommentModal())}
                                >
                                    <XIcon />
                                </div>
                            </div>
                            {loading ? (
                                <RingSpinner />
                            ) : (
                                <>
                                    <div className="input-container">
                                        <div className='post-owner-container'>
                                            
                                                <div className='posts-owner-photoandname'>

                                                    {commentDetails?.photoUrl && <img src={commentDetails?.photoUrl} className='posts-owner-photourl' alt="" />}
                                                    <h4>{commentDetails?.name}</h4>
                                                    <label>@{commentDetails?.userName}</label>
                                                </div>
                                                {/* <h5>{commentDetails?.timeStamp &&
                                                    commentDetails?.timeStamp
                                                        .toDate()
                                                        .toLocaleString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            hour12: true, // This makes the time format 12-hour, e.g., 10:30 AM
                                                        })}</h5> */}
                                            
                                        </div>
                                        <FeedInput user={user} />

                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>{" "}

        </>
    )
}

export default CommentModal