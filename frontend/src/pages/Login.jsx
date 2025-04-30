import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import '../styles/Homepage.css';

const Login = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set success message from location state if it exists
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Clear any existing success message

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccessMessage('Login successful!');
        
        // Navigate to dashboard or previous attempted page
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setFormData({ ...formData, password: '' }); // Clear password on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-container">
          <div className="auth-form login-form">
            <h2>Login</h2>
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
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input 
                  type="email" 
                  id="loginEmail" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input 
                  type="password" 
                  id="loginPassword" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <p className="auth-redirect">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;