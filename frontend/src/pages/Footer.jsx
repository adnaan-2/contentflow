import React from 'react';
import '../styles/Homepage.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-logo">
          <h3>ContentFlow</h3>
          <p>Simplifying content management since 2023</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023-2025 ContentFlow. All rights reserved.</p>
        <div className="social-icons">
          <a href="#twitter" className="social-icon">Twitter</a>
          <a href="#facebook" className="social-icon">Facebook</a>
          <a href="#linkedin" className="social-icon">LinkedIn</a>
          <a href="#instagram" className="social-icon">Instagram</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
