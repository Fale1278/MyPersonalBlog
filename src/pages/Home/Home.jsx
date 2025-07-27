import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // ✅ adjust if your path differs
import Loader from '../../components/Loader/Loader';
import PostCard from '../../components/PostCard/PostCard';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const snapshot = await getDocs(postsCollection);
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    e.target.reset();
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to MyBlog</h1>
        <p>Discover insights, stories, and tutorials from around the web.</p>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          MyBlog is a platform built to empower young people, hobbyists,
          and professionals to share their voices. We make blogging simple,
          beautiful, and accessible.
        </p>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ada" className="testimonial-img" />
            <p>"MyBlog helped me start my writing journey!"</p>
            <span>- Ada, UniJos</span>
          </div>
          <div className="testimonial">
            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Musa" className="testimonial-img" />
            <p>"The best place for young writers to express ideas."</p>
            <span>- Musa, FUK</span>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="posts">
        <h2>Latest Posts</h2>
        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <p>No posts available yet.</p>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section className="contact">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" required placeholder="Your full name" />
          </div>
          <div className="form-group">
            <input type="email" name="email" required placeholder="Your email address" />
          </div>
          <div className="form-group">
            <textarea name="message" required placeholder="Write your message here..." />
          </div>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Home;
