import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaLink, FaCalendarAlt, FaUpload, FaAd, FaChartBar, 
  FaPlus, FaBell, FaUserCircle, FaCog, FaQuestionCircle, 
  FaHistory, FaMobile, FaSignOutAlt 
} from 'react-icons/fa';
import '../styles/DashboardNavbar.css';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const notifications = 3; // Static notification count
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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
          <button className="upload-btn" onClick={() => navigate('/dashboard/transfer')}>
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
            <div className="profile-dropdown">
              <button 
                className="profile-btn" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <FaUserCircle className="nav-icon" />
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-header">
                    <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
                    <div className="profile-info">
                      <h4>{user?.name}</h4>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <div className="menu-items">
                    <button onClick={() => navigate('/dashboard/settings')}>
                      <FaCog /> Settings
                    </button>
                    <button onClick={() => navigate('/dashboard/help')}>
                      <FaQuestionCircle /> Help and resources
                    </button>
                    <button onClick={() => navigate('/dashboard/history')}>
                      <FaHistory /> Purchase history
                    </button>
                    <button onClick={() => navigate('/dashboard/apps')}>
                      <FaMobile /> Get the Apps
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                      <FaSignOutAlt /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;