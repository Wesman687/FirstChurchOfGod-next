import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Import Firestore instance
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import DotsIcon from '../icons/DotsIcon';

function Post({ post }) {
    const [owner, setOwner] = useState(null);
    const [collapsePost, setCollapsePost] = useState(false)

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
    console.log(owner)
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
                        <DotsIcon classes={'white icon-small'} />
                    </div>
                    <div className='post-info-container'>
                        <h4>{post.comment}</h4>
                        {post.image && <img src={post.image} className='post-image' alt='Image' />}
                    </div>
                </div>}
        </>
    )
}

export default Post