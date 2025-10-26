import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import './Feedback.css';

const FeedbackPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await api.get('/feedback');
      setPolls(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch polls error:', error);
      toast.error('Failed to load polls');
      setLoading(false);
    }
  };

  const handleSubmitRating = async (pollId) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await api.post(`/feedback/${pollId}/rate`, { rating, comment });
      toast.success('Rating submitted successfully!');
      setSelectedPoll(null);
      setRating(0);
      setComment('');
      fetchPolls();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const renderStars = (value, interactive = false, onSelect = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= value ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onSelect && onSelect(star)}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container feedback-container">
      <div className="page-header">
        <h1>Feedback Polls</h1>
        <p className="text-muted">Share your feedback through ratings</p>
      </div>

      {polls.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">Empty</div>
          <h3>No Active Polls</h3>
          <p>There are no feedback polls available at the moment</p>
        </div>
      ) : (
        <div className="polls-grid">
          {polls.map((poll) => (
            <div key={poll._id} className="poll-card card">
              <div className="poll-header">
                <h3>{poll.title}</h3>
                <span className="badge badge-category">{poll.category}</span>
              </div>
              
              <p className="poll-description">{poll.description}</p>

              <div className="poll-stats">
                <div className="stat-item">
                  <span className="stat-value">{poll.averageRating || '0.00'}</span>
                  <span className="stat-label">Average Rating</span>
                  {renderStars(Math.round(poll.averageRating))}
                </div>
                <div className="stat-item">
                  <span className="stat-value">{poll.totalRatings}</span>
                  <span className="stat-label">Total Ratings</span>
                </div>
              </div>

              {poll.userRating ? (
                <div className="user-rating">
                  <strong>Your Rating:</strong>
                  {renderStars(poll.userRating)}
                  <button 
                    className="btn btn-secondary btn-small mt-1"
                    onClick={() => {
                      setSelectedPoll(poll._id);
                      setRating(poll.userRating);
                    }}
                  >
                    Update Rating
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-primary btn-block"
                  onClick={() => setSelectedPoll(poll._id)}
                >
                  Rate Now
                </button>
              )}

              {/* Rating Modal */}
              {selectedPoll === poll._id && (
                <div className="rating-form mt-2">
                  <h4>Your Rating:</h4>
                  {renderStars(rating, true, setRating)}
                  
                  <div className="form-group mt-2">
                    <label>Comment (Optional):</label>
                    <textarea
                      className="form-control"
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-1 mt-2">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleSubmitRating(poll._id)}
                    >
                      Submit Rating
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedPoll(null);
                        setRating(0);
                        setComment('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPolls;
