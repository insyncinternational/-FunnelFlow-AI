import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/AnimatedFunnelFlow.css';

const AnimatedFunnelFlow = ({ steps = [], onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleOptionSelect = (option) => {
    if (isAnimating) return;
    
    setSelectedOption(option);
    setAnswers(prev => ({
      ...prev,
      [currentStep]: option
    }));
    
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedOption(null);
      } else {
        onComplete?.(answers);
      }
      setIsAnimating(false);
    }, 800);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSelectedOption(null);
    }
  };

  const handleVideoChange = (direction) => {
    if (!currentStepData.videos || currentStepData.videos.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentVideoIndex(prev => 
        prev < currentStepData.videos.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentVideoIndex(prev => 
        prev > 0 ? prev - 1 : currentStepData.videos.length - 1
      );
    }
  };

  // Auto-advance videos every 5 seconds
  useEffect(() => {
    if (!currentStepData.videos || currentStepData.videos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex(prev => 
        prev < currentStepData.videos.length - 1 ? prev + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStepData.videos]);

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return (
      <div className="funnel-complete">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="completion-card"
        >
          <h2>🎉 Funnel Complete!</h2>
          <p>Thank you for completing our funnel flow.</p>
          <button onClick={() => window.location.reload()}>
            Start Over
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="animated-funnel-container">
      {/* Progress Bar */}
      <div className="funnel-progress">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="progress-text">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Question Card - Moved Above Video */}
      <motion.div
        className="question-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="question-title">{currentStepData.title}</h2>
        {currentStepData.description && (
          <p className="question-description">{currentStepData.description}</p>
        )}
      </motion.div>

      {/* Video/Content Area */}
      <motion.div
        className="funnel-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {(currentStepData.video || currentStepData.videos) && (
          <div className="video-container">
            <AnimatePresence mode="wait">
              <motion.video
                key={currentStepData.videos ? currentStepData.videos[currentVideoIndex] : currentStepData.video}
                src={currentStepData.videos ? currentStepData.videos[currentVideoIndex] : currentStepData.video}
                className="funnel-video"
                autoPlay
                muted
                loop
                playsInline
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            
            <div className="video-overlay">
              <div className="unmute-prompt">
                <div className="unmute-icon">🔊</div>
                <span>UNMUTE ME</span>
              </div>
              
              {/* Video Navigation Controls */}
              {currentStepData.videos && currentStepData.videos.length > 1 && (
                <div className="video-controls">
                  <button 
                    className="video-nav-btn prev-btn"
                    onClick={() => handleVideoChange('prev')}
                  >
                    ‹
                  </button>
                  <div className="video-indicators">
                    {currentStepData.videos.map((_, index) => (
                      <button
                        key={index}
                        className={`video-dot ${index === currentVideoIndex ? 'active' : ''}`}
                        onClick={() => setCurrentVideoIndex(index)}
                      />
                    ))}
                  </div>
                  <button 
                    className="video-nav-btn next-btn"
                    onClick={() => handleVideoChange('next')}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentStepData.image && (
          <div className="image-container">
            <img
              src={currentStepData.image}
              alt={currentStepData.title}
              className="funnel-image"
            />
          </div>
        )}
      </motion.div>

      {/* Options Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="options-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {currentStepData.options?.map((option, index) => (
            <motion.div
              key={option.id || index}
              className={`option-card ${selectedOption?.id === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              <div className="option-content">
                <div className="option-icon">{option.icon}</div>
                <div className="option-text">
                  <h3>{option.title}</h3>
                  {option.description && (
                    <p>{option.description}</p>
                  )}
                </div>
              </div>
              {selectedOption?.id === option.id && (
                <motion.div
                  className="selected-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="funnel-navigation">
        {currentStep > 0 && (
          <motion.button
            className="nav-button prev-button"
            onClick={handlePrevious}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Previous
          </motion.button>
        )}
        
        <div className="step-indicators">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`step-dot ${index <= currentStep ? 'active' : ''}`}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                backgroundColor: index <= currentStep ? '#2E2A76' : '#E5E7EB'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedFunnelFlow;
