import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend-call-center-2.onrender.com/user-with-bookings/${userId}`);
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        setUser(data.user);
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const getTypeLabel = (type) => {
    switch (type) {
      case '1':
        return 'Star';
      case '2':
        return 'Premium';
      case '3':
        return 'Premium plus';
      default:
        return 'Unknown';
    }
  };

  // Safely format the date from the backend (assuming format is "YYYY-MM-DD")
  const formatDate = (dateString) => {
    if (!dateString || dateString.trim() === '') {
      return 'Date not provided';
    }
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate) ? 'Invalid Date' : parsedDate.toLocaleDateString();
  };

  // Filter bookings based on search term (booking ID)
  const filteredBookings = bookings.filter((booking) =>
    booking.id.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {/* Display the user's profile image fetched from the API */}
          <img
            src={user?.ProfileImageUrl || 'https://via.placeholder.com/150'}  // Default image if no image URL
            alt={`${user?.FirstName || ''}'s profile`}
            className="profile-avatar"
          />
          <h2 className="profile-name">{`${user?.FirstName || ''} ${user?.LastName || ''}`}</h2>
          <p className="profile-email">{user?.Email || 'N/A'}</p>
        </div>
        <div className="profile-details">
          <p><strong>Phone:</strong> <span className="phone">{user?.PhoneNumber || 'N/A'}</span></p>
          <p><strong>Gender:</strong> <span className="gender">{user?.Gender || 'N/A'}</span></p>
          <p><strong>Account Type:</strong> <span className="account-type">{getTypeLabel(user?.TypeAccount)}</span></p>
          <p><strong>City:</strong> <span className="city">{user?.City || 'N/A'}, {user?.State || 'N/A'}</span></p>
          <p><strong>Date of Birth:</strong> <span className="date-of-birth">{user?.DateOfBirth || 'N/A'}</span></p>
          <p><strong>Date of Registration:</strong> <span className="date-of-registration">{user?.DateOfRegistration || 'N/A'}</span></p>
          <p><strong>Smoker:</strong> <span className="smoker">{user?.IsSmoker ? 'Yes' : 'No'}</span></p>
          <p><strong>Allergies:</strong> <span className="allergies">{user?.Allergies || 'None'}</span></p>
          <p><strong>Session Status:</strong> <span className="session-status">{user?.sessionStatus || 'N/A'}</span></p>
        </div>
      </div>

      {/* Search Input */}
      <div className="booking-search">
        <input
          type="text"
          placeholder="Search by Booking ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="booking-section">
        <h3>Booking Records</h3>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <div key={index} className={`booking-record ${booking.status === '1' ? 'under-process' : booking.status === '2' ? 'confirmed' : 'rejected'}`}>
              <div className="booking-status">
                <span className={`status-badge ${booking.status === '1' ? 'under-process' : booking.status === '2' ? 'confirmed' : 'rejected'}`}>
                  {booking.status === '1' ? 'Under Process' : booking.status === '2' ? 'Confirmed' : 'Rejected'}
                </span>
              </div>
              <div className="booking-details">
                <h4 className="place-name">{booking.placeName || 'Unknown Place'}</h4>
                <p><strong>Booking ID:</strong> {booking.id}</p> {/* Display Booking ID */}
                <p className="booking-info">
                  <strong>Start Date:</strong> {booking.startDate ? formatDate(booking.startDate) : 'Date not provided'}
                </p>
                <p className="booking-info">
                  <strong>End Date:</strong> {booking.endDate ? formatDate(booking.endDate) : 'Date not provided'}
                </p>
                <p className="booking-info">
                  <strong>Date of Booking:</strong> {booking.dateOfBooking ? formatDate(booking.dateOfBooking) : 'Date not provided'}
                </p>
                <p className="booking-info">
                  <strong>Location:</strong> 
                  {booking.city || 'Unknown City'}, {booking.country || 'Unknown Country'}
                </p>
                <p className="booking-info">
                  <strong>Total:</strong> {booking.netTotal ? `${booking.netTotal} SAR` : '0.0 SAR'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings available for this user.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
