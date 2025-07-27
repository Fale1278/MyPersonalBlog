import React from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      <div className="post-card-content">
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">
          {post.excerpt?.length > 10
            ? post.content.slice(0, 10) + '...'
            : post.content}
        </p>
        <div className="post-card-meta">
          <span>Written By - {post.authorName}</span>
          <span>{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</span>
        </div>
        <button className="post-card-button">Read More</button>
      </div>

    </div>
  );
};

export default PostCard;
