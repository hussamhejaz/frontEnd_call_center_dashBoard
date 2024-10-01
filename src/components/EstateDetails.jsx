import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/EstateDetails.css'; // Ensure you have the CSS file for styling

const EstateDetails = () => {
  const { estateId } = useParams();
  const [estate, setEstate] = useState(null);
  const [error, setError] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstateDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/new-estate`);
        if (!response.ok) {
          throw new Error('Failed to fetch estate details');
        }
        const estates = await response.json();
        const estateDetails = estates.find((est) => est.id === estateId);
        if (estateDetails) {
          setEstate(estateDetails);
        } else {
          setError('Estate not found');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEstateDetails();
  }, [estateId]);

  const getAccountType = (typeAccount) => {
    switch (typeAccount) {
      case '1': return 'Star';
      case '2': return 'Premium';
      case '3': return 'Premium Plus';
      default: return 'Unknown';
    }
  };

  const getCategory = (type) => {
    switch (type) {
      case '1': return 'Hottel';
      case '2': return 'Coffee';
      case '3': return 'Restaurant';
      default: return 'Unknown';
    }
  };

  const handleUpdateIsAccepted = async (isAccepted) => {
    if (!estate) {
      console.error('Estate is missing!');
      alert('Unable to update estate. Please try again later.');
      return;
    }

    const category = getCategory(estate.type);

    try {
      const updateUrl = `http://localhost:5001/update-isaccepted/${category}/${estateId}`;
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ IsAccepted: isAccepted }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update estate. Status: ${response.status}`);
      }

      setShowConfirmation(false); 
      navigate('/new-estate');
    } catch (error) {
      console.error(`Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    }
  };

  const openConfirmationBox = (action) => {
    setActionType(action);
    setShowConfirmation(true); 
  };

  const closeConfirmationBox = () => {
    setShowConfirmation(false); 
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!estate) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="estate-details-container">
      <h2 className="estate-details__title">{estate.companyName} Profile</h2>

      <div className="estate-details__image">
        <img
          src={estate.facilityImageUrl}
          alt="Estate Thumbnail"
          className="estate-details__thumbnail"
          onClick={() => setIsImageModalOpen(true)}
        />
      </div>

      {/* Full-Screen Image Modal */}
      {isImageModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <span className="modal__close" onClick={() => setIsImageModalOpen(false)}>&times;</span>
            <img src={estate.facilityImageUrl} alt="Full Size Estate" className="modal__image" />
          </div>
        </div>
      )}

      <table className="estate-details-table">
        <tbody>
          <tr>
            <th>Provider Name</th>
            <td>{estate.providerName || 'Unknown Provider'}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{estate.email || 'Unknown Email'}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{estate.phone || 'Unknown Phone'}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{estate.city || 'Unknown City'}</td>
          </tr>
          <tr>
            <th>Country</th>
            <td>{estate.country || 'Unknown Country'}</td>
          </tr>
          <tr>
            <th>State</th>
            <td>{estate.state || 'Unknown State'}</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>{getCategory(estate.type)}</td>
          </tr>
          <tr>
            <th>Account Type</th>
            <td>{getAccountType(estate.accountType)}</td>
          </tr>
          <tr>
            <th>Tax Number</th>
            <td>{estate.taxNumber || 'Unknown Tax Number'}</td>
          </tr>
          <tr>
            <th>Music</th>
            <td>{estate.music}</td>
          </tr>
          <tr>
            <th>Has Kids Area</th>
            <td>{estate.hasKidsArea}</td>
          </tr>
          <tr>
            <th>Has Massage</th>
            <td>{estate.hasMassage}</td>
          </tr>
          <tr>
            <th>Has Swimming Pool</th>
            <td>{estate.hasSwimmingPool}</td>
          </tr>
          <tr>
            <th>Has Valet</th>
            <td>{estate.hasValet}</td>
          </tr>
          <tr>
            <th>Sessions</th>
            <td>{estate.sessions}</td>
          </tr>
        </tbody>
      </table>

      <div className="estate-details__actions">
        <button onClick={() => openConfirmationBox("accept")} className="estate-details__btn estate-details__btn--accept">Accept</button>
        <button onClick={() => openConfirmationBox("reject")} className="estate-details__btn estate-details__btn--reject">Reject</button>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-modal__content">
            <p>Are you sure you want to {actionType === 'accept' ? 'accept' : 'reject'} this estate?</p>
            <button
              onClick={() => handleUpdateIsAccepted(actionType === 'accept' ? "2" : "3")}
              className="confirmation-modal__btn confirmation-modal__btn--confirm"
            >
              Confirm
            </button>
            <button onClick={closeConfirmationBox} className="confirmation-modal__btn confirmation-modal__btn--cancel">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstateDetails;
