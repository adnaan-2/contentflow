import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const LandingNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');  // Redirect to landing page
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
      <div className="logo">
        <Link to="/">ContentFlow</Link>
      </div>
      <ul className="nav-links">
        <li>
          <button 
            onClick={() => scrollToSection('home')}
            className="nav-button"
          >
            Home
          </button>
        </li>
        <li>
          <button 
            onClick={() => scrollToSection('about')}
            className="nav-button"
          >
            About
          </button>
        </li>
        <li>
          <button 
            onClick={() => scrollToSection('features')}
            className="nav-button"
          >
            Features
          </button>
        </li>
        <li>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="nav-button"
          >
            Pricing
          </button>
        </li>
        {localStorage.getItem('token') ? (
          <li className="auth-links">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        ) : (
          <li className="auth-links">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default LandingNavbar;