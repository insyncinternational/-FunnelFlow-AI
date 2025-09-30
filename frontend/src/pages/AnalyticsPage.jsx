import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
  const [funnels, setFunnels] = useState([]);
  const [selectedFunnel, setSelectedFunnel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
              views: funnelData.views || Math.floor(Math.random() * 1000),
              conversions: funnelData.conversions || Math.floor(Math.random() * 50),
              conversionRate: funnelData.conversionRate || (Math.random() * 5).toFixed(1),
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
        if (loadedFunnels.length > 0) {
          setSelectedFunnel(loadedFunnels[0]);
        }
      } catch (error) {
        console.error('Error loading funnels:', error);
        setFunnels([]);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(loadFunnels, 500);
  }, []);

  const totalViews = funnels.reduce((sum, funnel) => sum + funnel.views, 0);
  const totalConversions = funnels.reduce((sum, funnel) => sum + funnel.conversions, 0);
  const averageConversionRate = funnels.length > 0 ? 
    (funnels.reduce((sum, funnel) => sum + parseFloat(funnel.conversionRate), 0) / funnels.length).toFixed(1) : 0;

  return (
    <div className="analytics-page">
      <div className="container">
        {/* Header */}
        <div className="analytics-header">
          <div className="header-content">
            <h1>Analytics Dashboard</h1>
            <p>Track your funnel performance and optimize conversions</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="analytics-stats">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">👀</div>
            <div className="stat-content">
              <h3>Total Views</h3>
              <p className="stat-number">{totalViews.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Total Conversions</h3>
              <p className="stat-number">{totalConversions}</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Avg. Conversion Rate</h3>
              <p className="stat-number">{averageConversionRate}%</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Active Funnels</h3>
              <p className="stat-number">{funnels.length}</p>
            </div>
          </motion.div>
        </div>

        {/* Funnel Performance */}
        <div className="funnel-performance">
          <h2>Funnel Performance</h2>
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading analytics...</p>
            </div>
          ) : (
            <div className="performance-grid">
              {funnels.map((funnel, index) => (
                <motion.div 
                  key={funnel.id}
                  className="performance-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-header">
                    <h3>{funnel.name}</h3>
                    <span className={`status-badge ${
                      funnel.status === 'published' ? 'published' : 'draft'
                    }`}>
                      {funnel.status}
                    </span>
                  </div>
                  
                  <div className="performance-metrics">
                    <div className="metric">
                      <span className="metric-label">Views</span>
                      <span className="metric-value">{funnel.views.toLocaleString()}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Conversions</span>
                      <span className="metric-value">{funnel.conversions}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Conversion Rate</span>
                      <span className="metric-value">{funnel.conversionRate}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Steps</span>
                      <span className="metric-value">{funnel.steps.length}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <Link 
                      to={`/funnel-builder/${funnel.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Edit Funnel
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="analytics-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/funnel-builder" className="action-card">
              <div className="action-icon">🚀</div>
              <h4>Create New Funnel</h4>
              <p>Build a new conversion funnel</p>
            </Link>
            <Link to="/dashboard" className="action-card">
              <div className="action-icon">📊</div>
              <h4>Dashboard</h4>
              <p>View your funnel overview</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
