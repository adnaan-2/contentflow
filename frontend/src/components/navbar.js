import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Use Link for SPA behavior
import '../styles/Navbar.css'; 

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
      <div className="logo">
        <Link to="/" onClick={() => scrollToSection('home')}>ContentFlow</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/" onClick={() => scrollToSection('home')}>Home</Link></li>
        <li><Link to="/about" onClick={() => scrollToSection('about')}>About</Link></li>
        <li><Link to="/features" onClick={() => scrollToSection('features')}>Features</Link></li>
        <li><Link to="/pricing" onClick={() => scrollToSection('pricing')}>Pricing</Link></li>
        <li className="auth-links">
          <Link to="/login" onClick={() => scrollToSection('auth')} className="login-btn">Login</Link>
          <Link to="/signup" onClick={() => scrollToSection('auth')} className="signup-btn">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
