import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Write.css';
import { auth } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dt3fis0fs/image/upload';
const UPLOAD_PRESET = 'MyBlog_images';


const Write = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !content) {
    setError('Title and content are required.');
    return;
  }

  try {
    setUploading(true);
    let imageUrl = '';

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'MyBlog_images');

      const cloudRes = await fetch(
        'https://api.cloudinary.com/v1_1/dt3fis0fs/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();
      imageUrl = cloudData.secure_url;
    }

    const newPost = {
      title,
      content,
      imageUrl,
      authorId: user.uid,
      authorName: user.displayName || user.email,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'posts'), newPost);
    navigate('/dashboard');

  } catch (err) {
    console.error('Error posting:', err);
    setError('Failed to publish post.');
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="write-container">
      <h2>Create New Post</h2>
      {error && <p className="error">{error}</p>}

      <form className="write-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />

        <textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="content-textarea"
          rows="10"
        />

        <div className="image-upload">
          <label htmlFor="image">Upload Image:</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
        </div>

        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
};

export default Write;
