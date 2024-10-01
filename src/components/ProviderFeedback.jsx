import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../style/ProviderFeedback.css';

const ProviderFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/provider-feedback-to-customer')
      .then((response) => response.json())
      .then((data) => {
        setFeedbackData(data);
        setFilteredFeedback(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching provider feedback data:', error);
        setLoading(false);
      });
  }, []);

 



  const handleRatingFilterChange = (e) => {
    const rating = e.target.value;
    setSelectedRating(rating);
  };

  const handleDateFilterChange = (e) => {
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    let filtered = feedbackData;

    if (selectedRating) {
      filtered = filtered.filter((feedback) =>
        Math.round(feedback.rating) === parseInt(selectedRating, 10)
      );
    }

    if (selectedDate) {
      const formattedSelectedDate = new Date(selectedDate).toLocaleDateString();
      filtered = filtered.filter((feedback) => {
        const feedbackDate = new Date(feedback.timestamp).toLocaleDateString();
        return feedbackDate === formattedSelectedDate;
      });
    }

    setFilteredFeedback(filtered);
  }, [selectedRating, selectedDate, feedbackData]);

  if (loading) {
    return <div>Loading provider feedback data...</div>;
  }

  if (!Array.isArray(feedbackData) || feedbackData.length === 0) {
    return <div>No provider feedback data available.</div>;
  }

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Provider Feedback</h2>

      <div className="feedback-controls">
        <h3>Filter by Star Rating</h3>
        <select className="feedback-filter" value={selectedRating} onChange={handleRatingFilterChange}>
          <option value="">All Ratings</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>

        <div className="feedback-date-filter">
          <label>
            Date:
            <input 
              type="date" 
              value={selectedDate} 
              onChange={handleDateFilterChange} 
              className="feedback-date-input" 
            />
          </label>
        </div>
      </div>

      <div className="feedback-list">
        {filteredFeedback.map((feedback) => (
          <div key={feedback.feedbackId} className="feedback-card">
            <div className="feedback-user-image">
              <img 
                src={feedback.estateProfileImage || 'https://via.placeholder.com/150'} 
                alt={feedback.EstateName} 
                className="profile-pic"
              />
            </div>

            <h3 className="feedback-estate-name">
              <Link to={`/estate/${feedback.EstateID || 'unknown'}`}>
                {feedback.EstateName || 'Unknown Estate'}
              </Link>
            </h3>

            <h3 className="feedback-customer-name">
              Feedback for: 
              <Link to={`/profile/${feedback.CustomerID || 'unknown'}`}>
                {feedback.CustomerName}
              </Link>
            </h3>

            <p className="feedback-text">{feedback.comment}</p>

            <div className="feedback-rating">
              {[...Array(5)].map((star, i) => (
                <FaStar
                  key={i}
                  size={20}
                  color={i < feedback.rating ? "#ffc107" : "#e4e5e9"}
                />
              ))}
            </div>

            <p className="feedback-timestamp">
              Feedback Date: {new Date(feedback.timestamp).toLocaleDateString()}
            </p>

           
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderFeedback;
