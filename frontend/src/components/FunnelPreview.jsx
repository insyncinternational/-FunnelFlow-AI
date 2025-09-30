import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FunnelPreview = ({ steps, connections, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleResponse = (response) => {
    setUserResponses(prev => ({
      ...prev,
      [currentStep.id]: response
    }));
    
    // Auto-advance after response
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleFormSubmit = (formData) => {
    setUserResponses(prev => ({
      ...prev,
      [currentStep.id]: formData
    }));
    
    // Auto-advance after form submission
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const renderStep = (step) => {
    if (!step) return null;
    
    // Ensure step.config exists and is an object
    if (!step.config || typeof step.config !== 'object') {
      step.config = {};
    }

    switch (step.type) {
      case 'video':
        return (
          <div className="funnel-step video-step">
            {step.config?.videoUrl && (
              <div className="step-video-container">
                <video 
                  src={step.config?.videoUrl}
                  className="step-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <div className="step-content">
              <h2 className="step-title">{step.title}</h2>
              <p className="step-message">{step.config?.question || step.config?.message}</p>
              {step.config?.options && (
                <div className="step-options">
                  {step.config.options.map((option, index) => (
                    <button
                      key={index}
                      className="option-btn"
                      onClick={() => handleResponse(option.label)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'question':
        return (
          <div className="funnel-step question-step">
            {step.config?.videoUrl && (
              <div className="step-video-container">
                <video 
                  src={step.config?.videoUrl}
                  className="step-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <div className="step-content">
              <h2 className="step-title">{step.title}</h2>
              <p className="step-question">{step.config?.question}</p>
              <div className="step-options">
                {step.config?.options?.map((option, index) => (
                  <button
                    key={index}
                    className="option-btn"
                    onClick={() => handleResponse(option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="funnel-step form-step">
            {step.config?.videoUrl && (
              <div className="step-video-container">
                <video 
                  src={step.config?.videoUrl}
                  className="step-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <div className="step-content">
              <h2 className="step-title">{step.title}</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                handleFormSubmit(data);
              }}>
                {step.config?.fields?.map((field, index) => (
                  <div key={index} className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="form-input"
                    />
                  </div>
                ))}
                <button type="submit" className="submit-btn">
                  Continue
                </button>
              </form>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="funnel-step pricing-step">
            {step.config?.videoUrl && (
              <div className="step-video-container">
                <video 
                  src={step.config?.videoUrl}
                  className="step-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <div className="step-content">
              <h2 className="step-title">{step.title}</h2>
              <div className="pricing-plans">
                {step.config?.plans?.map((plan, index) => (
                  <div key={index} className="pricing-plan">
                    <h3>{plan.name}</h3>
                    <div className="plan-price">{plan.price}</div>
                    <ul className="plan-features">
                      {plan.features?.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature}</li>
                      ))}
                    </ul>
                    <button 
                      className="select-plan-btn"
                      onClick={() => handleResponse(plan.name)}
                    >
                      Select {plan.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'redirect':
        return (
          <div className="funnel-step redirect-step">
            {step.config?.videoUrl && (
              <div className="step-video-container">
                <video 
                  src={step.config?.videoUrl}
                  className="step-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <div className="step-content">
              <h2 className="step-title">{step.title}</h2>
              <p className="step-message">{step.config?.message}</p>
              <div className="redirect-actions">
                <button 
                  className="redirect-btn"
                  onClick={() => window.open(step.config?.redirectUrl, '_blank')}
                >
                  Continue to {step.config?.redirectUrl}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="funnel-step default-step">
            {step.config?.videoUrl && (
              <div className="step-video-container">
                <video 
                  src={step.config?.videoUrl}
                  className="step-video"
                  controls
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
            <div className="step-content">
              <h2 className="step-title">{step.title}</h2>
              <p>Step content will be rendered here</p>
            </div>
          </div>
        );
    }
  };

  if (isCompleted) {
    return (
      <div className="funnel-preview-overlay">
        <div className="funnel-preview-container">
          <div className="completion-screen">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="completion-icon"
            >
              ✅
            </motion.div>
            <h2>Funnel Complete!</h2>
            <p>Thank you for going through our funnel. Your responses have been recorded.</p>
            <div className="completion-actions">
              <button className="btn btn-primary" onClick={onClose}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="funnel-preview-overlay">
      <div className="funnel-preview-container">
        {/* Header */}
        <div className="preview-header">
          <div className="preview-title">
            <h2>Funnel Preview</h2>
            <span className="step-indicator">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="preview-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep(currentStep)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="preview-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            ← Previous
          </button>
          
          <div className="nav-info">
            <span className="step-name">{currentStep?.title}</span>
          </div>
          
          <button
            className="nav-btn next-btn"
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FunnelPreview;
