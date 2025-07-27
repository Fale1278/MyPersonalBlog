import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Post.css';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import PostCard from '../../components/PostCard/PostCard';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherPosts, setOtherPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost(postSnap.data());
        } else {
          console.error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOtherPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const snapshot = await getDocs(postsCollection);
        const postsData = snapshot.docs
          .filter(doc => doc.id !== id) // exclude current post
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setOtherPosts(postsData);
      } catch (error) {
        console.error('Error fetching other posts:', error);
      }
    };

    fetchPost();
    fetchOtherPosts();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!post) return <p className="error">Post not found.</p>;

  return (
    <div className="post-page-container">
      <div className="post-container">
        <h1 className="post-title">{post.title}</h1>

        {post.imageUrl && (
          <div className="post-image-wrapper">
            <img src={post.imageUrl} alt="Post" className="post-image" />
          </div>
        )}

        <div className="post-meta">
          <p>By <strong>{post.authorName}</strong></p>
          {post.createdAt && (
            <p className="post-date">
              {new Date(post.createdAt.seconds * 1000).toLocaleString()}
            </p>
          )}
        </div>

        <div className="post-content">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>

      <section className="more-posts">
        <h2>More Posts</h2>
        {otherPosts.length === 0 ? (
          <p>No other posts available.</p>
        ) : (
          <div className="more-posts-list">
            {otherPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Post;
