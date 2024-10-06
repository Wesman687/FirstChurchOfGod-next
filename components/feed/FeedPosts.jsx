import { db } from '@/firebase';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import RingSpinner from '../RingSpinner';
import Post from './Post';

function FeedPosts({user}) {
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    useEffect(() => {
        setLoading(true)
        const q = query(collection(db, 'posts'), orderBy('timeStamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let data = snapshot.docs.map(doc => ({
                id: doc.id,  // Add the document ID
                ...doc.data() // Spread the rest of the document data
              }));
            setPosts(data)
            setLoading(false)
        })
        return unsubscribe
    }, [])
  return (
    <div className='feedposts-container'>
        {loading || posts.length === 0 ? <RingSpinner /> : <>
        

        </>}
        <div className="feedposts-wrapper">
            {posts.length > 0 && posts.map((item, index) => <Post post={item} key={index} user={user} />)}
            
        </div>

    </div>
  )
}

export default FeedPosts