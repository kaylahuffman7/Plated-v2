import { useState, useRef, useEffect } from 'react';
import './Header.css';

function Header({ user, onSignOut, onOpenMealLibrary, onOpenSettings }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.email || 'User';
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Plated</h1>
        
        <div className="header-actions">
          <button 
            className="meal-library-button"
            onClick={onOpenMealLibrary}
            title="Meal Library"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </button>

          <button 
            className="settings-button"
            onClick={onOpenSettings}
            title="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m8.66-10v0a9 9 0 0 1-1.34 1.34L17 12l2.32 1.68A9 9 0 0 1 20.66 15M3.34 9a9 9 0 0 1 1.34-1.34L7 12 4.68 13.68A9 9 0 0 1 3.34 15"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
            </svg>
          </button>

          <div className="profile-container" ref={dropdownRef}>
            <button 
              className="profile-button"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User menu"
            >
              <div className="profile-avatar">
                {getUserInitial()}
              </div>
              <svg 
                className={`chevron ${showDropdown ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {showDropdown && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <div className="profile-name">{getUserDisplayName()}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    onSignOut();
                    setShowDropdown(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
