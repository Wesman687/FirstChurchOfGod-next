import React from 'react';
import RingSpinner from '../RingSpinner';
import Post from './Post';

function FeedPosts({ user, posts, loading }) {
  return (
    <div className='feedposts-container'>
      {loading ? <RingSpinner /> : null}
      <div className="feedposts-wrapper">
        {posts.map((item, index) => (
          <Post post={item} key={item.id || index} user={user} />
        ))}
      </div>
    </div>
  );
}

export default FeedPosts;
