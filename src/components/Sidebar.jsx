import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  FaRegNewspaper,
  FaLevelUpAlt,
} from 'react-icons/fa';
import '../style/Sidebar.css';
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout, currentUser } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <button className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </button>
        {isOpen && <h2 className="title">Diamond Host</h2>}
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-content">
        {isOpen && currentUser && (
          <p className="welcome-message">Welcome, {currentUser.firstName}!</p>
        )}

        <ul className="sidebar-list">
          {currentUser?.role === 'superAdmin' && (
            <li className="sidebar-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <FaHome className="sidebar-icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'superAdmin') && (
            <>
              <li className="sidebar-item">
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaUsers className="sidebar-icon" />
                  <span>Users</span>
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink
                  to="/providers"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaUserTie className="sidebar-icon" />
                  <span>Providers</span>
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink
                  to="/feedback"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaComments className="sidebar-icon" />
                  <span>Feedback</span>
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink
                  to="/new-estate"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaBuilding className="sidebar-icon" />
                  <span>New Estate</span>
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink
                  to="/posts"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaRegNewspaper className="sidebar-icon" />
                  <span>Posts</span>
                </NavLink>
              </li>
            </>
          )}

          {currentUser?.role === 'superAdmin' && (
            <>
              <li className="sidebar-item">
                <NavLink
                  to="/admin-section"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaUserShield className="sidebar-icon" />
                  <span>Admin Section</span>
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink
                  to="/provider-feedback"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaComments className="sidebar-icon" />
                  <span>Provider Feedback</span>
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink
                  to="/register-admin"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaUserPlus className="sidebar-icon" />
                  <span>Register Admin</span>
                </NavLink>
              </li>
            </>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'superAdmin') && (
            <>
              <li className="sidebar-item">
                <NavLink
                  to="/upgrade-user-account"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaLevelUpAlt className="sidebar-icon" />
                  <span>Upgrade User Account</span>
                </NavLink>
              </li>
              <li className="sidebar-item">
                <NavLink
                  to="/upgrade-provider-account"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <FaLevelUpAlt className="sidebar-icon" />
                  <span>Upgrade Provider Account</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Logout Button */}
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
