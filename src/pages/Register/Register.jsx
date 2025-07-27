// src/pages/Register.jsx
import React, { useState } from 'react';
import './Register.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { FaGoogle, FaFacebookF } from 'react-icons/fa6';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../../firebase';

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(user, {
        displayName: formData.displayName,
      });

      navigate('/dashboard'); // or wherever you want to go after registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const registerWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group with-icon">
          <FaUser className="icon" />
          <input
            type="text"
            name="displayName"
            required
            placeholder="Full Name"
            value={formData.displayName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group with-icon">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group with-icon password-group">
          <FaLock className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="toggle-password" onClick={togglePassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="social-login">
          <button type="button" className="google-btn" onClick={registerWithGoogle}>
            <FaGoogle /> Sign up with Google
          </button>
          <button type="button" className="facebook-btn" onClick={registerWithFacebook}>
            <FaFacebookF /> Sign up with Facebook
          </button>
        </div>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
