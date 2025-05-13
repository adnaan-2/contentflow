import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaLink, FaCalendarAlt, FaUpload, FaAd, FaChartBar, 
  FaPlus, FaBell, FaUserCircle, FaCog, FaQuestionCircle, 
  FaHistory, FaMobile, FaSignOutAlt, FaCreditCard 
} from 'react-icons/fa';
import '../styles/DashboardNavbar.css';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const notifications = 3; // Static notification count
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Simple effect to get user data once
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Toggle profile menu
  const toggleProfileMenu = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setProfileMenuOpen(!profileMenuOpen);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add a function to handle menu item clicks
  const handleMenuItemClick = (action) => {
    if (action === 'profile') {
      navigate('/dashboard/profile');
    } else if (action === 'settings') {
      navigate('/dashboard/settings');
    } else if (action === 'subscription') {
      navigate('/dashboard/subscription');
    } else if (action === 'logout') {
      handleLogout();
    }

    // Close the menu after action
    setProfileMenuOpen(false);
  };

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="ContentFlow" className="dashboard-logo" />
          <h2>ContentFlow</h2>
        </div>

        <ul className="dashboard-nav-links">
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <FaHome className="nav-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname === '/dashboard/social-accounts' ? 'active' : ''}>
            <Link to="/dashboard/social-accounts">
              <FaLink className="nav-icon" />
              <span>Link Accounts</span>
            </Link>
          </li>
          <li className={location.pathname === '/dashboard/schedule' ? 'active' : ''}>
            <Link to="/dashboard/schedule">
              <FaCalendarAlt className="nav-icon" />
              <span>Schedule Posts</span>
            </Link>
          </li>
          <li className={location.pathname === '/dashboard/upload' ? 'active' : ''}>
            <Link to="/dashboard/upload">
              <FaUpload className="nav-icon" />
              <span>Upload Posts</span>
            </Link>
          </li>
          <li className={location.pathname === '/dashboard/generate-ads' ? 'active' : ''}>
            <Link to="/dashboard/generate-ads">
              <FaAd className="nav-icon" />
              <span>Generate Ads</span>
            </Link>
          </li>
          <li className={location.pathname === '/dashboard/analytics' ? 'active' : ''}>
            <Link to="/dashboard/analytics">
              <FaChartBar className="nav-icon" />
              <span>Analytics</span>
            </Link>
          </li>
        </ul>

        <div className="action-buttons">
          <button className="upload-btn" onClick={() => navigate('/dashboard/transfer-media')}>
            <FaPlus className="nav-icon" />
            <span>Transfer Media</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="footer-actions">
            <button className="notification-btn" onClick={() => navigate('/dashboard/notifications')}>
              <FaBell className="nav-icon" />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>
            <div className="profile-dropdown" ref={profileRef}>
              <button 
                className="profile-btn" 
                onClick={toggleProfileMenu}
                aria-expanded={profileMenuOpen}
              >
                <FaUserCircle className="nav-icon" />
              </button>
              <div className={`profile-menu ${profileMenuOpen ? 'active' : ''}`}>
                <div className="profile-header">
                  <FaUserCircle className="profile-icon" />
                  <div className="profile-info">
                    <h4>{user?.name || 'User'}</h4>
                    <p>{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <div className="menu-items">
                  <button onClick={() => handleMenuItemClick('profile')}>
                    <FaUserCircle /> My Profile
                  </button>
                  <button onClick={() => handleMenuItemClick('settings')}>
                    <FaCog /> Settings
                  </button>
                  <button onClick={() => handleMenuItemClick('subscription')}>
                    <FaCreditCard /> Subscription
                  </button>
                  <button 
                    className="logout-btn" 
                    onClick={() => handleMenuItemClick('logout')}
                  >
                    <FaSignOutAlt /> Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;