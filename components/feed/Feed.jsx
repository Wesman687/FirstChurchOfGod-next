import React, { useEffect, useState } from 'react';
import FeedInput from './FeedInput';
import FeedPosts from './FeedPosts';
import { useSelector } from 'react-redux';
import CommentModal from '../modals/CommentModal';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';

function Feed() {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const user = useSelector(state => state.user);  
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    
    // Real-time listener on posts collection
    const q = query(collection(db, 'posts'), orderBy('timeStamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(data)
        setRefreshCounter(prev => prev + 1);
        setPosts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    );
    

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className='feed-container'>
      <FeedPosts user={user} posts={posts} loading={loading} />
      <FeedInput user={user} />
      <CommentModal />
    </div>
  );
}

export default Feed;
