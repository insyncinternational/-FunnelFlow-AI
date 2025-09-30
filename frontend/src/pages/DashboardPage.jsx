import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FunnelPreviewModal from '../components/FunnelPreviewModal';
import '../styles/FunnelPreviewModal.css';

const DashboardPage = () => {
  const [funnels, setFunnels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [previewModal, setPreviewModal] = useState({ isOpen: false, funnel: null });

  useEffect(() => {
    // Get user info
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    // Load funnels from localStorage
    const loadFunnels = () => {
      try {
        const funnelKeys = Object.keys(localStorage).filter(key => key.startsWith('funnel_'));
        const loadedFunnels = funnelKeys.map(key => {
          try {
            const funnelData = JSON.parse(localStorage.getItem(key));
            return {
              id: funnelData.id,
              name: funnelData.name || 'Untitled Funnel',
              type: funnelData.type || 'general',
              status: funnelData.status || 'draft',
              views: funnelData.views || 0,
              conversions: funnelData.conversions || 0,
              conversionRate: funnelData.conversionRate || 0,
              lastUpdated: funnelData.lastModified ? 
                new Date(funnelData.lastModified).toLocaleString() : 'Unknown',
              steps: funnelData.steps || [],
              connections: funnelData.connections || []
            };
          } catch (error) {
            console.error(`Error parsing funnel ${key}:`, error);
            return null;
          }
        }).filter(funnel => funnel !== null);

        setFunnels(loadedFunnels);
      } catch (error) {
        console.error('Error loading funnels:', error);
        // Fallback to empty array if loading fails
        setFunnels([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate loading delay for better UX
    setTimeout(loadFunnels, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePreview = (funnel) => {
    setPreviewModal({ isOpen: true, funnel });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, funnel: null });
  };

  const refreshFunnels = () => {
    setIsLoading(true);
    const loadFunnels = () => {
      try {
        const funnelKeys = Object.keys(localStorage).filter(key => key.startsWith('funnel_'));
        const loadedFunnels = funnelKeys.map(key => {
          try {
            const funnelData = JSON.parse(localStorage.getItem(key));
            return {
              id: funnelData.id,
              name: funnelData.name || 'Untitled Funnel',
              type: funnelData.type || 'general',
              status: funnelData.status || 'draft',
              views: funnelData.views || 0,
              conversions: funnelData.conversions || 0,
              conversionRate: funnelData.conversionRate || 0,
              lastUpdated: funnelData.lastModified ? 
                new Date(funnelData.lastModified).toLocaleString() : 'Unknown',
              steps: funnelData.steps || [],
              connections: funnelData.connections || []
            };
          } catch (error) {
            console.error(`Error parsing funnel ${key}:`, error);
            return null;
          }
        }).filter(funnel => funnel !== null);

        setFunnels(loadedFunnels);
      } catch (error) {
        console.error('Error loading funnels:', error);
        setFunnels([]);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(loadFunnels, 300);
  };

  const deleteFunnel = (funnelId) => {
    if (window.confirm('Are you sure you want to delete this funnel? This action cannot be undone.')) {
      try {
        localStorage.removeItem(`funnel_${funnelId}`);
        refreshFunnels();
      } catch (error) {
        console.error('Error deleting funnel:', error);
      }
    }
  };

  const duplicateFunnel = (funnel) => {
    try {
      const newFunnel = {
        ...funnel,
        id: `funnel_${Date.now()}`,
        name: `${funnel.name} (Copy)`,
        status: 'draft',
        views: 0,
        conversions: 0,
        conversionRate: 0,
        lastModified: new Date().toISOString()
      };
      
      localStorage.setItem(`funnel_${newFunnel.id}`, JSON.stringify(newFunnel));
      refreshFunnels();
    } catch (error) {
      console.error('Error duplicating funnel:', error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            <p>Manage your funnels and track performance</p>
            {user?.subscription === 'pro' && (
              <div className="subscription-badge">
                <span className="badge pro">Pro Account</span>
              </div>
            )}
          </div>
          <Link to="/funnel-builder" className="btn btn-primary">
            🚀 Create New Funnel
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Funnels</h3>
              <p className="stat-number">{funnels.length}</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">👀</div>
            <div className="stat-content">
              <h3>Total Views</h3>
              <p className="stat-number">
                {funnels.reduce((sum, funnel) => sum + funnel.views, 0).toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Conversions</h3>
              <p className="stat-number">
                {funnels.reduce((sum, funnel) => sum + funnel.conversions, 0)}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Avg. Conversion Rate</h3>
              <p className="stat-number">
                {funnels.length > 0 
                  ? (funnels.reduce((sum, funnel) => sum + funnel.conversionRate, 0) / funnels.length).toFixed(1)
                  : 0
                }%
              </p>
            </div>
          </motion.div>
        </div>

        {/* Funnels List */}
        <div className="funnels-section">
          <div className="section-header">
            <h2>Your Funnels</h2>
            <div className="section-actions">
              <button 
                onClick={refreshFunnels}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                {isLoading ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
              <Link to="/analytics" className="btn btn-secondary">
                📊 View Analytics
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your funnels...</p>
            </div>
          ) : (
            <div className="funnels-grid">
              {funnels.map((funnel, index) => (
                <motion.div 
                  key={funnel.id}
                  className="funnel-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="funnel-header">
                    <h3 className="funnel-name">{funnel.name}</h3>
                    <span className={`status-badge ${getStatusColor(funnel.status)}`}>
                      {funnel.status}
                    </span>
                  </div>

                  <div className="funnel-stats">
                    <div className="stat">
                      <span className="stat-label">Views</span>
                      <span className="stat-value">{funnel.views.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Conversions</span>
                      <span className="stat-value">{funnel.conversions}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Conversion Rate</span>
                      <span className="stat-value">{funnel.conversionRate}%</span>
                    </div>
                  </div>

                  <div className="funnel-footer">
                    <span className="last-updated">Updated {funnel.lastUpdated}</span>
                    <div className="funnel-actions">
                      <Link 
                        to={`/funnel-builder/${funnel.id}`}
                        className="btn btn-sm btn-secondary"
                      >
                        ✏️ Edit
                      </Link>
                      <button 
                        onClick={() => handlePreview(funnel)}
                        className="btn btn-sm btn-primary"
                      >
                        👁️ Preview
                      </button>
                      <button 
                        onClick={() => duplicateFunnel(funnel)}
                        className="btn btn-sm btn-outline"
                        title="Duplicate Funnel"
                      >
                        📋 Copy
                      </button>
                      <button 
                        onClick={() => deleteFunnel(funnel.id)}
                        className="btn btn-sm btn-danger"
                        title="Delete Funnel"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/funnel-builder" className="action-card">
              <div className="action-icon">🎬</div>
              <h4>Create Video Funnel</h4>
              <p>Build a funnel with AI-powered videos</p>
            </Link>
            <Link to="/templates" className="action-card">
              <div className="action-icon">📋</div>
              <h4>Browse Templates</h4>
              <p>Start with a pre-built funnel template</p>
            </Link>
            <Link to="/analytics" className="action-card">
              <div className="action-icon">📊</div>
              <h4>View Analytics</h4>
              <p>Track performance and optimize</p>
            </Link>
            <Link to="/settings" className="action-card">
              <div className="action-icon">⚙️</div>
              <h4>Account Settings</h4>
              <p>Manage your account and preferences</p>
            </Link>
            <Link to="/animated-funnel" className="action-card">
              <div className="action-icon">🎭</div>
              <h4>Animated Funnel</h4>
              <p>Experience our interactive funnel flow</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <FunnelPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        funnelData={previewModal.funnel}
      />
    </div>
  );
};

export default DashboardPage;
