import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import './UserDropdown.css';
import toast from 'react-hot-toast';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast("You have been logged out 👋");
  };

  if (!user) return null;

  return (
    <div className="user-dropdown">
      <button 
        className="user-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        {!isMobile ? (
          <>
            {user.name || user.email.split('@')[0]}
            <span className="user-chevron">▼</span>
          </>
        ) : (
          <span className="mobile-icon">👤</span>
        )}
      </button>
      
      {isOpen && (
        <>
          {/* Click outside overlay */}
          <div 
            className="dropdown-overlay"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="dropdown-menu">
            <div className="user-info">
              <p>{user.name}</p>
              <p className="email">{user.email}</p>
            </div>
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;