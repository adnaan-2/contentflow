import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Homepage.css';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
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

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-container">
          <div className="auth-form login-form">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input 
                  type="email" 
                  id="loginEmail" 
                  name="email" 
                  value={loginData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input 
                  type="password" 
                  id="loginPassword" 
                  name="password" 
                  value={loginData.password} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
              <button type="submit" className="auth-button">Login</button>
              <p className="auth-redirect">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </form>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default Login;