import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Providers.css'; // Custom CSS for Providers

const Providers = () => {
  const [providersData, setProvidersData] = useState([]);
  const [selectedType] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('https://backend-call-center-2.onrender.com/providers'); // Fetching all providers
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProvidersData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  

const handleProviderClick = (estateId) => {
  navigate(`/estate/${estateId}`); // Navigates to the profile page for that estate
};

  const filteredProviders = providersData.filter(provider => {
    const matchesType = selectedType === 'All' || provider.accountType === selectedType;
    const matchesIndustry = selectedIndustry === 'All' || provider.type === selectedIndustry;
    const matchesSearch = provider.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          provider.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesIndustry && matchesSearch;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="providers-container-wrapper">
      <div className="providers-container">
        <h2 className="providers-title">Providers</h2>
        <div className="providers-controls">
          <input
            type="text"
            placeholder="Search by company name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="providers-search"
          />

          <select id="providerIndustry" onChange={(e) => setSelectedIndustry(e.target.value)} className="providers-filter">
            <option value="All">All Industries</option>
            <option value="2">Coffee</option>
            <option value="1">Hotel</option>
            <option value="3">Restaurant</option>
          </select>
        </div>
        <div className="providers-list">
          {filteredProviders.map(provider => (
           <div className={`provider-card ${provider.type === '1' ? 'hotel-card' : provider.type === '2' ? 'coffee-card' : 'restaurant-card'}`} onClick={() => handleProviderClick(provider.id)}>
           <div className="provider-card-inner">
             <h3 className="provider-name">{provider.companyName}</h3>
             <p className="provider-email"><strong>Email:</strong> {provider.email}</p>
             <p className="provider-phone"><strong>Phone:</strong> {provider.phone}</p>
             <p className="provider-industry"><strong>Industry:</strong> {provider.industry}</p>
           </div>
         </div>
         
          ))}
        </div>
      </div>
    </div>
  );
};

export default Providers;
