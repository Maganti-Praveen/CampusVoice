import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import './Complaints.css';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const response = await api.get('/complaints/my');
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch my complaints error:', error);
      toast.error('Failed to load your complaints');
      setLoading(false);
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
        <h1>My Complaints</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/complaints/new')}
        >
          + Post New Complaint
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">Empty</div>
          <h3>No Complaints Yet</h3>
          <p>You haven't posted any complaints yet</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate('/complaints/new')}
          >
            Post Your First Complaint
          </button>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card card">
              {/* Header */}
              <div className="complaint-header">
                <div className="complaint-meta">
                  <span className="badge badge-category">{complaint.category}</span>
                  <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>
                    {complaint.status}
                  </span>
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

              {/* Stats */}
              <div className="complaint-stats">
                <span>Agrees: {complaint.agrees?.length || 0}</span>
                <span>Disagrees: {complaint.disagrees?.length || 0}</span>
                <span>Comments: {complaint.comments?.length || 0}</span>
              </div>

              {/* Comments */}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
