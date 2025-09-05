import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ user, onLogout }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    onLogout();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define menu items for Sales Representatives
  const salesMenuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/models', label: 'Models', icon: '🚗' },
    { path: '/quiz', label: 'Quiz', icon: '📝' },
    { path: '/training', label: 'Training', icon: '🎓' },
    { path: '/catalog', label: 'Catalogue', icon: '📚' },
    { path: '/categories', label: 'Categories', icon: '📂' },
    { path: '/progress', label: 'Progress', icon: '📈' }
  ];

  return (
    <>
      {/* Top Header with User Info */}
      <header className="top-header">
        <div className="header-left">
          <img src="/vivanet-logo.svg" alt="Vivanet" className="header-logo" />
          <span className="header-title">AI-Powered Training System</span>
        </div>
        <div className="header-right">
          <div className="user-info-header">
            <div className="user-details">
              <span className="user-name-header">{user.name}</span>
              <span className="user-role-header">{user.role}</span>
            </div>
          </div>
          
          {/* Profile Avatar with Dropdown */}
          <div className="profile-dropdown" ref={dropdownRef}>
            <button 
              className="profile-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="avatar-image" />
              ) : (
                <span className="avatar-initials">{getInitials(user.name)}</span>
              )}
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-name">{user.name}</span>
                  <span className="dropdown-email">{user.email || 'user@vivanet.com'}</span>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="dropdown-icon">👤</span>
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="dropdown-icon">⚙️</span>
                  <span>Settings</span>
                </Link>
                <Link to="/help" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <span className="dropdown-icon">❓</span>
                  <span>Help & Support</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Left Sidebar Navigation */}
      <nav className="navigation-sidebar">
        <div className="nav-menu">
          {salesMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'nav-item active' : 'nav-item'}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className={location.pathname === '/admin' ? 'nav-item active' : 'nav-item'}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Admin</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navigation;