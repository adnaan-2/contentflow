import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setFormData({ name: userData.name });
    }
    
    // Then fetch fresh data from server
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/profile');
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({ name: userData.name });
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      // We don't set error here as we might still have data from localStorage
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.put('/api/profile/update', formData);
      
      if (response.data.success) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError('');
    setPasswordSuccess('');
    
    // Form validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const response = await api.put('/api/profile/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        setPasswordSuccess('Password changed successfully!');
        // Clear the form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
     
      {successMessage && (
        <div className="success-message" role="alert">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      <div className="profile-card">
        {/* Top section with smaller profile picture */}
        <div className="profile-picture-section">          
          <div className="profile-image-container">
            <img 
              src="/profile.jpg"
              alt="Profile" 
              className="profile-image" 
            />
          </div>
        </div>
        
        {/* Flex container for side-by-side sections */}
        <div className="profile-content-wrapper">
          {/* Left section - Profile details */}
          <div className="profile-details-section">
            <h2>Profile Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="static-field">{user.email}</div>
                <small>Email cannot be changed</small>
              </div>
              <button 
                type="submit" 
                className="save-button" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
          
          {/* Right section - Password change */}
          <div className="password-section">
            <h2>Change Password</h2>
            
            {passwordSuccess && (
              <div className="success-message" role="alert">
                {passwordSuccess}
              </div>
            )}
            
            {passwordError && (
              <div className="error-message" role="alert">
                {passwordError}
              </div>
            )}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  name="currentPassword" 
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword" 
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="password-button" 
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;