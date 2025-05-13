import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaCrown, FaRocket, FaRegCheckCircle } from 'react-icons/fa';
import api from '../utils/api';
import '../styles/Subscription.css';

const Subscription = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
    fetchUserSubscription();
  }, []);

  const fetchUserSubscription = async () => {
    try {
      const response = await api.get('/api/subscription');
      if (response.data.success) {
        const userData = response.data.user;
        setUser(prev => ({...prev, ...userData}));
        localStorage.setItem('user', JSON.stringify({
          ...JSON.parse(localStorage.getItem('user')),
          ...userData
        }));
      }
    } catch (err) {
      console.error("Error fetching subscription data:", err);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setError('');
    setSuccess('');
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a plan first');
      return;
    }

    setPaymentProcessing(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, this would connect to a payment processor like Stripe
      // For now, we'll just simulate the process
      const response = await api.post('/api/subscription/subscribe', { 
        planId: selectedPlan 
      });
      
      if (response.data.success) {
        setSuccess('Subscription updated successfully!');
        // Update user data in state and localStorage
        const updatedUser = response.data.user;
        setUser(prev => ({...prev, ...updatedUser}));
        localStorage.setItem('user', JSON.stringify({
          ...JSON.parse(localStorage.getItem('user')),
          ...updatedUser
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process subscription');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get current plan name
  const getCurrentPlanName = () => {
    if (!user || !user.subscription) return 'Free Plan';
    
    switch(user.subscription.plan) {
      case 'premium_monthly':
        return 'Premium Monthly';
      case 'premium_yearly':
        return 'Premium Yearly';
      default:
        return 'Free Plan';
    }
  };

  if (!user) {
    return <div className="subscription-loading">Loading subscription information...</div>;
  }

  return (
    <div className="subscription-container">
    
      {success && (
        <div className="subscription-success-message" role="alert">
          {success}
        </div>
      )}
      
      {error && (
        <div className="subscription-error-message" role="alert">
          {error}
        </div>
      )}
      
      <div className="current-plan-info">
        <h2>Current Plan: <span className="plan-name">{getCurrentPlanName()}</span></h2>
        
        {user.subscription && user.subscription.plan !== 'free' && (
          <div className="subscription-details">
            <p><strong>Status:</strong> {user.subscription.status || 'Active'}</p>
            <p><strong>Next billing date:</strong> {formatDate(user.subscription.nextBillingDate)}</p>
          </div>
        )}
      </div>
      
      <div className="subscription-plans">
        {/* Free Plan */}
        <div 
          className={`plan-card ${user.subscription?.plan === 'free' ? 'current-plan' : ''} ${selectedPlan === 'free' ? 'selected-plan' : ''}`}
          onClick={() => handlePlanSelect('free')}
        >
          <div className="plan-header">
            <h3>Free Plan</h3>
            <p className="plan-price">$0<span>/month</span></p>
          </div>
          
          <div className="plan-features">
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Connect Social Accounts</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Schedule Posts</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Basic Analytics</p>
            </div>
            <div className="feature">
              <FaTimes className="feature-icon not-included" />
              <p>AI Generated Ads</p>
            </div>
            <div className="feature">
              <FaTimes className="feature-icon not-included" />
              <p>Performance Reports</p>
            </div>
            <div className="feature">
              <FaTimes className="feature-icon not-included" />
              <p>Song & Hashtag Recommendations</p>
            </div>
          </div>
          
          {user.subscription?.plan === 'free' ? (
            <button className="current-plan-button" disabled>Current Plan</button>
          ) : (
            <button 
              className={`plan-button ${selectedPlan === 'free' ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect('free');
              }}
            >
              Select Plan
            </button>
          )}
        </div>
        
        {/* Premium Monthly Plan */}
        <div 
          className={`plan-card premium ${user.subscription?.plan === 'premium_monthly' ? 'current-plan' : ''} ${selectedPlan === 'premium_monthly' ? 'selected-plan' : ''}`}
          onClick={() => handlePlanSelect('premium_monthly')}
        >
          <div className="plan-badge">
            <FaCrown /> Popular
          </div>
          <div className="plan-header">
            <h3>Premium Monthly</h3>
            <p className="plan-price">$10<span>/month</span></p>
          </div>
          
          <div className="plan-features">
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Connect Social Accounts</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Schedule Posts</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Advanced Analytics</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>AI Generated Ads</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Performance Reports</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Song & Hashtag Recommendations</p>
            </div>
          </div>
          
          {user.subscription?.plan === 'premium_monthly' ? (
            <button className="current-plan-button" disabled>Current Plan</button>
          ) : (
            <button 
              className={`plan-button premium-button ${selectedPlan === 'premium_monthly' ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect('premium_monthly');
              }}
            >
              Select Plan
            </button>
          )}
        </div>
        
        {/* Premium Yearly Plan */}
        <div 
          className={`plan-card premium-yearly ${user.subscription?.plan === 'premium_yearly' ? 'current-plan' : ''} ${selectedPlan === 'premium_yearly' ? 'selected-plan' : ''}`}
          onClick={() => handlePlanSelect('premium_yearly')}
        >
          <div className="plan-badge best-value">
            <FaRocket /> Best Value
          </div>
          <div className="plan-header">
            <h3>Premium Yearly</h3>
            <p className="plan-price">$100<span>/year</span></p>
            <p className="plan-savings">Save $20 (16%)</p>
          </div>
          
          <div className="plan-features">
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Connect Social Accounts</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Schedule Posts</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Advanced Analytics</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>AI Generated Ads</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Performance Reports</p>
            </div>
            <div className="feature">
              <FaCheck className="feature-icon included" />
              <p>Song & Hashtag Recommendations</p>
            </div>
          </div>
          
          {user.subscription?.plan === 'premium_yearly' ? (
            <button className="current-plan-button" disabled>Current Plan</button>
          ) : (
            <button 
              className={`plan-button premium-yearly-button ${selectedPlan === 'premium_yearly' ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect('premium_yearly');
              }}
            >
              Select Plan
            </button>
          )}
        </div>
      </div>
      
      {selectedPlan && selectedPlan !== user.subscription?.plan && (
        <div className="subscription-action">
          <button 
            className="subscribe-button"
            onClick={handleSubscribe}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? 'Processing...' : (
              selectedPlan === 'free' ? 'Downgrade to Free' : 'Upgrade Subscription'
            )}
          </button>
          <p className="subscription-note">
            {selectedPlan !== 'free' ? 
              'You will be charged immediately. Subscriptions automatically renew until canceled.' : 
              'Downgrading to the free plan will take effect at the end of your current billing period.'
            }
          </p>
        </div>
      )}
      
      {user.subscription && user.subscription.plan !== 'free' && (
        <div className="cancel-subscription">
          <h3>Need to Cancel?</h3>
          <p>You can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period.</p>
          <button 
            className="cancel-button"
            onClick={() => handlePlanSelect('free')}
          >
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscription;