import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';
import '../styles/SocialAccounts.css';

const SocialAccounts = () => {
  const [linkedAccounts, setLinkedAccounts] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false
  });

  // Add saveToken function
  const saveToken = async (platform, token) => {
    try {
      await axiosInstance.post(`/api/social-accounts/save-token/${platform}`, { token });
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      const response = await axiosInstance.get('/api/social-accounts/status');
      setLinkedAccounts(response.data);
    } catch (error) {
      console.error('Error fetching linked accounts:', error);
      toast.error('Failed to fetch account status');
    }
  };

  const handleConnect = async (platform) => {
    try {
      const response = await axiosInstance.get(`/api/social-accounts/connect/${platform}`);
      const { authUrl } = response.data;
      
      // Open OAuth window
      const width = 600;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const authWindow = window.open(
        authUrl,
        `${platform}Auth`,
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth callback
      const handleMessage = async (event) => {
        if (event.data.type === `${platform}_auth`) {
          const { token } = event.data;
          await saveToken(platform, token);
          toast.success(`Successfully connected to ${platform}!`);
          setLinkedAccounts(prev => ({ ...prev, [platform]: true }));
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      toast.error(`Failed to connect to ${platform}`);
      console.error(`Error connecting to ${platform}:`, error);
    }
  };

  const handleDisconnect = async (platform) => {
    try {
      await axiosInstance.post(`/api/social-accounts/disconnect/${platform}`);
      setLinkedAccounts(prev => ({ ...prev, [platform]: false }));
      toast.success(`Disconnected from ${platform}`);
    } catch (error) {
      toast.error(`Failed to disconnect from ${platform}`);
      console.error(`Error disconnecting from ${platform}:`, error);
    }
  };

  return (
    <div className="social-accounts-container">
      <h1>Connect Your Social Media Accounts</h1>
      <div className="social-accounts-grid">
        <div className="social-account-card">
          <FaFacebook className="social-icon facebook" />
          <h2>Facebook</h2>
          {linkedAccounts.facebook ? (
            <button 
              className="disconnect-btn"
              onClick={() => handleDisconnect('facebook')}
            >
              Disconnect
            </button>
          ) : (
            <button 
              className="connect-btn"
              onClick={() => handleConnect('facebook')}
            >
              Connect
            </button>
          )}
        </div>

        <div className="social-account-card">
          <FaInstagram className="social-icon instagram" />
          <h2>Instagram</h2>
          {linkedAccounts.instagram ? (
            <button 
              className="disconnect-btn"
              onClick={() => handleDisconnect('instagram')}
            >
              Disconnect
            </button>
          ) : (
            <button 
              className="connect-btn"
              onClick={() => handleConnect('instagram')}
            >
              Connect
            </button>
          )}
        </div>

        <div className="social-account-card">
          <FaTwitter className="social-icon twitter" />
          <h2>Twitter</h2>
          {linkedAccounts.twitter ? (
            <button 
              className="disconnect-btn"
              onClick={() => handleDisconnect('twitter')}
            >
              Disconnect
            </button>
          ) : (
            <button 
              className="connect-btn"
              onClick={() => handleConnect('twitter')}
            >
              Connect
            </button>
          )}
        </div>

        <div className="social-account-card">
          <FaLinkedin className="social-icon linkedin" />
          <h2>LinkedIn</h2>
          {linkedAccounts.linkedin ? (
            <button 
              className="disconnect-btn"
              onClick={() => handleDisconnect('linkedin')}
            >
              Disconnect
            </button>
          ) : (
            <button 
              className="connect-btn"
              onClick={() => handleConnect('linkedin')}
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialAccounts;