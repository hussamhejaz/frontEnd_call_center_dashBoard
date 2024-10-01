import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import '../style/RegisterAdmin.css'; // Import the custom CSS

const RegisterAdmin = () => {
  const { registerAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('admin'); // Default role is 'admin'
  const [message, setMessage] = useState(''); // Message to show success or failure

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAdmin(email, password, { firstName, lastName, role });
      setMessage('Admin registered successfully!');
      // Clear form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole('admin'); // Reset role to default
    } catch (error) {
      setMessage('Failed to register admin. Please try again.');
    }
  };

  return (
    <div className="register-admin-container">
      <h2>Register New Admin</h2>
      <form onSubmit={handleSubmit} className="register-admin-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="admin">Admin</option>
          <option value="superAdmin">Super Admin</option>
        </select>
        <button type="submit">Register Admin</button>
      </form>
      {message && <p>{message}</p>} {/* Show success or failure message */}
    </div>
  );
};

export default RegisterAdmin;
