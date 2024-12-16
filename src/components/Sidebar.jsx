// Sidebar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaSignOutAlt,
  FaBars,
  FaComments,
  FaBuilding,
  FaUserPlus,
  FaUserShield,
  FaRegNewspaper, // Added for Posts section
} from 'react-icons/fa'; // Added FaUserShield for Admin Section icon
import '../style/Sidebar.css';
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout, currentUser } = useAuth(); // Get currentUser from AuthContext

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Toggle button */}
      <button className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar header */}
      <div className="sidebar-header">
        {isOpen && <h2 className="title">Diamond Host</h2>}
        {isOpen && currentUser && (
          <p className="welcome-message">Welcome, {currentUser.firstName}!</p> // Display user's first name
        )}
      </div>

      <ul className="sidebar-list">
        {/* Show Dashboard only for 'superAdmin' */}
        {currentUser?.role === 'superAdmin' && (
          <li className="sidebar-item">
            <Link to="/" className="sidebar-link">
              <FaHome className="sidebar-icon" />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
        )}

        {/* Show Users, Providers, Customer Feedback, New Estate, and Posts for 'admin' and 'superAdmin' */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'superAdmin') && (
          <>
            <li className="sidebar-item">
              <Link to="/users" className="sidebar-link">
                <FaUsers className="sidebar-icon" />
                {isOpen && <span>Users</span>}
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/providers" className="sidebar-link">
                <FaUserTie className="sidebar-icon" />
                {isOpen && <span>Providers</span>}
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/feedback" className="sidebar-link">
                <FaComments className="sidebar-icon" />
                {isOpen && <span>Customer Feedback</span>}
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/new-estate" className="sidebar-link">
                <FaBuilding className="sidebar-icon" />
                {isOpen && <span>New Estate</span>}
              </Link>
            </li>
            {/* New Posts Link */}
            <li className="sidebar-item">
              <Link to="/posts" className="sidebar-link">
                <FaRegNewspaper className="sidebar-icon" />
                {isOpen && <span>Posts</span>}
              </Link>
            </li>
          </>
        )}

        {/* Show Admin Section, Provider Feedback, and Register Admin only for 'superAdmin' */}
        {currentUser?.role === 'superAdmin' && (
          <>
            <li className="sidebar-item">
              <Link to="/admin-section" className="sidebar-link">
                <FaUserShield className="sidebar-icon" />
                {isOpen && <span>Admin Section</span>}
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/provider-feedback" className="sidebar-link">
                <FaComments className="sidebar-icon" />
                {isOpen && <span>Provider Feedback</span>}
              </Link>
            </li>
            <li className="sidebar-item">
              <Link to="/register-admin" className="sidebar-link">
                <FaUserPlus className="sidebar-icon" />
                {isOpen && <span>Register New Admin</span>}
              </Link>
            </li>
          </>
        )}

        {/* Settings for all users */}
        {/* Uncomment if you want settings visible to all users */}
        {/* <li className="sidebar-item">
          <Link to="/settings" className="sidebar-link">
            <FaCog className="sidebar-icon" />
            {isOpen && <span>Settings</span>}
          </Link>
        </li> */}
      </ul>

      {/* Logout button */}
      <div className="btn-logout-container">
        <button onClick={handleLogout} className="btn-logout">
          <FaSignOutAlt className="sidebar-icon" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
