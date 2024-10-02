import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/ProviderProfile.css'; // Custom CSS

const ProviderProfile = () => {
  const { estateId } = useParams(); // Get estateId from URL
  const [providerData, setProviderData] = useState(null);
  const [estateData, setEstateData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchEstateAndProvider = async () => {
      try {
        const response = await fetch(`https://backend-call-center-2.onrender.com/estate-with-owner/${estateId}`);
        if (!response.ok) {
          throw new Error('Error fetching estate and provider details');
        }
        const data = await response.json();
        setEstateData(data.estate);
        setProviderData(data.provider);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetch(`https://backend-call-center-2.onrender.com/estate-bookings-with-users/${estateId}`);
        if (!response.ok) {
          throw new Error('Error fetching bookings');
        }
        const data = await response.json();
        setBookings(data); // Even if it's an empty array, this will work correctly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEstateAndProvider();
    fetchBookings();
  }, [estateId]);

  // Filter bookings based on search term (now based on booking ID)
  const filteredBookings = bookings.filter((booking) => {
    return booking.id.includes(searchTerm.toLowerCase());
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="provider-profile-container">
      <h1 className="provider-profile-title">Estate and Provider Profile</h1>

      {estateData && (
        <div className="provider-profile-estate-info">
          {/* Facility Image at the top */}
          <div className="provider-profile-facility-image">
            {estateData.FacilityImageUrl ? (
              <img
                src={estateData.FacilityImageUrl}
                alt="Facility"
                className="provider-profile-facility-image"
              />
            ) : (
              <p>No Facility Image available</p>
            )}
          </div>

          <h2 className="provider-profile-section-title">Estate Details</h2>
          <p><strong>Estate Name:</strong> {estateData.NameEn}</p>
          <p><strong>Industry:</strong> {estateData.BioEn || 'No Industry Info'}</p>
          <p><strong>State:</strong> {estateData.State}</p>
          <p><strong>Sessions:</strong> {estateData.Sessions}</p>
          <p><strong>Tax Number:</strong> {estateData.TaxNumer}</p>
          <p><strong>Menu Link:</strong> <a href={estateData.MenuLink} target="_blank" rel="noopener noreferrer">{estateData.MenuLink}</a></p>
          <p><strong>Music:</strong> {estateData.Music ? 'Yes' : 'No'}</p>
        </div>
      )}

      {providerData && (
        <div className="provider-profile-provider-info">
          <h2 className="provider-profile-section-title">Provider Details</h2>
          <p><strong>Name:</strong> {providerData.FirstName} {providerData.LastName}</p>
          <p><strong>Email:</strong> {providerData.Email}</p>
          <p><strong>Phone Number:</strong> {providerData.PhoneNumber}</p>
        </div>
      )}

      {/* Search Input */}
      <div className="provider-profile-search">
        <input
          type="text"
          placeholder="Search by Booking ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="provider-profile-search-input"
        />
      </div>

      {filteredBookings.length > 0 ? (
        <div className="provider-profile-bookings">
          <h2 className="provider-profile-section-title">Bookings</h2>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className={`booking-details ${booking.status === '1' ? 'status-under-process' : booking.status === '2' ? 'status-confirmed' : 'status-rejected'}`}>
              <h3>Booking ID: {booking.id}</h3> {/* Display Booking ID */}
              <h3>{booking.placeName}</h3>
              <p>
                <strong>Booking Status:</strong> {booking.status === '1' ? 'Under Process' : booking.status === '2' ? 'Confirmed' : 'Rejected'}
              </p>
              <p><strong>Start Date:</strong> {booking.startDate}</p>
              <p><strong>End Date:</strong> {booking.endDate}</p>
              <p><strong>Date of Booking:</strong> {booking.dateOfBooking}</p>
              <p><strong>Total:</strong> {booking.netTotal} SAR</p>
              {booking.user && (
                <div className="user-details">
                  <h4>Booked By: {booking.user.FirstName} {booking.user.LastName}</h4>
                  <p><strong>Email:</strong> {booking.user.Email}</p>
                  <p><strong>Phone:</strong> {booking.user.PhoneNumber}</p>
                  <p><strong>Gender:</strong> {booking.user.Gender}</p>
                  <p><strong>Smoker:</strong> {booking.user.IsSmoker ? 'Yes' : 'No'}</p>
                  <p><strong>Date of Birth:</strong> {booking.user.DateOfBirth}</p>
                  <p><strong>Country:</strong> {booking.user.Country}</p>
                  <p><strong>State:</strong> {booking.user.State}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings available for this estate.</p>  
      )}
    </div>
  );
};

export default ProviderProfile;
