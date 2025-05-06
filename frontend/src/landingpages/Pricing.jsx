import React from 'react';
import '../styles/Homepage.css';

const PricingSection = () => (
  <section id="pricing" className="pricing-section">
    <div className="container">
      <h2>Pricing Plans</h2>
      <p className="section-intro">Choose the plan that works best for you</p>
      <div className="pricing-grid">
        {/* Basic */}
        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Basic</h3>
            <p className="price">$9<span>/month</span></p>
          </div>
          <ul className="pricing-features">
            <li>Basic content editor</li>
            <li>5 GB storage</li>
            <li>1 user</li>
            <li>Email support</li>
          </ul>
          <button className="pricing-button">Choose Plan</button>
        </div>

        {/* Pro */}
        <div className="pricing-card popular">
          <div className="popular-tag">Most Popular</div>
          <div className="pricing-header">
            <h3>Pro</h3>
            <p className="price">$29<span>/month</span></p>
          </div>
          <ul className="pricing-features">
            <li>Advanced content editor</li>
            <li>20 GB storage</li>
            <li>5 users</li>
            <li>Priority support</li>
            <li>Analytics dashboard</li>
          </ul>
          <button className="pricing-button">Choose Plan</button>
        </div>

        {/* Enterprise */}
        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Enterprise</h3>
            <p className="price">$99<span>/month</span></p>
          </div>
          <ul className="pricing-features">
            <li>All Pro features</li>
            <li>Unlimited storage</li>
            <li>Unlimited users</li>
            <li>24/7 dedicated support</li>
            <li>Custom integrations</li>
            <li>Advanced security</li>
          </ul>
          <button className="pricing-button">Contact Sales</button>
        </div>
      </div>
    </div>
  </section>
);

export default PricingSection;
