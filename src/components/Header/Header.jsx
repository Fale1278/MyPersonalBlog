import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaPenNib, FaSignInAlt, FaUserPlus, FaBars, FaUserCircle } from 'react-icons/fa';
import { auth } from '../../firebase'; // ✅ Ensure correct path
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">MyBlog</Link>

        <div className="menu-toggle" onClick={toggleMenu}>
          <FaBars />
        </div>

        <div className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>

          {user && (
            <>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                <FaUserCircle /> Dashboard
              </NavLink>
              <NavLink to="/write" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                <FaPenNib /> Write
              </NavLink>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                <FaSignInAlt /> Login
              </NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                <FaUserPlus /> Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
