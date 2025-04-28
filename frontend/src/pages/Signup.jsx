import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Homepage.css';

const Signup = () => {
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
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
    <section className="auth-section">
      <div className="container">
        <div className="auth-container">
          <div className="auth-form signup-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signupName">Full Name</label>
                <input 
                  type="text" 
                  id="signupName" 
                  name="name" 
                  value={signupData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="signupEmail">Email</label>
                <input 
                  type="email" 
                  id="signupEmail" 
                  name="email" 
                  value={signupData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Password</label>
                <input 
                  type="password" 
                  id="signupPassword" 
                  name="password" 
                  value={signupData.password} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="signupConfirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  id="signupConfirmPassword" 
                  name="confirmPassword" 
                  value={signupData.confirmPassword} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <button type="submit" className="auth-button">Create Account</button>
              <p className="auth-redirect">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default Signup;