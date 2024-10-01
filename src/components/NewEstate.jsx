import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import '../style/NewEstate.css';

const NewEstate = () => {
  const [estates, setEstates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        const response = await fetch('http://localhost:5001/new-estate');
        if (!response.ok) {
          throw new Error('Failed to fetch estates');
        }
        const data = await response.json();
        
        // If new estates are found, show a toast notification
        if (data.length > estates.length) {
          const newEstate = data[data.length - 1];
          toast.success(`New estate added: ${newEstate.companyName}`);
        }
        setEstates(data);
      } catch (error) {
        console.error('Error fetching estates:', error);
        toast.error('Error fetching estates.');
      }
    };

    // Initial fetch
    fetchEstates();
    
    // Poll every 10 seconds to check for new estates
    const interval = setInterval(() => {
      fetchEstates();
    }, 10000); // 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [estates]); // Use estates as a dependency

  const handleEstateClick = (estateId) => {
    navigate(`/estates/details/${estateId}`);
  };

  return (
    <div className="estates-container">
      <h2 className="estates-header">Estates List</h2>

      {/* Toast container to display notifications */}
      <ToastContainer />

      <div className="estates-grid">
        {estates.map((estate) => (
          <div key={estate.id} className="estate-card" onClick={() => handleEstateClick(estate.id)}>
            <h3>{estate.companyName}</h3>
            <p>Provider: {estate.providerName}</p>
            <p>City: {estate.city}</p>
            <p>Country: {estate.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewEstate;
