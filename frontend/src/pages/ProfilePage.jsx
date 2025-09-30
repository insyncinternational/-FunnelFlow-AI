import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    bio: '',
    avatar: '👤'
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      company: userData.company || '',
      bio: userData.bio || '',
      avatar: userData.avatar || '👤'
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '👤'
    });
    setIsEditing(false);
  };

  const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓'];

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <h1>Profile Settings</h1>
            <p>Manage your personal information and preferences</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="profile-content">
          {/* Profile Card */}
          <motion.div 
            className="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="avatar-display">
                  {formData.avatar}
                </div>
                {isEditing && (
                  <div className="avatar-selector">
                    <h4>Choose Avatar:</h4>
                    <div className="avatar-options">
                      {avatars.map((avatar, index) => (
                        <button
                          key={index}
                          className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="profile-info">
                <h2>{user?.name || 'User'}</h2>
                <p className="user-email">{user?.email || 'user@example.com'}</p>
                <span className={`subscription-badge ${
                  user?.subscription === 'pro' ? 'pro' : 'free'
                }`}>
                  {user?.subscription === 'pro' ? 'Pro Account' : 'Free Account'}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    💾 Save Changes
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div 
            className="profile-form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </motion.div>

          {/* Account Stats */}
          <motion.div 
            className="account-stats-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h4>Funnels Created</h4>
                  <p className="stat-number">
                    {Object.keys(localStorage).filter(key => key.startsWith('funnel_')).length}
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👀</div>
                <div className="stat-content">
                  <h4>Total Views</h4>
                  <p className="stat-number">1,250</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <h4>Conversions</h4>
                  <p className="stat-number">45</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h4>Avg. Conversion Rate</h4>
                  <p className="stat-number">3.6%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="profile-actions-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <Link to="/billing" className="action-card">
                <div className="action-icon">💳</div>
                <h4>Billing & Subscription</h4>
                <p>Manage your subscription and payment methods</p>
              </Link>
              
              <Link to="/settings" className="action-card">
                <div className="action-icon">⚙️</div>
                <h4>Account Settings</h4>
                <p>Update your preferences and notifications</p>
              </Link>
              
              <Link to="/analytics" className="action-card">
                <div className="action-icon">📊</div>
                <h4>View Analytics</h4>
                <p>Track your funnel performance and metrics</p>
              </Link>
              
              <button 
                className="action-card danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to sign out?')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }
                }}
              >
                <div className="action-icon">🚪</div>
                <h4>Sign Out</h4>
                <p>Sign out of your account</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
