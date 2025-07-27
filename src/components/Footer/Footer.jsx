import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>MyBlog</h2>
          <p>Empowering voices through writing.</p>
        </div>


        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: support@myblog.com</p>
          <p>Phone: +234 000 0000</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
