import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import './Admin.css';

const AdminFeedback = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General'
  });

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

  const fetchPollDetails = async (pollId) => {
    try {
      const response = await api.get(`/feedback/${pollId}`);
      setSelectedPoll(response.data);
    } catch (error) {
      toast.error('Failed to load poll details');
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/feedback', formData);
      toast.success('Poll created successfully!');
      setShowCreateForm(false);
      setFormData({ title: '', description: '', category: 'General' });
      fetchPolls();
    } catch (error) {
      toast.error('Failed to create poll');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) {
      return;
    }

    try {
      await api.delete(`/feedback/${pollId}`);
      toast.success('Poll deleted successfully');
      setSelectedPoll(null);
      fetchPolls();
    } catch (error) {
      toast.error('Failed to delete poll');
    }
  };

  const handleTogglePoll = async (pollId) => {
    try {
      await api.put(`/feedback/${pollId}/toggle`);
      toast.success('Poll status updated');
      fetchPolls();
    } catch (error) {
      toast.error('Failed to toggle poll status');
    }
  };

  const renderStars = (value) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= value ? 'filled' : ''}`}>
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
    <div className="container admin-container">
      <div className="page-header">
        <div>
          <h1>Manage Feedback Polls</h1>
          <p className="text-muted">Create and manage feedback polls</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create New Poll'}
        </button>
      </div>

      {/* Create Poll Form */}
      {showCreateForm && (
        <div className="create-poll-form card">
          <h2>Create New Poll</h2>
          <form onSubmit={handleCreatePoll}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Rate Dr. Smith - Data Structures"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                className="form-control"
                placeholder="Describe what students should rate..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Teacher Rating, Course Feedback"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-success btn-large">
              Create Poll
            </button>
          </form>
        </div>
      )}

      {/* Polls List */}
      {polls.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">Empty</div>
          <h3>No Polls Yet</h3>
          <p>Create your first feedback poll to get started</p>
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

              <div className="poll-status">
                <span className={`status-indicator ${poll.isActive ? 'active' : 'inactive'}`}>
                  {poll.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="admin-actions">
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => fetchPollDetails(poll._id)}
                >
                  View Results
                </button>
                <button 
                  className="btn btn-warning btn-small"
                  onClick={() => handleTogglePoll(poll._id)}
                >
                  {poll.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => handleDeletePoll(poll._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Poll Details Modal */}
      {selectedPoll && (
        <div className="modal-overlay" onClick={() => setSelectedPoll(null)}>
          <div className="modal-content poll-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPoll.title}</h2>
              <button 
                className="btn btn-secondary btn-small"
                onClick={() => setSelectedPoll(null)}
              >
                Close
              </button>
            </div>

            <div className="poll-details-content">
              <div className="details-stats">
                <div className="detail-stat">
                  <h3>{selectedPoll.averageRating}</h3>
                  <p>Average Rating</p>
                  {renderStars(Math.round(selectedPoll.averageRating))}
                </div>
                <div className="detail-stat">
                  <h3>{selectedPoll.totalRatings}</h3>
                  <p>Total Responses</p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="rating-distribution">
                <h3>Rating Distribution</h3>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = selectedPoll.distribution?.[rating] || 0;
                  const percentage = selectedPoll.totalRatings > 0 
                    ? (count / selectedPoll.totalRatings * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <div key={rating} className="rating-bar">
                      <span className="rating-bar-label">{rating} ⭐</span>
                      <div className="rating-bar-track">
                        <div 
                          className="rating-bar-fill" 
                          style={{width: `${percentage}%`}}
                        >
                          {percentage > 10 && `${percentage}%`}
                        </div>
                      </div>
                      <span className="rating-bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Recent Comments */}
              {selectedPoll.ratings && selectedPoll.ratings.length > 0 && (
                <div className="poll-comments">
                  <h3>Recent Feedback</h3>
                  {selectedPoll.ratings
                    .filter(r => r.comment && r.comment.trim() !== '')
                    .slice(0, 10)
                    .map((rating, index) => (
                      <div key={index} className="comment-item">
                        <div className="flex-between">
                          {renderStars(rating.rating)}
                          <span className="comment-date">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{rating.comment}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
