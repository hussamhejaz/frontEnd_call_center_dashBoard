import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Users.css'; // Custom CSS
import debounce from 'lodash.debounce';

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedAccountType, setSelectedAccountType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://backend-call-center-2.onrender.com/user');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsersData(data);
        } else {
          setError('Data format is incorrect');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleSearchChange = debounce((e) => setSearchTerm(e.target.value), 300);

  const filteredUsers = usersData.filter(user => {
    const matchesGender = selectedGender === 'All' || user.Gender === selectedGender;
    const matchesAccountType = selectedAccountType === 'All' || user.accountType === Number.parseInt(selectedAccountType, 10);
    const matchesSearch = (user.FirstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.Email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.PhoneNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGender && matchesAccountType && matchesSearch;
  });

  const getAccountTypeClass = (accountType) => {
    if (accountType === 1) return 'star-user';
    if (accountType === 2) return 'vip-user';
    if (accountType === 3) return 'premium-user';
    return '';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="users-container-wrapper">
      <div className="users-container">
        <h2 className="users-title">Users</h2>
        <div className="users-controls">
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            onChange={handleSearchChange}
            className="users-search"
            aria-label="Search users by name, email, or phone number"
          />
          <select
            id="genderFilter"
            onChange={(e) => setSelectedGender(e.target.value)}
            className="users-filter"
            aria-label="Filter by gender"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            id="accountTypeFilter"
            onChange={(e) => setSelectedAccountType(e.target.value)}
            className="users-filter"
            aria-label="Filter by account type"
          >
            <option value="All">All Account Types</option>
            <option value="1">Star</option>
            <option value="2">Premium</option>
            <option value="3">Premium Plus</option>
          </select>
        </div>
        <div className="users-list">
          {filteredUsers.map(user => (
            <div key={user.id} className={`user-card ${getAccountTypeClass(user.accountType)}`} onClick={() => handleUserClick(user.id)} role="button" tabIndex="0">
              <div className="user-card-inner">
                <div className="user-info">
                  <h3 className="user-name">{`${user.FirstName || ''} ${user.LastName || ''}`}</h3>
                  <p className="user-email"><strong>Email:</strong> {user.Email || 'No Email'}</p>
                  <p className="user-phone"><strong>Phone:</strong> {user.PhoneNumber || 'No Phone'}</p>
                  <p className="user-gender"><strong>Gender:</strong> {user.Gender || 'Unknown'}</p>
                  <p className="account-type"><strong>Account Type:</strong> {user.accountType === 1 ? 'Star' : user.accountType === 2 ? 'Premium' : 'Premium Plus'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
