import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepModal, setShowStepModal] = useState(false);

  const steps = [
    {
      id: 1,
      number: 1,
      title: 'Create Your Funnel',
      description: 'Use our drag-and-drop builder to design your conversion funnel with videos, forms, and interactive elements.',
      details: {
        features: [
          'Drag & Drop Interface',
          'Pre-built Templates',
          'Custom Branding',
          'Mobile Responsive Design'
        ],
        timeRequired: '5-10 minutes',
        difficulty: 'Beginner',
        tools: ['Funnel Builder', 'Template Library', 'Brand Kit']
      }
    },
    {
      id: 2,
      number: 2,
      title: 'Generate AI Videos',
      description: 'Create professional talking avatars with HeyGen integration. Upload scripts and get videos in minutes.',
      details: {
        features: [
          'AI Avatar Generation',
          'Voice Cloning',
          'Script to Video',
          'Multiple Languages'
        ],
        timeRequired: '2-5 minutes',
        difficulty: 'Easy',
        tools: ['HeyGen Integration', 'Voice Studio', 'Script Editor']
      }
    },
    {
      id: 3,
      number: 3,
      title: 'Launch & Optimize',
      description: 'Deploy your funnel and track performance with advanced analytics. A/B test to maximize conversions.',
      details: {
        features: [
          'One-Click Publishing',
          'Real-time Analytics',
          'A/B Testing',
          'Conversion Tracking'
        ],
        timeRequired: '1-2 minutes',
        difficulty: 'Easy',
        tools: ['Analytics Dashboard', 'A/B Test Manager', 'Performance Tracker']
      }
    }
  ];

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setShowStepModal(true);
  };

  const closeStepModal = () => {
    setShowStepModal(false);
    setSelectedStep(null);
  };

  const features = [
    {
      icon: '🎬',
      title: 'AI-Powered Video Generation',
      description: 'Create professional talking avatars with HeyGen integration. Generate videos from scripts in minutes.',
    },
    {
      icon: '🎨',
      title: 'Drag & Drop Funnel Builder',
      description: 'Build conversion funnels with our intuitive drag-and-drop interface. No coding required.',
    },
    {
      icon: '🎭',
      title: 'Custom Avatars & Voices',
      description: 'Choose from hundreds of avatars or create your own. Clone your voice for brand consistency.',
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track conversions, A/B test funnels, and optimize performance with detailed analytics.',
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Digital Marketing Agency",
      avatar: "👩‍💼",
      text: "This platform revolutionized our client funnels. We can create professional videos in minutes instead of hours!",
      rating: 5
    },
    {
      name: "Mike Chen",
      company: "E-commerce Store",
      avatar: "👨‍💻",
      text: "The HeyGen integration is incredible. Our conversion rates increased by 40% with personalized video funnels.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      company: "Coaching Business",
      avatar: "👩‍🎓",
      text: "Finally, a platform that makes video funnels accessible. The drag-and-drop builder is so intuitive.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for trying out the platform",
      features: [
        "3 Funnels",
        "Basic Avatars",
        "Standard Voices",
        "Basic Analytics",
        "Community Support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "For growing businesses",
      features: [
        "Unlimited Funnels",
        "Premium Avatars",
        "Custom Voices",
        "Advanced Analytics",
        "A/B Testing",
        "Priority Support",
        "Custom Domains"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For agencies and large teams",
      features: [
        "Everything in Professional",
        "White-label Solution",
        "API Access",
        "Custom Integrations",
        "Dedicated Support",
        "Team Collaboration",
        "Advanced Security"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
        </div>
        
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Build <span className="gradient-text">AI-Powered Video Funnels</span> in Minutes
            </h1>
            <p className="hero-subtitle">
              Create conversion funnels with professional talking avatars, 
              automated video generation, and advanced analytics. No video production skills required.
            </p>
            
            <div className="hero-cta">
              <Link to="/signup" className="cta-primary">
                🚀 Start Building Free
              </Link>
              <Link to="/login" className="cta-secondary">
                🎬 Watch Demo
              </Link>
              <button 
                onClick={() => {
                  localStorage.setItem('authToken', 'demo-jwt-token');
                  localStorage.setItem('user', JSON.stringify({
                    id: 'demo-1',
                    name: 'Demo User',
                    email: 'demo@saasfunnel.com',
                    subscription: 'pro',
                    avatar: '👤'
                  }));
                  window.location.href = '/dashboard';
                }}
                className="cta-demo"
              >
                🎯 Try Demo Now
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Funnels Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">40%</span>
                <span className="stat-label">Higher Conversions</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-video"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="video-container">
              <video 
                src="https://res.cloudinary.com/domnocrwi/video/upload/v1759220570/Joneast_exbb7f.mp4"
                className="hero-video-player"
                controls
                playsInline
                muted
                autoPlay
                loop
                poster="https://res.cloudinary.com/domnocrwi/image/upload/v1759220570/video-poster.jpg"
              />
              <div className="video-overlay">
                <div className="video-branding">
                  <div className="brand-logo">🚀 FunnelFlow AI</div>
                  <div className="video-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <div className="time-display">0:08 / 0:14</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything You Need to Build <span className="gradient-text">High-Converting Funnels</span>
            </h2>
            <p className="section-subtitle">
              From AI-powered video generation to advanced analytics, we've got you covered.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in just 3 simple steps</p>
          </div>
          
          <div className="steps-grid">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className="step-card clickable"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                onClick={() => handleStepClick(step)}
              >
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <div className="step-hint">
                  <span className="hint-text">Click to learn more</span>
                  <span className="hint-icon">👆</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Join thousands of businesses already using our platform</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="testimonial-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="testimonial-content">
                  <div className="testimonial-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="testimonial-text">
                    <p>"{testimonial.text}"</p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">⭐</span>
                    ))}
                  </div>
                  <div className="testimonial-author">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Choose the plan that's right for your business</p>
          </div>
          
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index} 
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                
                <div className="pricing-features">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-item">
                      <span className="feature-check">✅</span>
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/signup" 
                  className={`pricing-cta ${plan.popular ? 'cta-primary' : 'cta-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="cta-title">
              Ready to Build Your First <span className="gradient-text">AI Video Funnel</span>?
            </h2>
            <p className="cta-subtitle">
              Join thousands of businesses already creating high-converting video funnels with our platform.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-primary large">
                🚀 Start Building Free
              </Link>
              <Link to="/login" className="cta-secondary large">
                📞 Book a Demo
              </Link>
            </div>
            <p className="cta-note">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step Properties Modal */}
      {showStepModal && selectedStep && (
        <motion.div 
          className="step-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeStepModal}
        >
          <motion.div 
            className="step-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-step-number">{selectedStep.number}</div>
              <h2 className="modal-title">{selectedStep.title}</h2>
              <button className="modal-close" onClick={closeStepModal}>
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <p className="modal-description">{selectedStep.description}</p>
              
              <div className="step-details">
                <div className="detail-section">
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {selectedStep.details.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✅</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-section">
                  <h3>Step Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Time Required:</span>
                      <span className="info-value">{selectedStep.details.timeRequired}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Difficulty:</span>
                      <span className="info-value">{selectedStep.details.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Tools Used</h3>
                  <div className="tools-list">
                    {selectedStep.details.tools.map((tool, index) => (
                      <span key={index} className="tool-tag">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <Link to="/signup" className="btn btn-primary" onClick={closeStepModal}>
                  Get Started
                </Link>
                <button className="btn btn-secondary" onClick={closeStepModal}>
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;
