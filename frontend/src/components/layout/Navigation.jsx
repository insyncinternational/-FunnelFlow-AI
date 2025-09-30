import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            🚀
          </div>
          <span className="logo-text">FunnelFlow AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="nav-auth">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">{user.avatar || '👤'}</span>
                <span className="user-name">{user.name}</span>
              </div>
              <div className="user-actions">
                <Link to="/dashboard" className="nav-button secondary">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="nav-button secondary">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-button secondary">
                Login
              </Link>
              <Link to="/signup" className="nav-button primary">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.div 
        className={`mobile-nav ${isOpen ? 'active' : ''}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-nav-content">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="mobile-nav-link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <div className="mobile-nav-auth">
            <Link 
              to="/login" 
              className="mobile-nav-button secondary"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="mobile-nav-button primary"
              onClick={() => setIsOpen(false)}
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
