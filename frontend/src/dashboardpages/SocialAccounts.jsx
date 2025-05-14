import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPlus, FaTrash, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SocialAccounts.css';

const SocialAccounts = () => {
  const [accounts, setAccounts] = useState({
    facebook: [],
    twitter: [],
    instagram: [],
    linkedin: []
  });
  
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data for development - remove when implementing backend
  useEffect(() => {
    // Simulated data fetch
    setTimeout(() => {
      setAccounts({
        facebook: [
          { id: 'fb1', name: 'Content Flow Page', status: 'connected', profilePic: 'https://via.placeholder.com/40' }
        ],
        twitter: [],
        instagram: [
          { id: 'ig1', name: 'contentflow_official', status: 'connected', profilePic: 'https://via.placeholder.com/40' }
        ],
        linkedin: []
      });
    }, 500);
  }, []);

  // Platform configuration data
  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <FaFacebookF />,
      color: '#1877F2',
      description: 'Connect your Facebook pages to schedule and post content.',
      connectMessage: 'Connect with Facebook',
      multipleAllowed: true
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <FaTwitter />,
      color: '#1DA1F2',
      description: 'Connect your Twitter account to schedule and post tweets.',
      connectMessage: 'Connect with Twitter',
      multipleAllowed: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <FaInstagram />,
      color: '#E1306C',
      description: 'Connect your Instagram business account to schedule and post content.',
      connectMessage: 'Connect with Instagram',
      multipleAllowed: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <FaLinkedinIn />,
      color: '#0A66C2',
      description: 'Connect your LinkedIn profile or company pages to schedule and post updates.',
      connectMessage: 'Connect with LinkedIn',
      multipleAllowed: true
    }
  ];

  const handleConnect = (platformId) => {
    setLoading(true);
    setError('');
    
    // Mock connection process
    setTimeout(() => {
      setLoading(false);
      
      // Show success message
      setSuccess(`Successfully connected to ${platformId}!`);
      setTimeout(() => setSuccess(''), 3000);
      
      // In real implementation, this would redirect to OAuth flow
      // For now, just log the intent
      console.log(`Connecting to ${platformId}...`);
    }, 1000);
  };

  const handleDisconnect = (platformId, accountId) => {
    setLoading(true);
    
    // Mock disconnection process
    setTimeout(() => {
      setAccounts(prev => ({
        ...prev,
        [platformId]: prev[platformId].filter(acc => acc.id !== accountId)
      }));
      
      setLoading(false);
      setSuccess(`Account disconnected from ${platformId}!`);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const toggleExpand = (platformId) => {
    setExpandedPlatform(expandedPlatform === platformId ? null : platformId);
  };

  return (
    <motion.div 
      className="social-accounts-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1>Social Accounts</h1>
        <p>Connect your social media accounts to schedule and publish content</p>
      </div>

      {error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaTimes className="message-icon" />
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaCheck className="message-icon" />
          {success}
        </motion.div>
      )}

      <div className="accounts-overview">
        {platforms.map((platform) => (
          <motion.div 
            key={platform.id} 
            className="platform-card"
            style={{ 
              borderTop: `4px solid ${platform.color}`,
              boxShadow: expandedPlatform === platform.id ? `0 5px 15px rgba(0,0,0,0.1)` : 'none' 
            }}
            whileHover={{ y: -5, boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="platform-header" onClick={() => toggleExpand(platform.id)}>
              <div className="platform-icon" style={{ backgroundColor: platform.color }}>
                {platform.icon}
              </div>
              <div className="platform-info">
                <h2>{platform.name}</h2>
                <p>{accounts[platform.id].length === 0 ? 'Not connected' : 
                   `${accounts[platform.id].length} account${accounts[platform.id].length > 1 ? 's' : ''} connected`}</p>
              </div>
              <div className="platform-status">
                {accounts[platform.id].length > 0 ? (
                  <span className="status-connected">Connected</span>
                ) : (
                  <span className="status-disconnected">Disconnected</span>
                )}
                {expandedPlatform === platform.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            <AnimatePresence>
              {expandedPlatform === platform.id && (
                <motion.div 
                  className="platform-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="platform-description">{platform.description}</p>
                  
                  {accounts[platform.id].length > 0 && (
                    <div className="connected-accounts">
                      <h3>Connected Accounts</h3>
                      <ul className="accounts-list">
                        {accounts[platform.id].map(account => (
                          <motion.li 
                            key={account.id} 
                            className="account-item"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <img src={account.profilePic} alt={account.name} className="account-avatar" />
                            <span className="account-name">{account.name}</span>
                            <button 
                              className="disconnect-btn" 
                              onClick={() => handleDisconnect(platform.id, account.id)}
                              disabled={loading}
                            >
                              <FaTrash /> Disconnect
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {(platform.multipleAllowed || accounts[platform.id].length === 0) && (
                    <button 
                      className="connect-button" 
                      style={{ backgroundColor: platform.color }}
                      onClick={() => handleConnect(platform.id)}
                      disabled={loading}
                    >
                      <FaPlus /> {platform.connectMessage}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="features-section">
        <h2>Why Connect Your Social Accounts?</h2>
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          >
            <div className="feature-icon">
              <FaCheck />
            </div>
            <h3>Centralized Management</h3>
            <p>Manage all your social media accounts from a single dashboard.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          >
            <div className="feature-icon">
              <FaCheck />
            </div>
            <h3>Schedule Content</h3>
            <p>Plan and schedule your posts in advance across multiple platforms.</p>
          </motion.div>
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          >
            <div className="feature-icon">
              <FaCheck />
            </div>
            <h3>Analyze Performance</h3>
            <p>Track engagement and performance metrics for all your social channels.</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialAccounts;
