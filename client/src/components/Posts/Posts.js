import React from 'react';

import PostSingle from './PostSingle';
import './PostSingle.css';

const postList = props => {
  const posts = props.posts.map(post => {
    return (
      <PostSingle
        key={post.post_id}
        currUser={props.authUserId}
        userId = {post.user_id}
        eventId={post.post_id}
        username={post.username}
        title={post.title}
        date={post.postDate} 
        description={post.description}
        unfollowHandler = {props.onUnfollowHandler}
      />
    );
  });

  return <ul className="posts__list">{posts}</ul>;
};

export default postList;