import React from 'react';
import AnimatedFunnelFlow from '../components/AnimatedFunnelFlow';

const AnimatedFunnelDemo = () => {
  const funnelSteps = [
    {
      id: 1,
      title: "What's your main goal?",
      description: "Help us understand what you're looking to achieve",
      video: "https://res.cloudinary.com/domnocrwi/video/upload/v1759220570/Joneast_exbb7f.mp4",
      options: [
        {
          id: "goal-1",
          title: "Book a Call",
          description: "Schedule a personalized consultation with our experts",
          icon: "📞"
        },
        {
          id: "goal-2", 
          title: "Take our Quiz",
          description: "Discover your perfect solution through our assessment",
          icon: "📋"
        },
        {
          id: "goal-3",
          title: "Explore",
          description: "Browse our services and learn more about what we offer",
          icon: "🔍"
        }
      ]
    },
    {
      id: 2,
      title: "What's your business size?",
      description: "This helps us tailor our recommendations to your needs",
      options: [
        {
          id: "size-1",
          title: "Startup (1-10 employees)",
          description: "Just getting started and need foundational support",
          icon: "🚀"
        },
        {
          id: "size-2",
          title: "Small Business (11-50 employees)",
          description: "Growing business looking to scale efficiently",
          icon: "🏢"
        },
        {
          id: "size-3",
          title: "Medium Business (51-200 employees)",
          description: "Established business seeking optimization",
          icon: "🏭"
        },
        {
          id: "size-4",
          title: "Enterprise (200+ employees)",
          description: "Large organization with complex needs",
          icon: "🏛️"
        }
      ]
    },
    {
      id: 3,
      title: "What's your biggest challenge?",
      description: "Understanding your pain points helps us provide better solutions",
      options: [
        {
          id: "challenge-1",
          title: "Lead Generation",
          description: "Struggling to attract and convert new customers",
          icon: "🎯"
        },
        {
          id: "challenge-2",
          title: "Customer Retention",
          description: "Finding it hard to keep existing customers engaged",
          icon: "💎"
        },
        {
          id: "challenge-3",
          title: "Process Optimization",
          description: "Need to streamline and automate workflows",
          icon: "⚡"
        },
        {
          id: "challenge-4",
          title: "Team Growth",
          description: "Scaling your team and maintaining quality",
          icon: "👥"
        }
      ]
    },
    {
      id: 4,
      title: "What's your timeline?",
      description: "When do you hope to see results?",
      options: [
        {
          id: "timeline-1",
          title: "ASAP (Within 1 month)",
          description: "Need immediate results and quick implementation",
          icon: "⚡"
        },
        {
          id: "timeline-2",
          title: "Short-term (1-3 months)",
          description: "Looking for results in the next quarter",
          icon: "📅"
        },
        {
          id: "timeline-3",
          title: "Medium-term (3-6 months)",
          description: "Planning for sustainable long-term growth",
          icon: "📈"
        },
        {
          id: "timeline-4",
          title: "Long-term (6+ months)",
          description: "Building for the future with strategic planning",
          icon: "🎯"
        }
      ]
    }
  ];

  const handleFunnelComplete = (answers) => {
    console.log('Funnel completed with answers:', answers);
    // Here you can send the answers to your backend
    // or redirect to a results page
    alert('Thank you for completing our funnel! We\'ll be in touch soon.');
  };

  return (
    <div className="animated-funnel-demo">
      <AnimatedFunnelFlow 
        steps={funnelSteps}
        onComplete={handleFunnelComplete}
      />
    </div>
  );
};

export default AnimatedFunnelDemo;
