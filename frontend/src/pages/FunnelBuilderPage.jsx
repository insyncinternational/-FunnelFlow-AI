import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FunnelPreview from '../components/FunnelPreview';
import '../styles/FunnelPreview.css';

const FunnelBuilderPage = () => {
  const { id } = useParams();
  const [funnel, setFunnel] = useState(null);
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [draggedStep, setDraggedStep] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [publishStatus, setPublishStatus] = useState(null);
  const canvasRef = useRef(null);

  // Auto-save function to prevent data loss
  const autoSave = (stepsData, connectionsData) => {
    try {
      const funnelData = {
        id: funnel?.id || 'new',
        name: funnel?.name || 'My Funnel',
        description: funnel?.description || 'Build your conversion funnel',
        steps: stepsData,
        connections: connectionsData,
        lastModified: new Date().toISOString()
      };
      
      localStorage.setItem(`funnel_${funnelData.id}`, JSON.stringify(funnelData));
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Load funnel data - only reset if it's a new funnel or no saved data exists
  useEffect(() => {
    const loadFunnelData = async () => {
      try {
        // Check if we have saved data for this funnel
        const savedData = localStorage.getItem(`funnel_${id || 'new'}`);
        
        if (savedData && id !== 'new') {
          // Load existing funnel data
          const parsedData = JSON.parse(savedData);
          setFunnel(parsedData);
          setSteps(parsedData.steps || []);
          setConnections(parsedData.connections || []);
        } else {
          // Only initialize with default data for new funnels
          if (id === 'new' || !id) {
            setFunnel({
              id: id || 'new',
              name: 'My Funnel',
              description: 'Build your conversion funnel',
              steps: [
                {
                  id: 'step-1',
                  type: 'video',
                  title: 'Welcome Video',
                  order: 1,
                  config: {
                    videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
                    question: 'Welcome to our platform!',
                    options: [
                      { label: 'Get Started', next: 'step-2' }
                    ]
                  }
                },
                {
                  id: 'step-2',
                  type: 'question',
                  title: 'Age Verification',
                  order: 2,
                  config: {
                    question: 'Are you over 18 years old?',
                    options: [
                      { label: 'Yes', next: 'step-3' },
                      { label: 'No', next: 'end' }
                    ]
                  }
                },
                {
                  id: 'step-3',
                  type: 'form',
                  title: 'Lead Capture',
                  order: 3,
                  config: {
                    fields: [
                      { name: 'name', type: 'text', label: 'Full Name', required: true },
                      { name: 'email', type: 'email', label: 'Email', required: true }
                    ]
                  }
                }
              ]
            });
            setSteps([
              { id: 'step-1', type: 'video', title: 'Welcome Video', order: 1, x: 100, y: 100, config: {} },
              { id: 'step-2', type: 'question', title: 'Age Verification', order: 2, x: 400, y: 100, config: {} },
              { id: 'step-3', type: 'form', title: 'Lead Capture', order: 3, x: 700, y: 100, config: {} }
            ]);
            
            // Initialize connections
            setConnections([
              { from: 'step-1', to: 'step-2', condition: 'default' },
              { from: 'step-2', to: 'step-3', condition: 'yes' },
              { from: 'step-2', to: 'end', condition: 'no' }
            ]);
          }
        }
      } catch (error) {
        console.error('Error loading funnel data:', error);
        // Fallback to default data if loading fails
        setFunnel({
          id: id || 'new',
          name: 'My Funnel',
          description: 'Build your conversion funnel'
        });
        setSteps([]);
        setConnections([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFunnelData();
  }, [id]);

  const stepTypes = [
    { type: 'video', name: 'Video Step', icon: '🎬', description: 'Add a video with questions' },
    { type: 'question', name: 'Question Step', icon: '❓', description: 'Ask a single question' },
    { type: 'form', name: 'Form Step', icon: '📝', description: 'Collect user information' },
    { type: 'pricing', name: 'Pricing Step', icon: '💰', description: 'Show pricing plans' },
    { type: 'redirect', name: 'Redirect Step', icon: '🔗', description: 'Redirect to external URL' },
    { type: 'timer', name: 'Timer Step', icon: '⏰', description: 'Countdown timer with urgency' },
    { type: 'social', name: 'Social Proof', icon: '👥', description: 'Show testimonials and reviews' },
    { type: 'quiz', name: 'Quiz Step', icon: '🧠', description: 'Interactive quiz with scoring' },
    { type: 'calendar', name: 'Calendar Step', icon: '📅', description: 'Date/time picker for scheduling' },
    { type: 'upload', name: 'File Upload', icon: '📤', description: 'Allow users to upload files' },
    { type: 'survey', name: 'Survey Step', icon: '📊', description: 'Multi-question survey' },
    { type: 'chat', name: 'Live Chat', icon: '💬', description: 'Live chat integration' },
    { type: 'email', name: 'Email Capture', icon: '📧', description: 'Email subscription form' },
    { type: 'phone', name: 'Phone Capture', icon: '📞', description: 'Phone number collection' },
    { type: 'location', name: 'Location Step', icon: '📍', description: 'Get user location' },
    { type: 'payment', name: 'Payment Step', icon: '💳', description: 'Direct payment processing' },
    { type: 'waitlist', name: 'Waitlist Step', icon: '⏳', description: 'Join waitlist for early access' },
    { type: 'download', name: 'Download Step', icon: '⬇️', description: 'File download with lead capture' },
    { type: 'gallery', name: 'Image Gallery', icon: '🖼️', description: 'Showcase images or products' },
    { type: 'map', name: 'Map Step', icon: '🗺️', description: 'Interactive map with locations' }
  ];

  const addStep = (stepType) => {
    const newStep = {
      id: `step-${Date.now()}`,
      type: stepType,
      title: `${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Step`,
      order: steps.length + 1,
      x: 100 + (steps.length * 300),
      y: 100 + (Math.random() * 200),
      config: {}
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    
    // Auto-save changes
    autoSave(updatedSteps, connections);
  };

  const updateStep = (stepId, updates) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    setSteps(updatedSteps);
    
    // Auto-save changes
    autoSave(updatedSteps, connections);
  };

  const deleteStep = (stepId) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    setSteps(updatedSteps);
    
    if (selectedStep?.id === stepId) {
      setSelectedStep(null);
    }
    
    // Auto-save changes
    autoSave(updatedSteps, connections);
  };

  const moveStep = (dragIndex, hoverIndex) => {
    const draggedStep = steps[dragIndex];
    const newSteps = [...steps];
    newSteps.splice(dragIndex, 1);
    newSteps.splice(hoverIndex, 0, draggedStep);
    const updatedSteps = newSteps.map((step, index) => ({ ...step, order: index + 1 }));
    setSteps(updatedSteps);
    
    // Auto-save changes
    autoSave(updatedSteps, connections);
  };

  const updateStepPosition = (stepId, x, y) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, x, y } : step
    ));
  };

  const addConnection = (fromStepId, toStepId, condition = 'default') => {
    const newConnection = { from: fromStepId, to: toStepId, condition };
    const updatedConnections = [...connections, newConnection];
    setConnections(updatedConnections);
    
    // Auto-save changes
    autoSave(steps, updatedConnections);
  };

  const removeConnection = (fromStepId, toStepId) => {
    const updatedConnections = connections.filter(conn => 
      !(conn.from === fromStepId && conn.to === toStepId)
    );
    setConnections(updatedConnections);
    
    // Auto-save changes
    autoSave(steps, updatedConnections);
  };

  const clearAll = () => {
    setSteps([]);
    setConnections([]);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  // Handle Preview Button
  const handlePreview = () => {
    if (steps.length === 0) {
      setSaveStatus('Please add at least one step before previewing.');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }
    setIsPreview(!isPreview);
  };

  // Handle Save Funnel Button
  const handleSaveFunnel = async () => {
    setIsSaving(true);
    setSaveStatus('Saving...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const funnelData = {
        id: funnel?.id || 'new',
        name: funnel?.name || 'My Funnel',
        description: funnel?.description || 'Build your conversion funnel',
        steps: steps,
        connections: connections,
        lastModified: new Date().toISOString()
      };
      
      // Save to localStorage for demo
      localStorage.setItem(`funnel_${funnelData.id}`, JSON.stringify(funnelData));
      
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('Save failed. Please try again.');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Publish Button
  const handlePublish = async () => {
    if (steps.length === 0) {
      setPublishStatus('Please add at least one step before publishing.');
      setTimeout(() => setPublishStatus(null), 3000);
      return;
    }

    setIsPublishing(true);
    setPublishStatus('Publishing...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const funnelData = {
        id: funnel?.id || 'new',
        name: funnel?.name || 'My Funnel',
        description: funnel?.description || 'Build your conversion funnel',
        steps: steps,
        connections: connections,
        status: 'published',
        publishedAt: new Date().toISOString(),
        publicUrl: `https://funnelflow.ai/funnel/${funnel?.id || 'new'}`
      };
      
      // Save to localStorage for demo
      localStorage.setItem(`funnel_${funnelData.id}`, JSON.stringify(funnelData));
      
      setPublishStatus('Published successfully! Your funnel is now live.');
      setTimeout(() => setPublishStatus(null), 5000);
    } catch (error) {
      setPublishStatus('Publish failed. Please try again.');
      setTimeout(() => setPublishStatus(null), 3000);
    } finally {
      setIsPublishing(false);
    }
  };

  const loadTemplate = (templateName) => {
    switch(templateName) {
      case 'matchify':
        return loadMatchifyTemplate();
      case 'ecommerce':
        return loadEcommerceTemplate();
      case 'saas':
        return loadSaaSTemplate();
      case 'coaching':
        return loadCoachingTemplate();
      case 'realestate':
        return loadRealEstateTemplate();
      case 'fitness':
        return loadFitnessTemplate();
      case 'education':
        return loadEducationTemplate();
      default:
        return loadMatchifyTemplate();
    }
  };

  const loadMatchifyTemplate = () => {
    const templateSteps = [
      {
        id: 'step-1',
        type: 'video',
        title: 'Welcome Video',
        order: 1,
        x: 150,
        y: 150,
        config: {
          videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
          question: 'Welcome to our exclusive dating platform! Are you ready to find your perfect match?'
        }
      },
      {
        id: 'step-2',
        type: 'question',
        title: 'Age Verification',
        order: 2,
        x: 500,
        y: 150,
        config: {
          question: 'Are you over 18 years old?',
          options: [
            { label: 'Yes', next: 'step-3' },
            { label: 'No', next: 'end' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'form',
        title: 'Profile Setup',
        order: 3,
        x: 850,
        y: 150,
        config: {
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'age', type: 'number', label: 'Age', required: true },
            { name: 'location', type: 'text', label: 'City', required: true }
          ]
        }
      },
      {
        id: 'step-4',
        type: 'question',
        title: 'Dating Preferences',
        order: 4,
        x: 1200,
        y: 150,
        config: {
          question: 'What type of relationship are you looking for?',
          options: [
            { label: 'Serious Relationship', next: 'step-5' },
            { label: 'Casual Dating', next: 'step-5' },
            { label: 'Friendship', next: 'step-5' }
          ]
        }
      },
      {
        id: 'step-5',
        type: 'pricing',
        title: 'Premium Membership',
        order: 5,
        x: 150,
        y: 500,
        config: {
          plans: [
            { name: 'Basic', price: '$9.99', features: ['5 matches/day', 'Basic filters'] },
            { name: 'Premium', price: '$19.99', features: ['Unlimited matches', 'Advanced filters', 'Priority support'] }
          ]
        }
      },
      {
        id: 'step-6',
        type: 'question',
        title: 'Payment Method',
        order: 6,
        x: 500,
        y: 500,
        config: {
          question: 'How would you like to pay?',
          options: [
            { label: 'Credit Card', next: 'step-7' },
            { label: 'PayPal', next: 'step-7' },
            { label: 'Bank Transfer', next: 'step-7' }
          ]
        }
      },
      {
        id: 'step-7',
        type: 'form',
        title: 'Payment Details',
        order: 7,
        x: 850,
        y: 500,
        config: {
          fields: [
            { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
            { name: 'expiryDate', type: 'text', label: 'Expiry Date', required: true },
            { name: 'cvv', type: 'text', label: 'CVV', required: true },
            { name: 'billingAddress', type: 'text', label: 'Billing Address', required: true }
          ]
        }
      },
      {
        id: 'step-8',
        type: 'form',
        title: 'Payment Processing',
        order: 8,
        x: 1200,
        y: 500,
        config: {
          fields: [
            { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
            { name: 'expiryDate', type: 'text', label: 'Expiry Date', required: true },
            { name: 'cvv', type: 'text', label: 'CVV', required: true },
            { name: 'billingAddress', type: 'text', label: 'Billing Address', required: true }
          ]
        }
      },
      {
        id: 'step-9',
        type: 'question',
        title: 'Photo Upload',
        order: 9,
        x: 150,
        y: 850,
        config: {
          question: 'Upload your best photo to get more matches',
          options: [
            { label: 'Upload Photo', next: 'step-10' },
            { label: 'Skip for now', next: 'step-10' }
          ]
        }
      },
      {
        id: 'step-10',
        type: 'upload',
        title: 'Profile Photo',
        order: 10,
        x: 500,
        y: 850,
        config: {
          accept: 'image/*',
          maxSize: '5MB',
          multiple: false
        }
      },
      {
        id: 'step-11',
        type: 'question',
        title: 'Interests & Hobbies',
        order: 11,
        x: 850,
        y: 850,
        config: {
          question: 'What are your main interests?',
          options: [
            { label: 'Sports & Fitness', next: 'step-12' },
            { label: 'Music & Arts', next: 'step-12' },
            { label: 'Travel & Adventure', next: 'step-12' },
            { label: 'Technology', next: 'step-12' }
          ]
        }
      },
      {
        id: 'step-12',
        type: 'quiz',
        title: 'Personality Quiz',
        order: 12,
        x: 1200,
        y: 850,
        config: {
          questions: [
            {
              question: 'How do you prefer to spend your weekends?',
              options: ['Outdoor activities', 'Reading at home', 'Social events', 'Creative projects']
            },
            {
              question: 'What motivates you most?',
              options: ['Achievement', 'Relationships', 'Learning', 'Helping others']
            }
          ]
        }
      },
      {
        id: 'step-13',
        type: 'social',
        title: 'Social Proof',
        order: 13,
        x: 150,
        y: 1400,
        config: {
          testimonials: [
            { name: 'Sarah M.', text: 'Found my soulmate in just 2 weeks!', rating: 5 },
            { name: 'Mike D.', text: 'Amazing platform, highly recommend!', rating: 5 }
          ],
          stats: { users: '50,000+', matches: '1M+', success: '95%' }
        }
      },
      {
        id: 'step-14',
        type: 'timer',
        title: 'Limited Time Offer',
        order: 14,
        x: 500,
        y: 1400,
        config: {
          duration: 300, // 5 minutes
          message: 'Special discount expires in:',
          discount: '50% OFF'
        }
      },
      {
        id: 'step-15',
        type: 'redirect',
        title: 'Success Page',
        order: 15,
        x: 850,
        y: 1400,
        config: {
          redirectUrl: 'https://matchify.com/welcome',
          message: 'Welcome to Matchify! Your account has been created successfully. Start browsing matches now!'
        }
      }
    ];

    const templateConnections = [
      { from: 'step-1', to: 'step-2', condition: 'default' },
      { from: 'step-2', to: 'step-3', condition: 'yes' },
      { from: 'step-2', to: 'end', condition: 'no' },
      { from: 'step-3', to: 'step-4', condition: 'default' },
      { from: 'step-4', to: 'step-5', condition: 'default' },
      { from: 'step-5', to: 'step-6', condition: 'default' },
      { from: 'step-6', to: 'step-7', condition: 'default' },
      { from: 'step-7', to: 'step-8', condition: 'default' },
      { from: 'step-8', to: 'step-9', condition: 'default' },
      { from: 'step-9', to: 'step-10', condition: 'default' },
      { from: 'step-10', to: 'step-11', condition: 'default' },
      { from: 'step-11', to: 'step-12', condition: 'default' },
      { from: 'step-12', to: 'step-13', condition: 'default' },
      { from: 'step-13', to: 'step-14', condition: 'default' },
      { from: 'step-14', to: 'step-15', condition: 'default' }
    ];

    setSteps(templateSteps);
    setConnections(templateConnections);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const loadEcommerceTemplate = () => {
    const templateSteps = [
      {
        id: 'step-1',
        type: 'video',
        title: 'Product Demo',
        order: 1,
        x: 150,
        y: 150,
        config: {
          videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
          question: 'Discover our amazing products! Watch this quick demo to see what we offer.'
        }
      },
      {
        id: 'step-2',
        type: 'question',
        title: 'Product Interest',
        order: 2,
        x: 500,
        y: 150,
        config: {
          question: 'Which product interests you most?',
          options: [
            { label: 'Premium Collection', next: 'step-3' },
            { label: 'Basic Collection', next: 'step-3' },
            { label: 'Limited Edition', next: 'step-3' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'form',
        title: 'Customer Info',
        order: 3,
        x: 850,
        y: 150,
        config: {
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'phone', type: 'tel', label: 'Phone Number', required: true }
          ]
        }
      },
      {
        id: 'step-4',
        type: 'pricing',
        title: 'Product Pricing',
        order: 4,
        x: 1200,
        y: 150,
        config: {
          plans: [
            { name: 'Basic', price: '$29.99', features: ['1 Product', 'Standard Shipping'] },
            { name: 'Premium', price: '$59.99', features: ['3 Products', 'Free Shipping', 'Gift Wrap'] }
          ]
        }
      },
      {
        id: 'step-5',
        type: 'form',
        title: 'Shipping Details',
        order: 5,
        x: 150,
        y: 500,
        config: {
          fields: [
            { name: 'address', type: 'text', label: 'Shipping Address', required: true },
            { name: 'city', type: 'text', label: 'City', required: true },
            { name: 'zipcode', type: 'text', label: 'ZIP Code', required: true }
          ]
        }
      },
      {
        id: 'step-6',
        type: 'payment',
        title: 'Payment',
        order: 6,
        x: 500,
        y: 500,
        config: {
          amount: '$59.99',
          currency: 'USD'
        }
      },
      {
        id: 'step-7',
        type: 'redirect',
        title: 'Order Confirmation',
        order: 7,
        x: 850,
        y: 500,
        config: {
          redirectUrl: 'https://store.com/order-confirmation',
          message: 'Thank you for your order! You will receive a confirmation email shortly.'
        }
      }
    ];

    const templateConnections = [
      { from: 'step-1', to: 'step-2', condition: 'default' },
      { from: 'step-2', to: 'step-3', condition: 'default' },
      { from: 'step-3', to: 'step-4', condition: 'default' },
      { from: 'step-4', to: 'step-5', condition: 'default' },
      { from: 'step-5', to: 'step-6', condition: 'default' },
      { from: 'step-6', to: 'step-7', condition: 'default' }
    ];

    setSteps(templateSteps);
    setConnections(templateConnections);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const loadSaaSTemplate = () => {
    const templateSteps = [
      {
        id: 'step-1',
        type: 'video',
        title: 'Product Demo',
        order: 1,
        x: 150,
        y: 150,
        config: {
          videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
          question: 'See how our SaaS platform can transform your business in just 2 minutes!'
        }
      },
      {
        id: 'step-2',
        type: 'question',
        title: 'Business Size',
        order: 2,
        x: 500,
        y: 150,
        config: {
          question: 'How many employees does your company have?',
          options: [
            { label: '1-10 employees', next: 'step-3' },
            { label: '11-50 employees', next: 'step-3' },
            { label: '50+ employees', next: 'step-3' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'form',
        title: 'Company Info',
        order: 3,
        x: 850,
        y: 150,
        config: {
          fields: [
            { name: 'company', type: 'text', label: 'Company Name', required: true },
            { name: 'email', type: 'email', label: 'Work Email', required: true },
            { name: 'role', type: 'text', label: 'Your Role', required: true }
          ]
        }
      },
      {
        id: 'step-4',
        type: 'pricing',
        title: 'Pricing Plans',
        order: 4,
        x: 1200,
        y: 150,
        config: {
          plans: [
            { name: 'Starter', price: '$29/month', features: ['5 Users', 'Basic Features', 'Email Support'] },
            { name: 'Professional', price: '$99/month', features: ['25 Users', 'Advanced Features', 'Priority Support'] },
            { name: 'Enterprise', price: '$299/month', features: ['Unlimited Users', 'All Features', 'Dedicated Support'] }
          ]
        }
      },
      {
        id: 'step-5',
        type: 'calendar',
        title: 'Schedule Demo',
        order: 5,
        x: 150,
        y: 500,
        config: {
          title: 'Book a Demo Call',
          duration: 30
        }
      },
      {
        id: 'step-6',
        type: 'redirect',
        title: 'Demo Scheduled',
        order: 6,
        x: 500,
        y: 500,
        config: {
          redirectUrl: 'https://saas.com/demo-scheduled',
          message: 'Your demo has been scheduled! We will send you a calendar invite shortly.'
        }
      }
    ];

    const templateConnections = [
      { from: 'step-1', to: 'step-2', condition: 'default' },
      { from: 'step-2', to: 'step-3', condition: 'default' },
      { from: 'step-3', to: 'step-4', condition: 'default' },
      { from: 'step-4', to: 'step-5', condition: 'default' },
      { from: 'step-5', to: 'step-6', condition: 'default' }
    ];

    setSteps(templateSteps);
    setConnections(templateConnections);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const loadCoachingTemplate = () => {
    const templateSteps = [
      {
        id: 'step-1',
        type: 'video',
        title: 'Coach Introduction',
        order: 1,
        x: 150,
        y: 150,
        config: {
          videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
          question: 'Hi! I\'m your coach. Let me show you how I can help you achieve your goals.'
        }
      },
      {
        id: 'step-2',
        type: 'quiz',
        title: 'Goal Assessment',
        order: 2,
        x: 500,
        y: 150,
        config: {
          questions: [
            {
              question: 'What is your primary goal?',
              options: ['Career Growth', 'Health & Fitness', 'Relationships', 'Financial Freedom']
            },
            {
              question: 'How committed are you to change?',
              options: ['Very Committed', 'Somewhat Committed', 'Just Exploring', 'Not Sure']
            }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'form',
        title: 'Personal Info',
        order: 3,
        x: 850,
        y: 150,
        config: {
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'age', type: 'number', label: 'Age', required: true },
            { name: 'goals', type: 'text', label: 'Specific Goals', required: true }
          ]
        }
      },
      {
        id: 'step-4',
        type: 'pricing',
        title: 'Coaching Packages',
        order: 4,
        x: 1200,
        y: 150,
        config: {
          plans: [
            { name: '1-on-1 Session', price: '$150', features: ['60 min session', 'Personalized plan'] },
            { name: 'Monthly Package', price: '$500', features: ['4 sessions', 'Email support', 'Resources'] },
            { name: '3-Month Program', price: '$1200', features: ['12 sessions', 'Unlimited support', 'Group access'] }
          ]
        }
      },
      {
        id: 'step-5',
        type: 'calendar',
        title: 'Book Session',
        order: 5,
        x: 150,
        y: 500,
        config: {
          title: 'Schedule Your Coaching Session',
          duration: 60
        }
      },
      {
        id: 'step-6',
        type: 'redirect',
        title: 'Session Booked',
        order: 6,
        x: 500,
        y: 500,
        config: {
          redirectUrl: 'https://coaching.com/session-booked',
          message: 'Your coaching session has been booked! Check your email for details.'
        }
      }
    ];

    const templateConnections = [
      { from: 'step-1', to: 'step-2', condition: 'default' },
      { from: 'step-2', to: 'step-3', condition: 'default' },
      { from: 'step-3', to: 'step-4', condition: 'default' },
      { from: 'step-4', to: 'step-5', condition: 'default' },
      { from: 'step-5', to: 'step-6', condition: 'default' }
    ];

    setSteps(templateSteps);
    setConnections(templateConnections);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const loadRealEstateTemplate = () => {
    const templateSteps = [
      {
        id: 'step-1',
        type: 'video',
        title: 'Property Tour',
        order: 1,
        x: 150,
        y: 150,
        config: {
          videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
          question: 'Take a virtual tour of this stunning property! See what makes it special.'
        }
      },
      {
        id: 'step-2',
        type: 'question',
        title: 'Property Interest',
        order: 2,
        x: 500,
        y: 150,
        config: {
          question: 'Are you interested in this property?',
          options: [
            { label: 'Yes, I want to see it', next: 'step-3' },
            { label: 'Maybe, need more info', next: 'step-3' },
            { label: 'Not interested', next: 'end' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'form',
        title: 'Contact Info',
        order: 3,
        x: 850,
        y: 150,
        config: {
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
            { name: 'budget', type: 'text', label: 'Budget Range', required: true }
          ]
        }
      },
      {
        id: 'step-4',
        type: 'calendar',
        title: 'Schedule Viewing',
        order: 4,
        x: 1200,
        y: 150,
        config: {
          title: 'Schedule Property Viewing',
          duration: 60
        }
      },
      {
        id: 'step-5',
        type: 'location',
        title: 'Property Location',
        order: 5,
        x: 150,
        y: 500,
        config: {
          prompt: 'Allow location access to show nearby amenities and services'
        }
      },
      {
        id: 'step-6',
        type: 'redirect',
        title: 'Viewing Scheduled',
        order: 6,
        x: 500,
        y: 500,
        config: {
          redirectUrl: 'https://realestate.com/viewing-scheduled',
          message: 'Your property viewing has been scheduled! We will contact you to confirm.'
        }
      }
    ];

    const templateConnections = [
      { from: 'step-1', to: 'step-2', condition: 'default' },
      { from: 'step-2', to: 'step-3', condition: 'yes' },
      { from: 'step-2', to: 'end', condition: 'no' },
      { from: 'step-3', to: 'step-4', condition: 'default' },
      { from: 'step-4', to: 'step-5', condition: 'default' },
      { from: 'step-5', to: 'step-6', condition: 'default' }
    ];

    setSteps(templateSteps);
    setConnections(templateConnections);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const loadFitnessTemplate = () => {
    const templateSteps = [
      {
        id: 'step-1',
        type: 'video',
        title: 'Workout Preview',
        order: 1,
        x: 150,
        y: 150,
        config: {
          videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
          question: 'See how our fitness program can transform your body in just 30 days!'
        }
      },
      {
        id: 'step-2',
        type: 'quiz',
        title: 'Fitness Assessment',
        order: 2,
        x: 500,
        y: 150,
        config: {
          questions: [
            {
              question: 'What is your fitness level?',
              options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            },
            {
              question: 'What are your main goals?',
              options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness']
            }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'form',
        title: 'Health Info',
        order: 3,
        x: 850,
        y: 150,
        config: {
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'age', type: 'number', label: 'Age', required: true },
            { name: 'weight', type: 'number', label: 'Current Weight', required: true },
            { name: 'goals', type: 'text', label: 'Fitness Goals', required: true }
          ]
        }
      },
      {
        id: 'step-4',
        type: 'pricing',
        title: 'Membership Plans',
        order: 4,
        x: 1200,
        y: 150,
        config: {
          plans: [
            { name: 'Basic', price: '$29/month', features: ['Workout Videos', 'Basic Nutrition'] },
            { name: 'Premium', price: '$49/month', features: ['Personal Trainer', 'Meal Plans', 'Progress Tracking'] },
            { name: 'Elite', price: '$99/month', features: ['1-on-1 Coaching', 'Custom Plans', '24/7 Support'] }
          ]
        }
      },
      {
        id: 'step-5',
        type: 'calendar',
        title: 'Free Consultation',
        order: 5,
        x: 150,
        y: 500,
        config: {
          title: 'Book Free Fitness Consultation',
          duration: 30
        }
      },
      {
        id: 'step-6',
        type: 'redirect',
        title: 'Consultation Booked',
        order: 6,
        x: 500,
        y: 500,
        config: {
          redirectUrl: 'https://fitness.com/consultation-booked',
          message: 'Your free consultation has been booked! Get ready to start your fitness journey.'
        }
      }
    ];

    const templateConnections = [
      { from: 'step-1', to: 'step-2', condition: 'default' },
      { from: 'step-2', to: 'step-3', condition: 'default' },
      { from: 'step-3', to: 'step-4', condition: 'default' },
      { from: 'step-4', to: 'step-5', condition: 'default' },
      { from: 'step-5', to: 'step-6', condition: 'default' }
    ];

    setSteps(templateSteps);
    setConnections(templateConnections);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const loadEducationTemplate = () => {
    const templateSteps = [
      {
        id: 'step-1',
        type: 'video',
        title: 'Course Preview',
        order: 1,
        x: 150,
        y: 150,
        config: {
          videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1752741407/intro.mp4',
          question: 'Watch this preview to see what you\'ll learn in our comprehensive course!'
        }
      },
      {
        id: 'step-2',
        type: 'question',
        title: 'Learning Goals',
        order: 2,
        x: 500,
        y: 150,
        config: {
          question: 'What do you want to achieve with this course?',
          options: [
            { label: 'Career Advancement', next: 'step-3' },
            { label: 'Personal Development', next: 'step-3' },
            { label: 'Skill Building', next: 'step-3' }
          ]
        }
      },
      {
        id: 'step-3',
        type: 'form',
        title: 'Student Info',
        order: 3,
        x: 850,
        y: 150,
        config: {
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'education', type: 'text', label: 'Education Level', required: true },
            { name: 'experience', type: 'text', label: 'Relevant Experience', required: true }
          ]
        }
      },
      {
        id: 'step-4',
        type: 'pricing',
        title: 'Course Pricing',
        order: 4,
        x: 1200,
        y: 150,
        config: {
          plans: [
            { name: 'Basic', price: '$99', features: ['Course Access', 'Certificate'] },
            { name: 'Premium', price: '$199', features: ['Course Access', 'Live Sessions', 'Mentorship'] },
            { name: 'Master', price: '$399', features: ['Everything', '1-on-1 Coaching', 'Job Placement'] }
          ]
        }
      },
      {
        id: 'step-5',
        type: 'calendar',
        title: 'Free Trial Class',
        order: 5,
        x: 150,
        y: 500,
        config: {
          title: 'Book Free Trial Class',
          duration: 60
        }
      },
      {
        id: 'step-6',
        type: 'redirect',
        title: 'Trial Booked',
        order: 6,
        x: 500,
        y: 500,
        config: {
          redirectUrl: 'https://education.com/trial-booked',
          message: 'Your free trial class has been booked! Welcome to your learning journey.'
        }
      }
    ];

    const templateConnections = [
      { from: 'step-1', to: 'step-2', condition: 'default' },
      { from: 'step-2', to: 'step-3', condition: 'default' },
      { from: 'step-3', to: 'step-4', condition: 'default' },
      { from: 'step-4', to: 'step-5', condition: 'default' },
      { from: 'step-5', to: 'step-6', condition: 'default' }
    ];

    setSteps(templateSteps);
    setConnections(templateConnections);
    setSelectedStep(null);
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const handleStepDrop = (stepId, targetStepId) => {
    if (stepId !== targetStepId) {
      addConnection(stepId, targetStepId);
    }
  };

  const startConnection = (stepId) => {
    setConnectionMode(true);
    setConnectingFrom(stepId);
  };

  const completeConnection = (targetStepId) => {
    if (connectingFrom && connectingFrom !== targetStepId) {
      addConnection(connectingFrom, targetStepId);
    }
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  const cancelConnection = () => {
    setConnectionMode(false);
    setConnectingFrom(null);
  };

  // Zoom and Pan Functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e) => {
    // Only start panning if clicking on empty canvas area, not on step cards
    if (e.target === canvasRef.current || 
        (e.target.closest('.canvas-container') && !e.target.closest('.step-card'))) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
    
    // Update mouse position for connection line
    if (connectionMode && connectingFrom) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / zoom - pan.x / zoom,
          y: (e.clientY - rect.top) / zoom - pan.y / zoom
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      canvas.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, panStart]);

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomReset();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="funnel-builder-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading funnel builder...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="funnel-builder-page">
        <div className="builder-header">
          <div className="builder-title">
            <h1>{funnel?.name || 'New Funnel'}</h1>
            <p>Build your conversion funnel step by step</p>
          </div>
          <div className="builder-actions">
            <button 
              className="btn btn-secondary"
              onClick={handlePreview}
            >
              {isPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
            <button 
              className={`btn btn-primary ${isSaving ? 'loading' : ''}`}
              onClick={handleSaveFunnel}
              disabled={isSaving}
            >
              {isSaving ? '💾 Saving...' : '💾 Save Funnel'}
            </button>
            <button 
              className={`btn btn-success ${isPublishing ? 'loading' : ''}`}
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? '🚀 Publishing...' : '🚀 Publish'}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {(saveStatus || publishStatus) && (
          <div className="status-messages">
            {saveStatus && (
              <motion.div 
                className={`status-message ${saveStatus.includes('successfully') ? 'success' : 'info'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {saveStatus}
              </motion.div>
            )}
            {publishStatus && (
              <motion.div 
                className={`status-message ${publishStatus.includes('successfully') ? 'success' : publishStatus.includes('Please add') ? 'warning' : 'info'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {publishStatus}
              </motion.div>
            )}
          </div>
        )}

        <div className="builder-content">
          {/* Sidebar - Step Types */}
          <div className="builder-sidebar">
            <h3>Add Steps</h3>
            <div className="step-types">
              {stepTypes.map((stepType) => (
                <motion.div
                  key={stepType.type}
                  className="step-type-card"
                  onClick={() => addStep(stepType.type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="step-type-icon">{stepType.icon}</div>
                  <div className="step-type-info">
                    <h4>{stepType.name}</h4>
                    <p>{stepType.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Canvas */}
          <div className="builder-canvas">
            <div className="canvas-header">
              <h3>Funnel Flow</h3>
              <div className="canvas-controls">
                <span className="step-count">{steps.length} steps</span>
                
                {/* Zoom Controls */}
                <div className="zoom-controls">
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                  >
                    🔍-
                  </button>
                  <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={handleZoomIn}
                    title="Zoom In"
                  >
                    🔍+
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={handleZoomReset}
                    title="Reset Zoom"
                  >
                    🎯
                  </button>
                </div>

                <button 
                  className={`btn btn-sm ${connectionMode ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setConnectionMode(!connectionMode)}
                >
                  {connectionMode ? '🔗 Connection Mode ON' : '🔗 Connect Steps'}
                </button>
                <div className="template-selector">
                  <select 
                    className="form-select"
                    onChange={(e) => loadTemplate(e.target.value)}
                    defaultValue=""
                  >
                    <option value="">Choose Template...</option>
                    <option value="matchify">💕 Dating (Matchify)</option>
                    <option value="ecommerce">🛒 E-commerce</option>
                    <option value="saas">💻 SaaS</option>
                    <option value="coaching">🎯 Coaching</option>
                    <option value="realestate">🏠 Real Estate</option>
                    <option value="fitness">💪 Fitness</option>
                    <option value="education">🎓 Education</option>
                  </select>
                </div>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={clearAll}
                  title="Clear all steps and connections"
                >
                  🗑️ Clear All
                </button>
                {connectionMode && (
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={cancelConnection}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            <div 
              className={`canvas-container ${isPanning ? 'panning' : ''} ${connectionMode ? 'connection-mode' : ''}`}
              ref={canvasRef}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                cursor: isPanning ? 'grabbing' : connectionMode ? 'crosshair' : 'grab'
              }}
            >
              {/* Connection Lines */}
              <svg className="connections-layer">
                {connections.map((connection, index) => {
                  const fromStep = steps.find(s => s.id === connection.from);
                  const toStep = steps.find(s => s.id === connection.to);
                  
                  if (!fromStep || !toStep) return null;
                  
                  const fromX = fromStep.x + 150; // Center of step
                  const fromY = fromStep.y + 50;
                  const toX = toStep.x + 150;
                  const toY = toStep.y + 50;
                  
                  return (
                    <motion.path
                      key={index}
                      d={`M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${fromY - 50} ${toX} ${toY}`}
                      stroke="#2E2A76"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6,3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ 
                        duration: 1.2, 
                        delay: index * 0.15,
                        ease: "easeOut"
                      }}
                      whileHover={{
                        strokeWidth: 3,
                        stroke: "#FF6B6B",
                        opacity: 1,
                        transition: { duration: 0.3 }
                      }}
                      className="connection-line"
                    />
                  );
                })}
              </svg>
              
              {/* Steps */}
              <div className="steps-container">
                <AnimatePresence>
                  {steps.map((step, index) => (
                    <StepCard
                      key={step.id}
                      step={step}
                      index={index}
                      isSelected={selectedStep?.id === step.id}
                      isDragging={draggedStep === step.id}
                      isHovered={hoveredStep === step.id}
                      onSelect={() => setSelectedStep(step)}
                      onUpdate={(updates) => updateStep(step.id, updates)}
                      onDelete={() => deleteStep(step.id)}
                      onMove={moveStep}
                      onPositionChange={(x, y) => updateStepPosition(step.id, x, y)}
                      onConnect={(targetId) => handleStepDrop(step.id, targetId)}
                      onDragStart={() => setDraggedStep(step.id)}
                      onDragEnd={() => setDraggedStep(null)}
                      onHover={() => setHoveredStep(step.id)}
                      onHoverEnd={() => setHoveredStep(null)}
                      connectionMode={connectionMode}
                      connectingFrom={connectingFrom}
                      onStartConnection={startConnection}
                      onCompleteConnection={completeConnection}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="builder-properties">
            <h3>Step Properties</h3>
            {selectedStep ? (
              <StepProperties
                step={selectedStep}
                onUpdate={(updates) => updateStep(selectedStep.id, updates)}
              />
            ) : (
              <div className="no-selection">
                <p>Select a step to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Funnel Preview */}
      {isPreview && (
        <FunnelPreview
          steps={steps}
          connections={connections}
          onClose={() => setIsPreview(false)}
        />
      )}
    </DndProvider>
  );
};

// Step Card Component
const StepCard = ({ 
  step, 
  index, 
  isSelected, 
  isDragging, 
  isHovered,
  onSelect, 
  onUpdate, 
  onDelete, 
  onMove,
  onPositionChange,
  onConnect,
  onDragStart,
  onDragEnd,
  onHover,
  onHoverEnd,
  connectionMode,
  connectingFrom,
  onStartConnection,
  onCompleteConnection
}) => {
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const [{ isDragging: isDraggingDnd }, drag] = useDrag({
    type: 'step',
    item: { id: step.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'step',
    hover: (item) => {
      if (item.id !== step.id) {
        onConnect(item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const stepIcons = {
    video: '🎬',
    question: '❓',
    form: '📝',
    pricing: '💰',
    redirect: '🔗',
    timer: '⏰',
    social: '👥',
    quiz: '🧠',
    calendar: '📅',
    upload: '📤',
    survey: '📊',
    chat: '💬',
    email: '📧',
    phone: '📞',
    location: '📍',
    payment: '💳',
    waitlist: '⏳',
    download: '⬇️',
    gallery: '🖼️',
    map: '🗺️'
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.step-actions')) return;
    
    setIsDraggingLocal(true);
    onDragStart();
    
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDraggingLocal) return;
    
    const canvas = cardRef.current.closest('.canvas-container');
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - canvasRect.left - dragOffset.x, canvasRect.width - 300));
    const newY = Math.max(0, Math.min(e.clientY - canvasRect.top - dragOffset.y, canvasRect.height - 120));
    
    onPositionChange(newX, newY);
  };

  const handleMouseUp = () => {
    setIsDraggingLocal(false);
    onDragEnd();
  };

  useEffect(() => {
    if (isDraggingLocal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingLocal, dragOffset]);

  return (
    <motion.div
      ref={(node) => {
        drag(drop(node));
        cardRef.current = node;
      }}
      className={`step-card ${isSelected ? 'selected' : ''} ${isDraggingLocal ? 'dragging' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        position: 'absolute',
        left: step.x,
        top: step.y,
        zIndex: isDraggingLocal ? 1000 : 1
      }}
      onClick={onSelect}
      onMouseDown={handleMouseDown}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: isDraggingLocal ? 1.05 : 1,
        rotate: isDraggingLocal ? 2 : 0
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 0.8
      }}
    >
      {/* Connection Points */}
      <div className="connection-points">
        <div 
          className={`connection-point input ${connectionMode && connectingFrom === step.id ? 'connecting' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (connectionMode && connectingFrom && connectingFrom !== step.id) {
              onCompleteConnection(step.id);
            }
          }}
          title="Input connection point"
        />
        <div 
          className={`connection-point output ${connectionMode && !connectingFrom ? 'ready' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (connectionMode && !connectingFrom) {
              onStartConnection(step.id);
            }
          }}
          title="Output connection point - Click to start connection"
        />
      </div>
      
      <div className="step-header">
        <div className="step-icon">{stepIcons[step.type]}</div>
        <div className="step-info">
          <h4>{step.title}</h4>
          <p>{step.type.charAt(0).toUpperCase() + step.type.slice(1)} Step</p>
        </div>
        <div className="step-actions">
          <button 
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="step-preview">
        <p>Step {step.order}</p>
        
        {/* Show video for all step types if videoUrl exists */}
        {step.config?.videoUrl && (
          <div className="step-content-preview">
            <div className="video-thumbnail">
              <video 
                src={step.config?.videoUrl} 
                className="preview-thumbnail"
                muted
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="video-placeholder" style={{display: 'none'}}>
                🎬 Video
              </div>
            </div>
          </div>
        )}
        
        {/* Show actual step content based on type */}
        {step.type === 'video' && step.config?.question && (
          <div className="step-content-preview">
            <p className="step-question">{step.config.question}</p>
          </div>
        )}
        
        {step.type === 'question' && step.config?.question && (
          <div className="step-content-preview">
            <p className="step-question">{step.config.question}</p>
            <div className="step-options">
              <span className="option-btn">Yes</span>
              <span className="option-btn">No</span>
            </div>
          </div>
        )}
        
        {step.type === 'form' && step.config?.fields && step.config.fields.length > 0 && (
          <div className="step-content-preview">
            <div className="form-preview-mini">
              {step.config.fields.slice(0, 2).map((field, index) => (
                <div key={index} className="form-field-mini">
                  <span className="field-label">{field.label || `Field ${index + 1}`}</span>
                  <span className="field-type">{field.type}</span>
                </div>
              ))}
              {step.config.fields.length > 2 && (
                <div className="more-fields">+{step.config.fields.length - 2} more</div>
              )}
            </div>
          </div>
        )}
        
        {step.type === 'pricing' && (
          <div className="step-content-preview">
            <div className="pricing-preview">
              <span className="price-symbol">💰</span>
              <span className="price-text">Pricing Plans</span>
            </div>
          </div>
        )}
        
        {step.type === 'redirect' && (
          <div className="step-content-preview">
            <div className="redirect-preview">
              <span className="redirect-symbol">🔗</span>
              <span className="redirect-text">Success Page</span>
            </div>
            {step.config?.message && (
              <p className="redirect-message">{step.config.message}</p>
            )}
          </div>
        )}
        
        {step.type === 'timer' && (
          <div className="step-content-preview">
            <div className="timer-preview">
              <span className="timer-symbol">⏰</span>
              <span className="timer-text">Countdown Timer</span>
            </div>
            <div className="timer-display">00:05:00</div>
          </div>
        )}
        
        {step.type === 'social' && (
          <div className="step-content-preview">
            <div className="social-preview">
              <span className="social-symbol">👥</span>
              <span className="social-text">Social Proof</span>
            </div>
            <div className="social-stats">⭐ 4.9/5 (1,234 reviews)</div>
          </div>
        )}
        
        {step.type === 'quiz' && (
          <div className="step-content-preview">
            <div className="quiz-preview">
              <span className="quiz-symbol">🧠</span>
              <span className="quiz-text">Interactive Quiz</span>
            </div>
            <div className="quiz-progress">Question 1 of 5</div>
          </div>
        )}
        
        {step.type === 'calendar' && (
          <div className="step-content-preview">
            <div className="calendar-preview">
              <span className="calendar-symbol">📅</span>
              <span className="calendar-text">Schedule Meeting</span>
            </div>
            <div className="calendar-date">Select Date & Time</div>
          </div>
        )}
        
        {step.type === 'upload' && (
          <div className="step-content-preview">
            <div className="upload-preview">
              <span className="upload-symbol">📤</span>
              <span className="upload-text">File Upload</span>
            </div>
            <div className="upload-hint">Drag & drop files here</div>
          </div>
        )}
        
        {step.type === 'survey' && (
          <div className="step-content-preview">
            <div className="survey-preview">
              <span className="survey-symbol">📊</span>
              <span className="survey-text">Multi-Question Survey</span>
            </div>
            <div className="survey-progress">3 questions remaining</div>
          </div>
        )}
        
        {step.type === 'chat' && (
          <div className="step-content-preview">
            <div className="chat-preview">
              <span className="chat-symbol">💬</span>
              <span className="chat-text">Live Chat</span>
            </div>
            <div className="chat-status">Online - Ready to help</div>
          </div>
        )}
        
        {step.type === 'email' && (
          <div className="step-content-preview">
            <div className="email-preview">
              <span className="email-symbol">📧</span>
              <span className="email-text">Email Capture</span>
            </div>
            <div className="email-field">Enter your email address</div>
          </div>
        )}
        
        {step.type === 'phone' && (
          <div className="step-content-preview">
            <div className="phone-preview">
              <span className="phone-symbol">📞</span>
              <span className="phone-text">Phone Capture</span>
            </div>
            <div className="phone-field">Enter your phone number</div>
          </div>
        )}
        
        {step.type === 'location' && (
          <div className="step-content-preview">
            <div className="location-preview">
              <span className="location-symbol">📍</span>
              <span className="location-text">Get Location</span>
            </div>
            <div className="location-hint">Allow location access</div>
          </div>
        )}
        
        {step.type === 'payment' && (
          <div className="step-content-preview">
            <div className="payment-preview">
              <span className="payment-symbol">💳</span>
              <span className="payment-text">Payment Processing</span>
            </div>
            <div className="payment-amount">$29.99</div>
          </div>
        )}
        
        {step.type === 'waitlist' && (
          <div className="step-content-preview">
            <div className="waitlist-preview">
              <span className="waitlist-symbol">⏳</span>
              <span className="waitlist-text">Join Waitlist</span>
            </div>
            <div className="waitlist-position">Position #1,234</div>
          </div>
        )}
        
        {step.type === 'download' && (
          <div className="step-content-preview">
            <div className="download-preview">
              <span className="download-symbol">⬇️</span>
              <span className="download-text">File Download</span>
            </div>
            <div className="download-file">Free Guide.pdf</div>
          </div>
        )}
        
        {step.type === 'gallery' && (
          <div className="step-content-preview">
            <div className="gallery-preview">
              <span className="gallery-symbol">🖼️</span>
              <span className="gallery-text">Image Gallery</span>
            </div>
            <div className="gallery-count">12 photos</div>
          </div>
        )}
        
        {step.type === 'map' && (
          <div className="step-content-preview">
            <div className="map-preview">
              <span className="map-symbol">🗺️</span>
              <span className="map-text">Interactive Map</span>
            </div>
            <div className="map-location">Find nearby locations</div>
          </div>
        )}
        
        {connectionMode && (
          <div className="connection-status">
            {connectingFrom === step.id ? (
              <span className="connecting-status">Connecting...</span>
            ) : connectingFrom ? (
              <span className="waiting-status">Click to connect</span>
            ) : (
              <span className="ready-status">Ready to connect</span>
            )}
          </div>
        )}
        {isOver && (
          <div className="connection-hint">
            Drop to connect
          </div>
        )}
      </div>
      
      {/* Drag Handle */}
      <div className="drag-handle">
        <div className="drag-dots">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.div>
  );
};

// Step Properties Component
const StepProperties = ({ step, onUpdate }) => {
  const [config, setConfig] = useState(step.config || {});
  const [title, setTitle] = useState(step.title || '');

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate({ config: newConfig });
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    onUpdate({ title: newTitle });
  };

  return (
    <div className="step-properties">
      <div className="property-group">
        <label>Step Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="form-input"
          placeholder="Enter step title..."
        />
      </div>

      {/* Video URL field for all step types */}
      <div className="property-group">
        <label>Video URL (Optional)</label>
        <input
          type="url"
          value={config.videoUrl || ''}
          onChange={(e) => handleConfigChange('videoUrl', e.target.value)}
          className="form-input"
          placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
        />
        {config.videoUrl && (
          <div className="video-preview">
            <video 
              src={config.videoUrl} 
              controls 
              className="preview-video"
              onError={() => console.log('Video failed to load')}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      {step.type === 'video' && (
        <>
          <div className="property-group">
            <label>Question</label>
            <textarea
              value={config.question || ''}
              onChange={(e) => handleConfigChange('question', e.target.value)}
              className="form-textarea"
              placeholder="What question do you want to ask?"
            />
          </div>
        </>
      )}

      {step.type === 'question' && (
        <>
          <div className="property-group">
            <label>Question</label>
            <textarea
              value={config.question || ''}
              onChange={(e) => handleConfigChange('question', e.target.value)}
              className="form-textarea"
              placeholder="What question do you want to ask?"
            />
          </div>
          {config.question && (
            <div className="question-preview">
              <h4>Preview:</h4>
              <div className="preview-question">
                <p>{config.question}</p>
                <div className="preview-options">
                  <button className="preview-option">Yes</button>
                  <button className="preview-option">No</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {step.type === 'form' && (
        <>
          <div className="property-group">
            <label>Form Fields</label>
            <div className="form-fields">
              {config.fields?.map((field, index) => (
                <div key={index} className="field-item">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => {
                      const newFields = [...config.fields];
                      newFields[index].label = e.target.value;
                      handleConfigChange('fields', newFields);
                    }}
                    className="form-input"
                    placeholder="Field label"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => {
                      const newFields = [...config.fields];
                      newFields[index].type = e.target.value;
                      handleConfigChange('fields', newFields);
                    }}
                    className="form-select"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  const newFields = [...(config.fields || []), { name: '', type: 'text', label: '', required: false }];
                  handleConfigChange('fields', newFields);
                }}
              >
                + Add Field
              </button>
            </div>
          </div>
          {config.fields && config.fields.length > 0 && (
            <div className="form-preview">
              <h4>Preview:</h4>
              <div className="preview-form">
                {config.fields.map((field, index) => (
                  <div key={index} className="preview-field">
                    <label>{field.label || `Field ${index + 1}`}</label>
                    <input 
                      type={field.type} 
                      placeholder={`Enter ${field.label.toLowerCase() || 'value'}...`}
                      disabled
                    />
                  </div>
                ))}
                <button className="preview-submit">Submit</button>
              </div>
            </div>
          )}
        </>
      )}

      {step.type === 'pricing' && (
        <>
          <div className="property-group">
            <label>Pricing Plans</label>
            <div className="pricing-plans">
              {config.plans?.map((plan, index) => (
                <div key={index} className="plan-item">
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => {
                      const newPlans = [...config.plans];
                      newPlans[index].name = e.target.value;
                      handleConfigChange('plans', newPlans);
                    }}
                    className="form-input"
                    placeholder="Plan name"
                  />
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => {
                      const newPlans = [...config.plans];
                      newPlans[index].price = e.target.value;
                      handleConfigChange('plans', newPlans);
                    }}
                    className="form-input"
                    placeholder="Price"
                  />
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  const newPlans = [...(config.plans || []), { name: '', price: '', features: [] }];
                  handleConfigChange('plans', newPlans);
                }}
              >
                + Add Plan
              </button>
            </div>
          </div>
        </>
      )}

      {step.type === 'redirect' && (
        <>
          <div className="property-group">
            <label>Redirect URL</label>
            <input
              type="url"
              value={config.redirectUrl || ''}
              onChange={(e) => handleConfigChange('redirectUrl', e.target.value)}
              className="form-input"
              placeholder="https://example.com/success"
            />
          </div>
          <div className="property-group">
            <label>Success Message</label>
            <textarea
              value={config.message || ''}
              onChange={(e) => handleConfigChange('message', e.target.value)}
              className="form-textarea"
              placeholder="Thank you for your submission!"
            />
          </div>
        </>
      )}

      {step.type === 'timer' && (
        <>
          <div className="property-group">
            <label>Duration (seconds)</label>
            <input
              type="number"
              value={config.duration || 300}
              onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
              className="form-input"
              placeholder="300"
            />
          </div>
          <div className="property-group">
            <label>Message</label>
            <textarea
              value={config.message || ''}
              onChange={(e) => handleConfigChange('message', e.target.value)}
              className="form-textarea"
              placeholder="Limited time offer expires in:"
            />
          </div>
          <div className="property-group">
            <label>Discount</label>
            <input
              type="text"
              value={config.discount || ''}
              onChange={(e) => handleConfigChange('discount', e.target.value)}
              className="form-input"
              placeholder="50% OFF"
            />
          </div>
        </>
      )}

      {step.type === 'social' && (
        <>
          <div className="property-group">
            <label>Testimonials</label>
            <div className="testimonials-list">
              {config.testimonials?.map((testimonial, index) => (
                <div key={index} className="testimonial-item">
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => {
                      const newTestimonials = [...config.testimonials];
                      newTestimonials[index].name = e.target.value;
                      handleConfigChange('testimonials', newTestimonials);
                    }}
                    className="form-input"
                    placeholder="Customer name"
                  />
                  <textarea
                    value={testimonial.text}
                    onChange={(e) => {
                      const newTestimonials = [...config.testimonials];
                      newTestimonials[index].text = e.target.value;
                      handleConfigChange('testimonials', newTestimonials);
                    }}
                    className="form-textarea"
                    placeholder="Testimonial text"
                  />
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  const newTestimonials = [...(config.testimonials || []), { name: '', text: '', rating: 5 }];
                  handleConfigChange('testimonials', newTestimonials);
                }}
              >
                + Add Testimonial
              </button>
            </div>
          </div>
        </>
      )}

      {step.type === 'quiz' && (
        <>
          <div className="property-group">
            <label>Quiz Questions</label>
            <div className="quiz-questions">
              {config.questions?.map((question, index) => (
                <div key={index} className="question-item">
                  <textarea
                    value={question.question}
                    onChange={(e) => {
                      const newQuestions = [...config.questions];
                      newQuestions[index].question = e.target.value;
                      handleConfigChange('questions', newQuestions);
                    }}
                    className="form-textarea"
                    placeholder="Question text"
                  />
                  <div className="question-options">
                    {question.options?.map((option, optIndex) => (
                      <input
                        key={optIndex}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newQuestions = [...config.questions];
                          newQuestions[index].options[optIndex] = e.target.value;
                          handleConfigChange('questions', newQuestions);
                        }}
                        className="form-input"
                        placeholder="Option text"
                      />
                    ))}
                  </div>
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  const newQuestions = [...(config.questions || []), { question: '', options: ['', '', '', ''] }];
                  handleConfigChange('questions', newQuestions);
                }}
              >
                + Add Question
              </button>
            </div>
          </div>
        </>
      )}

      {step.type === 'upload' && (
        <>
          <div className="property-group">
            <label>Accept File Types</label>
            <input
              type="text"
              value={config.accept || 'image/*'}
              onChange={(e) => handleConfigChange('accept', e.target.value)}
              className="form-input"
              placeholder="image/*, .pdf, .doc"
            />
          </div>
          <div className="property-group">
            <label>Max File Size</label>
            <input
              type="text"
              value={config.maxSize || '5MB'}
              onChange={(e) => handleConfigChange('maxSize', e.target.value)}
              className="form-input"
              placeholder="5MB"
            />
          </div>
          <div className="property-group">
            <label>Multiple Files</label>
            <input
              type="checkbox"
              checked={config.multiple || false}
              onChange={(e) => handleConfigChange('multiple', e.target.checked)}
              className="form-checkbox"
            />
          </div>
        </>
      )}

      {step.type === 'calendar' && (
        <>
          <div className="property-group">
            <label>Calendar Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              className="form-input"
              placeholder="Schedule a meeting"
            />
          </div>
          <div className="property-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={config.duration || 30}
              onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
              className="form-input"
              placeholder="30"
            />
          </div>
        </>
      )}

      {step.type === 'chat' && (
        <>
          <div className="property-group">
            <label>Chat Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              className="form-input"
              placeholder="Live Chat Support"
            />
          </div>
          <div className="property-group">
            <label>Welcome Message</label>
            <textarea
              value={config.welcomeMessage || ''}
              onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
              className="form-textarea"
              placeholder="Hi! How can I help you today?"
            />
          </div>
        </>
      )}

      {step.type === 'email' && (
        <>
          <div className="property-group">
            <label>Email Subject</label>
            <input
              type="text"
              value={config.subject || ''}
              onChange={(e) => handleConfigChange('subject', e.target.value)}
              className="form-input"
              placeholder="Enter your email address"
            />
          </div>
          <div className="property-group">
            <label>Placeholder Text</label>
            <input
              type="text"
              value={config.placeholder || ''}
              onChange={(e) => handleConfigChange('placeholder', e.target.value)}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>
        </>
      )}

      {step.type === 'phone' && (
        <>
          <div className="property-group">
            <label>Phone Label</label>
            <input
              type="text"
              value={config.label || ''}
              onChange={(e) => handleConfigChange('label', e.target.value)}
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="property-group">
            <label>Country Code</label>
            <input
              type="text"
              value={config.countryCode || '+1'}
              onChange={(e) => handleConfigChange('countryCode', e.target.value)}
              className="form-input"
              placeholder="+1"
            />
          </div>
        </>
      )}

      {step.type === 'location' && (
        <>
          <div className="property-group">
            <label>Location Prompt</label>
            <textarea
              value={config.prompt || ''}
              onChange={(e) => handleConfigChange('prompt', e.target.value)}
              className="form-textarea"
              placeholder="Please allow location access to find nearby services"
            />
          </div>
        </>
      )}

      {step.type === 'payment' && (
        <>
          <div className="property-group">
            <label>Amount</label>
            <input
              type="text"
              value={config.amount || ''}
              onChange={(e) => handleConfigChange('amount', e.target.value)}
              className="form-input"
              placeholder="$29.99"
            />
          </div>
          <div className="property-group">
            <label>Currency</label>
            <select
              value={config.currency || 'USD'}
              onChange={(e) => handleConfigChange('currency', e.target.value)}
              className="form-select"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </>
      )}

      {step.type === 'waitlist' && (
        <>
          <div className="property-group">
            <label>Waitlist Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              className="form-input"
              placeholder="Join the waitlist"
            />
          </div>
          <div className="property-group">
            <label>Description</label>
            <textarea
              value={config.description || ''}
              onChange={(e) => handleConfigChange('description', e.target.value)}
              className="form-textarea"
              placeholder="Be the first to know when we launch!"
            />
          </div>
        </>
      )}

      {step.type === 'download' && (
        <>
          <div className="property-group">
            <label>File URL</label>
            <input
              type="url"
              value={config.fileUrl || ''}
              onChange={(e) => handleConfigChange('fileUrl', e.target.value)}
              className="form-input"
              placeholder="https://example.com/file.pdf"
            />
          </div>
          <div className="property-group">
            <label>File Name</label>
            <input
              type="text"
              value={config.fileName || ''}
              onChange={(e) => handleConfigChange('fileName', e.target.value)}
              className="form-input"
              placeholder="Free Guide.pdf"
            />
          </div>
        </>
      )}

      {step.type === 'gallery' && (
        <>
          <div className="property-group">
            <label>Gallery Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              className="form-input"
              placeholder="Photo Gallery"
            />
          </div>
          <div className="property-group">
            <label>Image URLs (one per line)</label>
            <textarea
              value={config.images?.join('\n') || ''}
              onChange={(e) => handleConfigChange('images', e.target.value.split('\n').filter(url => url.trim()))}
              className="form-textarea"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>
        </>
      )}

      {step.type === 'map' && (
        <>
          <div className="property-group">
            <label>Map Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              className="form-input"
              placeholder="Find Us"
            />
          </div>
          <div className="property-group">
            <label>Address</label>
            <input
              type="text"
              value={config.address || ''}
              onChange={(e) => handleConfigChange('address', e.target.value)}
              className="form-input"
              placeholder="123 Main St, City, State"
            />
          </div>
        </>
      )}

      <div className="property-actions">
        <button className="btn btn-sm btn-primary">Save Changes</button>
      </div>
    </div>
  );
};

export default FunnelBuilderPage;