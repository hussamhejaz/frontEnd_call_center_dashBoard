import React, { useState } from 'react';
import '../style/Settings.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../auth/AuthContext'; // Import auth context to check role
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'; // Import Firebase methods

const Settings = () => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Handle password field change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  // Handle password change with Firebase reauthentication
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.email) {
      toast.error('No user is currently logged in');
      return;
    }

    if (password.newPassword !== password.confirmNewPassword) {
      toast.error('New password and confirmation do not match!');
      return;
    }

    try {
      // Reauthenticate the user before changing password
      const credential = EmailAuthProvider.credential(currentUser.email, password.currentPassword);

      // Reauthenticate the user
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, password.newPassword);
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(`Failed to change password: ${error.message}`);
    }
  };

  return (
    <div className="settings-container">
      <ToastContainer />
      <h2>Settings</h2>
      <div className="settings-grid">

        {/* Profile Settings */}
        <div className="settings-card">
          <h3>Profile Settings</h3>
          <form>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={currentUser?.displayName || 'adminUser'}
                readOnly // Make the field read-only
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={currentUser?.email || 'admin@example.com'}
                readOnly // Make the field read-only
              />
            </div>
          </form>
        </div>

        {/* Account Security (Change Password) */}
        <div className="settings-card">
          <h3>Account Security</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={password.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={password.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                required
              />
            </div>
            <button type="submit" className="btn-save">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
