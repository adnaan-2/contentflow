import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ContentFlow</h1>
          <p>The all-in-one platform for managing your content efficiently</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2>About Us</h2>
          <p className="section-intro">We're on a mission to simplify content management for everyone.</p>
          <div className="about-grid">
            <div className="about-item">
              <h3>Our Story</h3>
              <p>Founded in 2023, ContentFlow began with a simple idea: make content management accessible to everyone, regardless of technical skill.</p>
            </div>
            <div className="about-item">
              <h3>Our Mission</h3>
              <p>We're committed to providing intuitive tools that help businesses and creators focus on what matters most - creating great content.</p>
            </div>
            <div className="about-item">
              <h3>Our Team</h3>
              <p>Our diverse team brings together expertise in design, engineering, and content strategy to build the best platform possible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2>Features</h2>
          <p className="section-intro">Everything you need to create, manage, and publish content</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Content Editor</h3>
              <p>Intuitive drag-and-drop editor with rich formatting options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Workflow Management</h3>
              <p>Streamline your content pipeline from draft to publication</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track performance with comprehensive analytics dashboards</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>SEO Tools</h3>
              <p>Optimize your content for better search visibility</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Notifications</h3>
              <p>Stay updated with real-time notifications and alerts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your content from any device, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <h2>Pricing Plans</h2>
          <p className="section-intro">Choose the plan that works best for you</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Basic</h3>
                <p className="price">$9<span>/month</span></p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Basic content editor</li>
                  <li>5 GB storage</li>
                  <li>1 user</li>
                  <li>Email support</li>
                </ul>
              </div>
              <button className="pricing-button">Choose Plan</button>
            </div>
            <div className="pricing-card popular">
              <div className="popular-tag">Most Popular</div>
              <div className="pricing-header">
                <h3>Pro</h3>
                <p className="price">$29<span>/month</span></p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>Advanced content editor</li>
                  <li>20 GB storage</li>
                  <li>5 users</li>
                  <li>Priority support</li>
                  <li>Analytics dashboard</li>
                </ul>
              </div>
              <button className="pricing-button">Choose Plan</button>
            </div>
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <p className="price">$99<span>/month</span></p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li>All Pro features</li>
                  <li>Unlimited storage</li>
                  <li>Unlimited users</li>
                  <li>24/7 dedicated support</li>
                  <li>Custom integrations</li>
                  <li>Advanced security</li>
                </ul>
              </div>
              <button className="pricing-button">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth" className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-form login-form">
              <h2>Login</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="loginEmail">Email</label>
                  <input type="email" id="loginEmail" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Password</label>
                  <input type="password" id="loginPassword" placeholder="Enter your password" required />
                </div>
                <div className="form-group">
                  <a href="#forgot" className="forgot-password">Forgot password?</a>
                </div>
                <button type="submit" className="auth-button">Login</button>
              </form>
            </div>
            
            <div className="auth-divider">
              <div className="line"></div>
              <span>OR</span>
              <div className="line"></div>
            </div>
            
            <div className="auth-form signup-form">
              <h2>Sign Up</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="signupName">Full Name</label>
                  <input type="text" id="signupName" placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="signupEmail">Email</label>
                  <input type="email" id="signupEmail" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPassword">Password</label>
                  <input type="password" id="signupPassword" placeholder="Create a password" required />
                </div>
                <div className="form-group">
                  <label htmlFor="signupConfirmPassword">Confirm Password</label>
                  <input type="password" id="signupConfirmPassword" placeholder="Confirm your password" required />
                </div>
                <button type="submit" className="auth-button">Create Account</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>ContentFlow</h3>
              <p>Simplifying content management since 2023</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#docs">Documentation</a></li>
                  <li><a href="#support">Support</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#cookies">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2023-2025 ContentFlow. All rights reserved.</p>
            <div className="social-icons">
              <a href="#twitter" className="social-icon">Twitter</a>
              <a href="#facebook" className="social-icon">Facebook</a>
              <a href="#linkedin" className="social-icon">LinkedIn</a>
              <a href="#instagram" className="social-icon">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;