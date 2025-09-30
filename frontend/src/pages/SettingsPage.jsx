import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    autoSave: true,
    language: 'en'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    setUser(userData);
    setSettings({ ...settings, ...savedSettings });
    setIsLoading(false);
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    setSaveStatus('Settings saved!');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userSettings');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="container">
        {/* Header */}
        <div className="settings-header">
          <div className="header-content">
            <h1>Account Settings</h1>
            <p>Manage your account preferences and settings</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* User Profile */}
        <motion.div 
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>Profile Information</h2>
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-icon">👤</div>
            </div>
            <div className="profile-info">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'user@example.com'}</p>
              <span className={`subscription-badge ${
                user?.subscription === 'pro' ? 'pro' : 'free'
              }`}>
                {user?.subscription === 'pro' ? 'Pro Account' : 'Free Account'}
              </span>
            </div>
            <Link to="/profile" className="btn btn-primary">
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div 
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Preferences</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive email updates about your funnels</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Updates</h3>
                <p>Get notified about new features and updates</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailUpdates}
                  onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Dark Mode</h3>
                <p>Switch to dark theme for better viewing</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Auto-Save</h3>
                <p>Automatically save changes as you work</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div 
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Language & Region</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>Choose your preferred language</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="form-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div 
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Account Actions</h2>
          <div className="actions-grid">
            <Link to="/billing" className="action-card">
              <div className="action-icon">💳</div>
              <h4>Billing & Subscription</h4>
              <p>Manage your subscription and billing</p>
            </Link>
            
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h4>Edit Profile</h4>
              <p>Update your personal information</p>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="action-card danger"
            >
              <div className="action-icon">🚪</div>
              <h4>Sign Out</h4>
              <p>Sign out of your account</p>
            </button>
          </div>
        </motion.div>

        {/* Save Status */}
        {saveStatus && (
          <motion.div 
            className="save-status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✅ {saveStatus}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
