import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icon components as fallback
const X = ({ size = 20 }) => <span style={{ fontSize: size }}>✕</span>;
const RotateCcw = ({ size = 16 }) => <span style={{ fontSize: size }}>🔄</span>;
const Maximize2 = ({ size = 20 }) => <span style={{ fontSize: size }}>⛶</span>;
const Minimize2 = ({ size = 20 }) => <span style={{ fontSize: size }}>⛷</span>;

const FunnelPreviewModal = ({ isOpen, onClose, funnelData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userResponses, setUserResponses] = useState({});

  // Sample funnel steps based on the funnel type
  const getFunnelSteps = () => {
    if (!funnelData) return [];
    
    switch (funnelData.type) {
      case 'dating':
        return [
          {
            id: 'step-1',
            type: 'video',
            title: 'Welcome Video',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              message: 'Welcome to our exclusive dating platform!'
            }
          },
          {
            id: 'step-2',
            type: 'question',
            title: 'Age Verification',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              question: 'Are you over 18 years old?',
              options: ['Yes', 'No']
            }
          },
          {
            id: 'step-3',
            type: 'form',
            title: 'Profile Setup',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              fields: [
                { name: 'name', type: 'text', label: 'Full Name', required: true },
                { name: 'email', type: 'email', label: 'Email Address', required: true },
                { name: 'age', type: 'number', label: 'Age', required: true }
              ]
            }
          },
          {
            id: 'step-4',
            type: 'pricing',
            title: 'Premium Membership',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              plans: [
                { name: 'Basic', price: '$9.99', features: ['5 matches/day', 'Basic filters'] },
                { name: 'Premium', price: '$19.99', features: ['Unlimited matches', 'Advanced filters'] }
              ]
            }
          }
        ];
      case 'ecommerce':
        return [
          {
            id: 'step-1',
            type: 'video',
            title: 'Product Demo',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              message: 'Discover our amazing products!'
            }
          },
          {
            id: 'step-2',
            type: 'form',
            title: 'Customer Info',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              fields: [
                { name: 'name', type: 'text', label: 'Full Name', required: true },
                { name: 'email', type: 'email', label: 'Email Address', required: true }
              ]
            }
          },
          {
            id: 'step-3',
            type: 'pricing',
            title: 'Choose Plan',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              plans: [
                { name: 'Starter', price: '$29', features: ['Basic features', 'Email support'] },
                { name: 'Pro', price: '$99', features: ['All features', 'Priority support'] }
              ]
            }
          }
        ];
      default:
        return [
          {
            id: 'step-1',
            type: 'video',
            title: 'Welcome',
            content: {
              videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
              message: 'Welcome to our funnel!'
            }
          }
        ];
    }
  };

  const steps = getFunnelSteps();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setUserResponses({});
  };

  const handleResponse = (stepId, response) => {
    setUserResponses(prev => ({
      ...prev,
      [stepId]: response
    }));
    // Auto-advance after response
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleFormSubmit = (formData) => {
    setUserResponses(prev => ({
      ...prev,
      [steps[currentStep].id]: formData
    }));
    // Auto-advance after form submission
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const renderStep = (step) => {
    if (!step) return null;
    
    // Ensure step.content exists and is an object
    if (!step.content || typeof step.content !== 'object') {
      step.content = {};
    }

    switch (step.type) {
      case 'video':
        return (
          <div className="preview-video-container">
            <video 
              src={step.content.videoUrl}
              className="preview-video"
              controls
              autoPlay
              muted
              loop
            />
            <div className="preview-message">
              <h3>{step.title}</h3>
              <p>{step.content.message}</p>
            </div>
          </div>
        );

      case 'question':
        return (
          <div className="preview-question-container">
            {step.content.videoUrl && (
              <div className="preview-video-container">
                <video 
                  src={step.content.videoUrl}
                  className="preview-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <h3>{step.title}</h3>
            <p className="preview-question">{step.content.question}</p>
            <div className="preview-options">
              {step.content.options.map((option, index) => (
                <button
                  key={index}
                  className="preview-option-btn"
                  onClick={() => handleResponse(step.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="preview-form-container">
            {step.content.videoUrl && (
              <div className="preview-video-container">
                <video 
                  src={step.content.videoUrl}
                  className="preview-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <h3>{step.title}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData);
              handleFormSubmit(data);
            }}>
              {step.content.fields.map((field, index) => (
                <div key={index} className="preview-form-group">
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="preview-form-input"
                  />
                </div>
              ))}
              <button type="submit" className="preview-form-submit">
                Continue
              </button>
            </form>
          </div>
        );

      case 'pricing':
        return (
          <div className="preview-pricing-container">
            {step.content.videoUrl && (
              <div className="preview-video-container">
                <video 
                  src={step.content.videoUrl}
                  className="preview-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <h3>{step.title}</h3>
            <div className="preview-pricing-plans">
              {step.content.plans.map((plan, index) => (
                <div key={index} className="preview-pricing-plan">
                  <h4>{plan.name}</h4>
                  <div className="preview-price">{plan.price}</div>
                  <ul className="preview-features">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                  <button 
                    className="preview-select-plan"
                    onClick={() => handleResponse(step.id, plan.name)}
                  >
                    Select {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="preview-default">
            {step.content.videoUrl && (
              <div className="preview-video-container">
                <video 
                  src={step.content.videoUrl}
                  className="preview-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <h3>{step.title}</h3>
            <p>Step content will be rendered here</p>
          </div>
        );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setUserResponses({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`preview-modal-overlay ${isFullscreen ? 'fullscreen' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`preview-modal ${isFullscreen ? 'fullscreen' : ''}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="preview-header">
            <div className="preview-title">
              <h2>Funnel Preview: {funnelData?.name || 'Untitled Funnel'}</h2>
              <span className="preview-step-indicator">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="preview-controls">
              <button
                className="preview-control-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                className="preview-control-btn"
                onClick={onClose}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="preview-content">
            {steps.length > 0 && renderStep(steps[currentStep])}
          </div>

          {/* Navigation */}
          <div className="preview-navigation">
            <button
              className="preview-nav-btn"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            
            <div className="preview-progress">
              <div className="preview-progress-bar">
                <div 
                  className="preview-progress-fill"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="preview-nav-actions">
              <button
                className="preview-nav-btn secondary"
                onClick={handleRestart}
              >
                <RotateCcw size={16} />
                Restart
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  className="preview-nav-btn primary"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  className="preview-nav-btn success"
                  onClick={onClose}
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FunnelPreviewModal;
