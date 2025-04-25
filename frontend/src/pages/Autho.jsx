import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';

const AuthSection = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    if (e.target.name === 'loginEmail' || e.target.name === 'loginPassword') {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    } else {
      setSignupData({ ...signupData, [e.target.name]: e.target.value });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', loginData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', signupData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <section id="auth" className="auth-section">
      <div className="container">
        <div className="auth-container">
          {/* Login Form */}
          <div className="auth-form login-form">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input type="email" id="loginEmail" name="email" value={loginData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input type="password" id="loginPassword" name="password" value={loginData.password} onChange={handleInputChange} required />
              </div>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
              <button type="submit" className="auth-button">Login</button>
            </form>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <div className="line"></div>
            <span>OR</span>
            <div className="line"></div>
          </div>

          {/* Signup Form */}
          <div className="auth-form signup-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signupName">Full Name</label>
                <input type="text" id="signupName" name="name" value={signupData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="signupEmail">Email</label>
                <input type="email" id="signupEmail" name="email" value={signupData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Password</label>
                <input type="password" id="signupPassword" name="password" value={signupData.password} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="signupConfirmPassword">Confirm Password</label>
                <input type="password" id="signupConfirmPassword" name="confirmPassword" value={signupData.confirmPassword} onChange={handleInputChange} required />
              </div>
              <button type="submit" className="auth-button">Create Account</button>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
      </div>
    </section>
  );
};

export default AuthSection;
