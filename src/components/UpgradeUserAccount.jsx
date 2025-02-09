import React, { useEffect, useState } from 'react';
import '../style/UpgradeAccount.css';

const UserManagement = () => {
  // State to hold all fetched providers
  const [providers, setProviders] = useState([]);
  // States for filtering the providers list
  const [searchPhone, setSearchPhone] = useState('');
  const [filterType, setFilterType] = useState(''); // '' means no filter; otherwise "1", "2", or "3"
  // State for showing the upgrade form for a selected provider
  const [selectedProvider, setSelectedProvider] = useState(null);
  // New account type selected for updating (as a string "1", "2", or "3")
  const [newTypeAccount, setNewTypeAccount] = useState('');
  // State for feedback messages (success/error)
  const [message, setMessage] = useState('');

  // Fetch providers on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://backend-call-center-2.onrender.com/user');
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Filter the providers based on phone search and type filter
  const filteredProviders = providers.filter(provider => {
    const phoneMatch = provider.PhoneNumber.includes(searchPhone);
    const typeMatch = filterType === '' || provider.accountType === parseInt(filterType, 10);
    return phoneMatch && typeMatch;
  });

  // Update the provider account type via PUT /update-user-type/:userId
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newTypeAccount || !selectedProvider) {
      setMessage('Please select a new account type.');
      return;
    }
    try {
      const response = await fetch(`https://backend-call-center-2.onrender.com/update-user-type/${selectedProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TypeAccount: newTypeAccount })
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('User TypeAccount updated successfully.');
        // Refresh the provider list so you can see the new type immediately.
        fetchUsers();
        // Reset the upgrade form
        setSelectedProvider(null);
        setNewTypeAccount('');
      } else {
        setMessage(result.message || 'Update failed.');
      }
    } catch (error) {
      console.error('Error updating user type account:', error);
      setMessage('Internal Server Error');
    }
  };

  // Helper function to convert numeric accountType to a label
  const getAccountTypeLabel = (type) => {
    switch (type) {
      case 1: return 'Star';
      case 2: return 'Premium';
      case 3: return 'Premium Plus';
      default: return 'Unknown';
    }
  };

  return (
    <div className="provider-management">
      <h1>Provider Management</h1>
      
      {/* Search and filter inputs */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by phone number"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Account Types</option>
          <option value="1">Star</option>
          <option value="2">Premium</option>
          <option value="3">Premium Plus</option>
        </select>
      </div>

      {/* Display the filtered providers in a table */}
      <div className="table-container">
        <table className="provider-table">
          <thead>
            <tr>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Current Account Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.map(provider => (
              <tr key={provider.id}>
                <td>{provider.PhoneNumber}</td>
                <td>{provider.Email}</td>
                <td>{getAccountTypeLabel(provider.accountType)}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => {
                      // Set the selected provider and reset previous selections/messages.
                      setSelectedProvider(provider);
                      setNewTypeAccount('');
                      setMessage('');
                    }}
                  >
                    Upgrade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade Form */}
      {selectedProvider && (
        <div className="upgrade-card">
          <h2>
            Upgrade Provider Account for {selectedProvider.FirstName} {selectedProvider.LastName}
          </h2>
          <p>
            Current Account Type: <strong>{getAccountTypeLabel(selectedProvider.accountType)}</strong>
          </p>
          <form onSubmit={handleUpdate}>
            <div className="form-group upgrade-select-group">
              <select
                value={newTypeAccount}
                onChange={(e) => setNewTypeAccount(e.target.value)}
              >
                <option value="">Select new account type</option>
                <option value="1">Star</option>
                <option value="2">Premium</option>
                <option value="3">Premium Plus</option>
              </select>
            </div>
            <button type="submit" className="upgrade-button">
              Update Account Type
            </button>
          </form>
          {message && <p className="message">{message}</p>}
          <button
            className="cancel-button"
            onClick={() => {
              // Cancel the upgrade and hide the form.
              setSelectedProvider(null);
              setNewTypeAccount('');
              setMessage('');
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
