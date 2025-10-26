import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Complaints.css';

const ComplaintFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [commentText, setCommentText] = useState({});

  const categories = ['All', 'Hostel', 'Mess', 'Transport', 'Academics', 'Others'];
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [categoryFilter, statusFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch complaints error:', error);
      toast.error('Failed to load complaints');
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;
    
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    setFilteredComplaints(filtered);
  };

  const handleAgree = async (complaintId) => {
    try {
      await api.post(`/complaints/${complaintId}/agree`);
      toast.success('Agreement recorded');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to record agreement');
    }
  };

  const handleDisagree = async (complaintId) => {
    try {
      await api.post(`/complaints/${complaintId}/disagree`);
      toast.success('Disagreement recorded');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to record disagreement');
    }
  };

  const handleComment = async (complaintId) => {
    const text = commentText[complaintId];
    if (!text || text.trim() === '') {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await api.post(`/complaints/${complaintId}/comment`, { text });
      toast.success('Comment added');
      setCommentText({ ...commentText, [complaintId]: '' });
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container complaints-container">
      <div className="page-header">
        <h1>Complaint Feed</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/complaints/new')}
        >
          + Post Complaint
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section card">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select 
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-info">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">Empty</div>
          <h3>No Complaints Found</h3>
          <p>Try adjusting your filters or be the first to post!</p>
        </div>
      ) : (
        <div className="complaints-list">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card card">
              {/* Header */}
              <div className="complaint-header">
                <div className="complaint-meta">
                  <span className="badge badge-category">{complaint.category}</span>
                  <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>
                    {complaint.status}
                  </span>
                  {complaint.isMyComplaint && (
                    <span className="badge" style={{background: '#667eea', color: 'white'}}>
                      My Complaint
                    </span>
                  )}
                </div>
                <span className="complaint-date">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Content */}
              <h3 className="complaint-title">{complaint.title}</h3>
              <p className="complaint-description">{complaint.description}</p>

              {/* Admin Response */}
              {complaint.adminResponse && (
                <div className="admin-response">
                  <strong>Management Response:</strong>
                  <p>{complaint.adminResponse}</p>
                </div>
              )}

              {/* Interactions */}
              <div className="complaint-interactions">
                <button 
                  className={`interaction-btn ${complaint.agrees?.includes(user.id) ? 'active-agree' : ''}`}
                  onClick={() => handleAgree(complaint._id)}
                >
                  Agree ({complaint.agrees?.length || 0})
                </button>
                <button 
                  className={`interaction-btn ${complaint.disagrees?.includes(user.id) ? 'active-disagree' : ''}`}
                  onClick={() => handleDisagree(complaint._id)}
                >
                  Disagree ({complaint.disagrees?.length || 0})
                </button>
                <span className="comments-count">
                  Comments: {complaint.comments?.length || 0}
                </span>
              </div>

              {/* Comments Section */}
              {complaint.comments && complaint.comments.length > 0 && (
                <div className="comments-section">
                  <h4>Comments:</h4>
                  {complaint.comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <p>{comment.text}</p>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="add-comment">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a comment..."
                  value={commentText[complaint._id] || ''}
                  onChange={(e) => setCommentText({
                    ...commentText,
                    [complaint._id]: e.target.value
                  })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(complaint._id);
                    }
                  }}
                />
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => handleComment(complaint._id)}
                >
                  Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintFeed;
