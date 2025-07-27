// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaGoogle, FaFacebookF } from 'react-icons/fa6';
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../../firebase';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard'); // or home or blog etc.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const loginWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group with-icon">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group with-icon password-group">
          <FaLock className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <span className="toggle-password" onClick={togglePassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="social-login">
          <button type="button" className="google-btn" onClick={loginWithGoogle}>
            <FaGoogle /> Continue with Google
          </button>
          <button type="button" className="facebook-btn" onClick={loginWithFacebook}>
            <FaFacebookF /> Continue with Facebook
          </button>
        </div>

        <p className="register-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
