import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaCheck } from 'react-icons/fa';
import api from '../utils/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import '../styles/SocialAccounts.css';
import '../styles/DashboardLayout.css';

export default function SocialAccounts() {
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false
  });
  const [fbUserData, setFbUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  useEffect(() => {
    // Check for connection status on component mount
    checkExistingConnections();
    
    // Check for query parameters from OAuth callback
    const facebookConnected = queryParams.get('facebook_connected');
    const error = queryParams.get('error');
    
    if (facebookConnected === 'true') {
      toast.success("Facebook account connected successfully!");
      checkExistingConnections(); // Refresh connection status
    }
    
    if (error) {
      toast.error(`Connection error: ${error}`);
    }
    
    // Clean up URL
    const cleanUrl = window.location.pathname;
    if (window.location.search) {
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);
  
  // Check existing connections with our backend
  const checkExistingConnections = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/social-accounts/status');
      
      if (response.data) {
        setConnectedAccounts(response.data);
        
        // If Facebook is connected, get the user data
        if (response.data.facebook) {
          await getFacebookAccountDetails();
        }
      }
    } catch (error) {
      console.error("Error checking account connections:", error);
      toast.error("Failed to check social account connections");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get Facebook account details if connected
  const getFacebookAccountDetails = async () => {
    try {
      const response = await api.get('/api/social-accounts/facebook/pages');
      
      if (response.data.success) {
        // We need to make another call to get full user data
        // This is a placeholder - you might want to add an endpoint to get complete data
        setFbUserData({
          pages: response.data.pages
        });
      }
    } catch (error) {
      console.error("Error fetching Facebook details:", error);
    }
  };

  // Handle Facebook login using server-side flow
  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      
      // Get the auth URL from our backend
      const response = await api.get('/api/social-accounts/facebook/auth-url');
      
      // Redirect to Facebook's OAuth page
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error initiating Facebook login:", error);
      toast.error("Failed to connect to Facebook");
      setIsLoading(false);
    }
  };
  
  // Handle Facebook disconnect
  const handleFacebookDisconnect = async () => {
    try {
      setIsLoading(true);
      
      await api.post('/api/social-accounts/facebook/disconnect');
      
      setConnectedAccounts(prev => ({...prev, facebook: false}));
      setFbUserData(null);
      toast.success("Facebook account disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting Facebook:", error);
      toast.error("Failed to disconnect Facebook account");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Facebook card content
  const renderFacebookCard = () => {
    if (connectedAccounts.facebook && fbUserData) {
      return (
        <div className="dashboard-card connected">
          <div className="card-header">
            <FaFacebook className="social-icon facebook" />
            <h2>Facebook</h2>
            <FaCheck className="connected-icon" />
          </div>
          <div className="connected-info">
            {fbUserData.pages && fbUserData.pages.length > 0 && (
              <div className="pages-info">
                <h4>Connected Pages ({fbUserData.pages.length})</h4>
                <ul>
                  {fbUserData.pages.slice(0, 3).map(page => (
                    <li key={page.id}>{page.name}</li>
                  ))}
                  {fbUserData.pages.length > 3 && <li>+{fbUserData.pages.length - 3} more</li>}
                </ul>
              </div>
            )}
            {fbUserData.pages && fbUserData.pages.length === 0 && (
              <p className="no-pages">No pages found. Please connect a Facebook page.</p>
            )}
          </div>
          <button 
            className="disconnect-btn"
            onClick={handleFacebookDisconnect}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Disconnect'}
          </button>
        </div>
      );
    } else {
      return (
        <div className="dashboard-card">
          <FaFacebook className="social-icon facebook" />
          <h2>Facebook</h2>
          <p>Connect your Facebook page to schedule and publish posts</p>
          <button 
            className="connect-btn" 
            onClick={handleFacebookLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Connect'}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h1>Social Media Accounts</h1>
        <p>Connect your social media accounts to manage and schedule content across platforms</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Facebook card - dynamic based on connection status */}
        {renderFacebookCard()}
        
        {/* Instagram card - for now just static */}
        <div className="dashboard-card">
          <FaInstagram className="social-icon instagram" />
          <h2>Instagram</h2>
          <p>Connect your Instagram account to schedule and publish posts</p>
          <button className="connect-btn">Connect</button>
        </div>
        
        {/* Twitter card - for now just static */}
        <div className="dashboard-card">
          <FaTwitter className="social-icon twitter" />
          <h2>Twitter</h2>
          <p>Connect your Twitter account to schedule and publish tweets</p>
          <button className="connect-btn">Connect</button>
        </div>
        
        {/* LinkedIn card - for now just static */}
        <div className="dashboard-card">
          <FaLinkedin className="social-icon linkedin" />
          <h2>LinkedIn</h2>
          <p>Connect your LinkedIn profile to schedule and publish posts</p>
          <button className="connect-btn">Connect</button>
        </div>
      </div>
    </div>
  );
}
