import React, { useState, useEffect } from 'react';
import './Navbar.css';

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
        <a href="#home" onClick={() => scrollToSection('home')}>ContentFlow</a>
      </div>
      <ul className="nav-links">
        <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
        <li><a href="#about" onClick={() => scrollToSection('about')}>About</a></li>
        <li><a href="#features" onClick={() => scrollToSection('features')}>Features</a></li>
        <li><a href="#pricing" onClick={() => scrollToSection('pricing')}>Pricing</a></li>
        <li className="auth-links">
          <a href="#login" onClick={() => scrollToSection('auth')} className="login-btn">Login</a>
          <a href="#signup" onClick={() => scrollToSection('auth')} className="signup-btn">Sign Up</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;