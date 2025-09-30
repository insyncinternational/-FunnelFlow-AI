import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BillingPage = () => {
  const [user, setUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingHistory, setBillingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setCurrentPlan(userData.subscription || 'free');
    
    // Simulate loading billing history
    setTimeout(() => {
      setBillingHistory([
        {
          id: 1,
          date: '2024-01-15',
          amount: '$29.00',
          status: 'paid',
          plan: 'Professional',
          invoice: 'INV-001'
        },
        {
          id: 2,
          date: '2023-12-15',
          amount: '$29.00',
          status: 'paid',
          plan: 'Professional',
          invoice: 'INV-002'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for trying out the platform',
      features: [
        '3 Funnels',
        'Basic Avatars',
        'Standard Voices',
        'Basic Analytics',
        'Community Support'
      ],
      current: currentPlan === 'free',
      cta: 'Current Plan'
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'For growing businesses',
      features: [
        'Unlimited Funnels',
        'Premium Avatars',
        'Custom Voices',
        'Advanced Analytics',
        'A/B Testing',
        'Priority Support',
        'Custom Domains'
      ],
      current: currentPlan === 'pro',
      cta: currentPlan === 'pro' ? 'Current Plan' : 'Upgrade Now',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For agencies and large teams',
      features: [
        'Everything in Professional',
        'White-label Solution',
        'API Access',
        'Custom Integrations',
        'Dedicated Support',
        'Team Collaboration',
        'Advanced Security'
      ],
      current: currentPlan === 'enterprise',
      cta: currentPlan === 'enterprise' ? 'Current Plan' : 'Contact Sales'
    }
  ];

  const handlePlanChange = (planName) => {
    if (planName === 'free') return;
    
    if (planName === 'enterprise') {
      alert('Please contact our sales team for Enterprise pricing.');
      return;
    }
    
    // Simulate plan change
    const updatedUser = { ...user, subscription: planName === 'Professional' ? 'pro' : planName };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCurrentPlan(planName === 'Professional' ? 'pro' : planName);
    alert(`Successfully upgraded to ${planName} plan!`);
  };

  return (
    <div className="billing-page">
      <div className="container">
        {/* Header */}
        <div className="billing-header">
          <div className="header-content">
            <h1>Billing & Subscription</h1>
            <p>Manage your subscription and billing information</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Current Plan */}
        <div className="current-plan-section">
          <h2>Current Plan</h2>
          <div className="current-plan-card">
            <div className="plan-info">
              <h3>{plans.find(p => p.current)?.name || 'Starter'}</h3>
              <p>{plans.find(p => p.current)?.description || 'Perfect for trying out the platform'}</p>
              <div className="plan-price">
                <span className="price">{plans.find(p => p.current)?.price || 'Free'}</span>
                <span className="period">/{plans.find(p => p.current)?.period || 'forever'}</span>
              </div>
            </div>
            <div className="plan-status">
              <span className="status-badge active">Active</span>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="plans-section">
          <h2>Available Plans</h2>
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.current ? 'current' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && !plan.current && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                
                <div className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-item">
                      <span className="feature-check">✅</span>
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  className={`plan-cta ${plan.current ? 'current' : ''}`}
                  onClick={() => handlePlanChange(plan.name)}
                  disabled={plan.current}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="billing-history-section">
          <h2>Billing History</h2>
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading billing history...</p>
            </div>
          ) : (
            <div className="billing-history">
              {billingHistory.length > 0 ? (
                <div className="history-table">
                  <div className="table-header">
                    <div className="header-cell">Date</div>
                    <div className="header-cell">Plan</div>
                    <div className="header-cell">Amount</div>
                    <div className="header-cell">Status</div>
                    <div className="header-cell">Invoice</div>
                  </div>
                  {billingHistory.map((item) => (
                    <div key={item.id} className="table-row">
                      <div className="table-cell">{item.date}</div>
                      <div className="table-cell">{item.plan}</div>
                      <div className="table-cell">{item.amount}</div>
                      <div className="table-cell">
                        <span className={`status-badge ${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="table-cell">
                        <a href="#" className="invoice-link">{item.invoice}</a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history">
                  <p>No billing history available.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="payment-method-section">
          <h2>Payment Method</h2>
          <div className="payment-card">
            <div className="payment-info">
              <div className="card-icon">💳</div>
              <div className="card-details">
                <h4>Visa ending in 4242</h4>
                <p>Expires 12/25</p>
              </div>
            </div>
            <button className="btn btn-secondary">Update</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="billing-actions">
          <h3>Need Help?</h3>
          <div className="actions-grid">
            <Link to="/settings" className="action-card">
              <div className="action-icon">⚙️</div>
              <h4>Account Settings</h4>
              <p>Update your account information</p>
            </Link>
            <a href="mailto:support@funnelflow.com" className="action-card">
              <div className="action-icon">📧</div>
              <h4>Contact Support</h4>
              <p>Get help with billing questions</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
