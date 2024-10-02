import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';  
import { useAuth } from '../auth/AuthContext';  // Import your authentication context
import '../style/CustomerFeedback.css';

const CustomerFeedback = () => {
  const { currentUser } = useAuth();  // Get current user from authentication context
  const [feedbackData, setFeedbackData] = useState([]);  
  const [filteredFeedback, setFilteredFeedback] = useState([]);  
  const [commentTexts, setCommentTexts] = useState({});  
  const [isSubmitting, setIsSubmitting] = useState({});  
  const [loading, setLoading] = useState(true);  
  const [selectedRating, setSelectedRating] = useState('');  
  const [selectedDate, setSelectedDate] = useState('');  

  useEffect(() => {
    fetch('https://backend-call-center-2.onrender.com/feedbacks')
      .then((response) => response.json())
      .then((data) => {
        setFeedbackData(data);  
        setFilteredFeedback(data);  
        setLoading(false);  
      })
      .catch((error) => {
        console.error('Error fetching feedback data:', error);
        setLoading(false);  
      });
  }, []);

  const handleCommentSubmit = async (feedbackId) => {
    const commentText = commentTexts[feedbackId];  
    if (!commentText || !commentText.trim()) {
      console.log('Comment text is empty');
      return;
    }

    setIsSubmitting((prevState) => ({
      ...prevState,
      [feedbackId]: true,
    }));

    try {
      const response = await fetch(`https://backend-call-center-2.onrender.com/feedbacks/${feedbackId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentText,  
          author: currentUser?.firstName || 'Unknown User',  // Use the logged-in user's name
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.log('Response error:', errorResponse);
        throw new Error('Failed to add comment');
      }

      const responseData = await response.json();
      console.log('Comment added successfully:', responseData);

      setFeedbackData((prevData) => {
        return prevData.map((feedback) => {
          if (feedback.feedbackId === feedbackId) {
            return {
              ...feedback,
              comments: responseData.comments,  
            };
          }
          return feedback;
        });
      });

      setCommentTexts((prev) => ({ ...prev, [feedbackId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting((prevState) => ({
        ...prevState,
        [feedbackId]: false,
      }));
    }
  };

  const handleCommentChange = (feedbackId, value) => {
    setCommentTexts((prev) => ({
      ...prev,
      [feedbackId]: value,  
    }));
  };

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
    return <div>Loading feedback data...</div>;  
  }

  if (!Array.isArray(feedbackData) || feedbackData.length === 0) {
    return <div>No feedback data available.</div>;  
  }

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Customer Feedback</h2>

      {/* Rating Filter - Dropdown */}
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

        {/* Date Filter */}
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
            {/* Profile Picture */}
            <div className="feedback-user-image">
              <img 
                src={feedback.user.ProfileImageUrl} 
                alt={`${feedback.userName}'s profile`} 
                className="profile-pic"
              />
            </div>

            {/* User Name */}
            <h3 className="feedback-provider-name">
              <Link to={`/profile/${feedback.user?.userId || 'unknown'}`}>
                {feedback.userName}
              </Link>
            </h3>
            <p className="feedback-user-info">
              <strong>Email:</strong> {feedback.user.email}<br />
              <strong>Phone:</strong> {feedback.user.phone}
            </p>

            <h3 className="feedback-provider-name">
              <Link to={`/estate/${feedback.estate?.estateId || 'unknown'}`}>
                Feedback for: {feedback.estate.NameEn}
              </Link>
            </h3>

            <p className="feedback-text">{feedback.feedback}</p>

            {/* Star Rating */}
            <div className="feedback-rating">
              {[...Array(5)].map((star, i) => (
                <FaStar
                  key={i}
                  size={20}
                  color={i < feedback.rating ? "#ffc107" : "#e4e5e9"}
                />
              ))}
            </div>

            {/* Display Timestamp */}
            <p className="feedback-timestamp">
              Feedback Date: {new Date(feedback.timestamp).toLocaleDateString()}
            </p>

            {/* Comment Section */}
            <textarea
              placeholder="Write a response..."
              value={commentTexts[feedback.feedbackId] || ''}  
              onChange={(e) => handleCommentChange(feedback.feedbackId, e.target.value)}
              className="feedback-response"
            />
            <button
              onClick={() => handleCommentSubmit(feedback.feedbackId)}
              className="feedback-submit-button"
              disabled={isSubmitting[feedback.feedbackId]}  
            >
              {isSubmitting[feedback.feedbackId] ? 'Submitting...' : 'Submit Comment'}
            </button>

            {/* Display Comments */}
            <div className="feedback-comments">
              {feedback.comments && feedback.comments.length > 0 ? (
                feedback.comments.map((comment, index) => (
                  <p key={`${feedback.feedbackId}-comment-${comment.id}`} className="feedback-comment">
                    <strong>{comment.author}:</strong> {comment.text}
                  </p>
                ))
              ) : (
                <p className="no-comments">No comments yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerFeedback;
