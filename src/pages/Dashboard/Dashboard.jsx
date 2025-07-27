// src/pages/Dashboard/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebase';
import { signOut } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = auth.currentUser;
    if (!storedUser) return navigate('/login');
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfileImage(data.photoURL);
        } else {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || '',
            photoURL: '',
          });
        }
      }
    };

    fetchProfile();
  }, [user]);

useEffect(() => {
  if (user?.uid) {
    const fetchUserPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      }
    };
    fetchUserPosts();
  }
}, [user]);



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadProfileImage = async () => {
  if (!imageFile || !user) return;

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'your_unsigned_upload_preset'); // Replace this
  formData.append('cloud_name', 'dt3fis0fs'); // Replace this

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/dt3fis0fs/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    const url = data.secure_url;

    // Save Cloudinary image URL in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      photoURL: url,
    });

    setProfileImage(url);
    setImageFile(null);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
  }
};


  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="user-info">
        <div className="profile-picture">
          <img
            src={profileImage || '/default-user.png'}
            alt="Profile"
            className="profile-img"
          />
          <input type="file" onChange={handleImageChange} />
          <button onClick={uploadProfileImage} disabled={!imageFile}>
            Upload Profile Photo
          </button>
        </div>
        <h2>{user?.displayName || 'Unnamed User'}</h2>
        <p>{user?.email}</p>

        <div className="dashboard-actions">
          <button onClick={() => navigate('/write')}>Write a Post</button>
        </div>
      </div>

      <div className="recent-posts">
        <h3>Your Recent Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div className="post-card" key={post.id}>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="post-image"
                  />
                )}
                <h4>{post.title}</h4>
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      post.content.length > 150
                        ? post.content.slice(0, 150) + '...'
                        : post.content,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
