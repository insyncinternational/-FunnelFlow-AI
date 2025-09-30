import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/TemplatesPage.css';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [creatingTemplate, setCreatingTemplate] = useState(null);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'leadgen', name: 'Lead Generation', icon: '📧' },
    { id: 'dating', name: 'Dating', icon: '💕' },
    { id: 'coaching', name: 'Coaching', icon: '🎯' },
    { id: 'saas', name: 'SaaS', icon: '💻' }
  ];

  const templateData = [
    {
      id: 1,
      name: 'E-commerce Sales Funnel',
      category: 'ecommerce',
      description: 'Complete sales funnel for online stores with product showcase, checkout, and thank you pages.',
      image: '🛒',
      features: ['Product Showcase', 'Shopping Cart', 'Checkout Process', 'Order Confirmation'],
      difficulty: 'Beginner',
      timeToSetup: '15 minutes',
      conversionRate: '12.5%',
      popular: true
    },
    {
      id: 2,
      name: 'Lead Generation Funnel',
      category: 'leadgen',
      description: 'Capture leads with compelling offers, email collection, and follow-up sequences.',
      image: '📧',
      features: ['Lead Magnet', 'Email Capture', 'Thank You Page', 'Follow-up Sequence'],
      difficulty: 'Easy',
      timeToSetup: '10 minutes',
      conversionRate: '8.2%',
      popular: true
    },
    {
      id: 3,
      name: 'Dating App Funnel',
      category: 'dating',
      description: 'Create engaging profiles and match users with interactive video content.',
      image: '💕',
      features: ['Profile Creation', 'Video Introductions', 'Matching System', 'Chat Interface'],
      difficulty: 'Intermediate',
      timeToSetup: '20 minutes',
      conversionRate: '15.3%',
      popular: false
    },
    {
      id: 4,
      name: 'Coaching Program Funnel',
      category: 'coaching',
      description: 'Sell coaching programs with video testimonials and enrollment process.',
      image: '🎯',
      features: ['Program Overview', 'Testimonials', 'Pricing Tiers', 'Enrollment Form'],
      difficulty: 'Easy',
      timeToSetup: '12 minutes',
      conversionRate: '9.7%',
      popular: true
    },
    {
      id: 5,
      name: 'SaaS Onboarding Funnel',
      category: 'saas',
      description: 'Guide new users through product features with interactive tutorials.',
      image: '💻',
      features: ['Welcome Video', 'Feature Tour', 'Setup Guide', 'Success Metrics'],
      difficulty: 'Intermediate',
      timeToSetup: '18 minutes',
      conversionRate: '11.8%',
      popular: false
    },
    {
      id: 6,
      name: 'Webinar Funnel',
      category: 'leadgen',
      description: 'Promote and host webinars with registration and follow-up sequences.',
      image: '📺',
      features: ['Webinar Registration', 'Reminder Emails', 'Live Stream', 'Replay Access'],
      difficulty: 'Easy',
      timeToSetup: '8 minutes',
      conversionRate: '6.4%',
      popular: true
    }
  ];

  useEffect(() => {
    // Simulate loading templates
    setTimeout(() => {
      setTemplates(templateData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template) => {
    setCreatingTemplate(template.id);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      // Create a new funnel based on the template with proper step configurations
      const templateSteps = getTemplateSteps(template);
      const templateConnections = getTemplateConnections(template);
      
      const newFunnel = {
        id: `funnel_${Date.now()}`,
        name: `${template.name}`,
        type: template.category,
        status: 'draft',
        description: template.description,
        templateId: template.id,
        steps: templateSteps,
        connections: templateConnections,
        lastModified: new Date().toISOString(),
        views: 0,
        conversions: 0,
        conversionRate: 0
      };

      // Save to localStorage
      localStorage.setItem(`funnel_${newFunnel.id}`, JSON.stringify(newFunnel));
      
      // Show success message
      alert(`Template "${template.name}" has been created! Opening in funnel builder...`);
      
      // Navigate to funnel builder with the new funnel
      navigate(`/funnel-builder/${newFunnel.id}`);
    }, 500);
  };

  const getTemplateSteps = (template) => {
    // Return different step configurations based on template type
    switch (template.category) {
      case 'ecommerce':
        return [
          { 
            id: 'step-1', 
            type: 'video', 
            title: 'Product Introduction', 
            order: 1, 
            x: 100, 
            y: 100, 
            config: { 
              videoUrl: '',
              description: 'Introduce your product with an engaging video'
            } 
          },
          { 
            id: 'step-2', 
            type: 'form', 
            title: 'Customer Information', 
            order: 2, 
            x: 400, 
            y: 100, 
            config: { 
              fields: ['name', 'email', 'phone'],
              title: 'Get Your Product Now'
            } 
          },
          { 
            id: 'step-3', 
            type: 'pricing', 
            title: 'Pricing Options', 
            order: 3, 
            x: 700, 
            y: 100, 
            config: { 
              plans: [
                { name: 'Basic', price: '$29', features: ['Feature 1', 'Feature 2'] },
                { name: 'Pro', price: '$59', features: ['All Basic', 'Feature 3', 'Feature 4'] }
              ]
            } 
          },
          { 
            id: 'step-4', 
            type: 'redirect', 
            title: 'Thank You', 
            order: 4, 
            x: 1000, 
            y: 100, 
            config: { 
              url: '/thank-you',
              message: 'Thank you for your purchase!'
            } 
          }
        ];
      
      case 'leadgen':
        return [
          { 
            id: 'step-1', 
            type: 'video', 
            title: 'Lead Magnet Video', 
            order: 1, 
            x: 100, 
            y: 100, 
            config: { 
              videoUrl: '',
              description: 'Present your valuable lead magnet'
            } 
          },
          { 
            id: 'step-2', 
            type: 'form', 
            title: 'Lead Capture Form', 
            order: 2, 
            x: 400, 
            y: 100, 
            config: { 
              fields: ['name', 'email'],
              title: 'Get Your Free Guide',
              description: 'Enter your details to receive our exclusive guide'
            } 
          },
          { 
            id: 'step-3', 
            type: 'redirect', 
            title: 'Download Page', 
            order: 3, 
            x: 700, 
            y: 100, 
            config: { 
              url: '/download',
              message: 'Your download is ready!'
            } 
          }
        ];
      
      case 'dating':
        return [
          { 
            id: 'step-1', 
            type: 'video', 
            title: 'Welcome Video', 
            order: 1, 
            x: 100, 
            y: 100, 
            config: { 
              videoUrl: '',
              description: 'Welcome to our dating platform'
            } 
          },
          { 
            id: 'step-2', 
            type: 'form', 
            title: 'Profile Setup', 
            order: 2, 
            x: 400, 
            y: 100, 
            config: { 
              fields: ['name', 'age', 'interests', 'bio'],
              title: 'Create Your Profile'
            } 
          },
          { 
            id: 'step-3', 
            type: 'question', 
            title: 'Compatibility Quiz', 
            order: 3, 
            x: 700, 
            y: 100, 
            config: { 
              question: 'What are you looking for in a relationship?',
              options: ['Serious relationship', 'Casual dating', 'Friendship', 'Not sure yet']
            } 
          },
          { 
            id: 'step-4', 
            type: 'redirect', 
            title: 'Matching Page', 
            order: 4, 
            x: 1000, 
            y: 100, 
            config: { 
              url: '/matches',
              message: 'Find your perfect match!'
            } 
          }
        ];
      
      case 'coaching':
        return [
          { 
            id: 'step-1', 
            type: 'video', 
            title: 'Program Overview', 
            order: 1, 
            x: 100, 
            y: 100, 
            config: { 
              videoUrl: '',
              description: 'Learn about our coaching program'
            } 
          },
          { 
            id: 'step-2', 
            type: 'form', 
            title: 'Application Form', 
            order: 2, 
            x: 400, 
            y: 100, 
            config: { 
              fields: ['name', 'email', 'goals', 'experience'],
              title: 'Apply for Coaching'
            } 
          },
          { 
            id: 'step-3', 
            type: 'pricing', 
            title: 'Investment Options', 
            order: 3, 
            x: 700, 
            y: 100, 
            config: { 
              plans: [
                { name: '1-on-1 Coaching', price: '$200/session', features: ['Personal sessions', 'Custom plan'] },
                { name: 'Group Coaching', price: '$99/month', features: ['Group sessions', 'Community access'] }
              ]
            } 
          },
          { 
            id: 'step-4', 
            type: 'redirect', 
            title: 'Welcome', 
            order: 4, 
            x: 1000, 
            y: 100, 
            config: { 
              url: '/welcome',
              message: 'Welcome to the program!'
            } 
          }
        ];
      
      case 'saas':
        return [
          { 
            id: 'step-1', 
            type: 'video', 
            title: 'Product Demo', 
            order: 1, 
            x: 100, 
            y: 100, 
            config: { 
              videoUrl: '',
              description: 'See how our SaaS product works'
            } 
          },
          { 
            id: 'step-2', 
            type: 'form', 
            title: 'Sign Up', 
            order: 2, 
            x: 400, 
            y: 100, 
            config: { 
              fields: ['name', 'email', 'company', 'role'],
              title: 'Start Your Free Trial'
            } 
          },
          { 
            id: 'step-3', 
            type: 'question', 
            title: 'Use Case Selection', 
            order: 3, 
            x: 700, 
            y: 100, 
            config: { 
              question: 'What will you use this for?',
              options: ['Project Management', 'Team Collaboration', 'Customer Support', 'Other']
            } 
          },
          { 
            id: 'step-4', 
            type: 'redirect', 
            title: 'Dashboard', 
            order: 4, 
            x: 1000, 
            y: 100, 
            config: { 
              url: '/dashboard',
              message: 'Welcome to your dashboard!'
            } 
          }
        ];
      
      default:
        return [
          { 
            id: 'step-1', 
            type: 'video', 
            title: 'Welcome Video', 
            order: 1, 
            x: 100, 
            y: 100, 
            config: { 
              videoUrl: '',
              description: 'Welcome to your funnel'
            } 
          },
          { 
            id: 'step-2', 
            type: 'form', 
            title: 'Lead Capture', 
            order: 2, 
            x: 400, 
            y: 100, 
            config: { 
              fields: ['name', 'email'],
              title: 'Get Started'
            } 
          },
          { 
            id: 'step-3', 
            type: 'redirect', 
            title: 'Thank You', 
            order: 3, 
            x: 700, 
            y: 100, 
            config: { 
              url: '/thank-you',
              message: 'Thank you!'
            } 
          }
        ];
    }
  };

  const getTemplateConnections = (template) => {
    // Create connections between steps based on template
    const steps = getTemplateSteps(template);
    const connections = [];
    
    for (let i = 0; i < steps.length - 1; i++) {
      connections.push({
        from: steps[i].id,
        to: steps[i + 1].id
      });
    }
    
    return connections;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Easy': return 'text-blue-600 bg-blue-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="templates-page">
      <div className="container">
        {/* Header */}
        <div className="templates-header">
          <div className="header-content">
            <h1>Funnel Templates</h1>
            <p>Choose from our professionally designed templates to get started quickly</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <h3>Browse by Category</h3>
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="templates-section">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading templates...</p>
            </div>
          ) : (
            <div className="templates-grid">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className={`template-card ${template.popular ? 'popular' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {template.popular && (
                    <div className="popular-badge">Most Popular</div>
                  )}
                  
                  <div className="template-header">
                    <div className="template-image">{template.image}</div>
                    <div className="template-info">
                      <h3 className="template-name">{template.name}</h3>
                      <p className="template-description">{template.description}</p>
                    </div>
                  </div>

                  <div className="template-features">
                    <h4>Key Features:</h4>
                    <ul className="features-list">
                      {template.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="feature-item">
                          <span className="feature-icon">✅</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="template-stats">
                    <div className="stat">
                      <span className="stat-label">Difficulty</span>
                      <span className={`stat-value ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Setup Time</span>
                      <span className="stat-value">{template.timeToSetup}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Avg. Conversion</span>
                      <span className="stat-value">{template.conversionRate}</span>
                    </div>
                  </div>

                  <div className="template-actions">
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="btn btn-primary"
                      disabled={creatingTemplate === template.id}
                    >
                      {creatingTemplate === template.id ? (
                        <>
                          <span className="loading-spinner-small"></span>
                          Creating...
                        </>
                      ) : (
                        'Use This Template'
                      )}
                    </button>
                    <button className="btn btn-secondary">
                      Preview
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="templates-actions">
          <h3>Need Something Custom?</h3>
          <div className="actions-grid">
            <Link to="/funnel-builder" className="action-card">
              <div className="action-icon">🎨</div>
              <h4>Create from Scratch</h4>
              <p>Build a custom funnel with our drag-and-drop builder</p>
            </Link>
            <Link to="/dashboard" className="action-card">
              <div className="action-icon">📊</div>
              <h4>View Dashboard</h4>
              <p>Manage your existing funnels and templates</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
