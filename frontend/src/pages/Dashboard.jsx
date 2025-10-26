import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/complaints/my');
      const complaints = response.data;
      
      setStats({
        totalComplaints: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
      });
      
      setRecentComplaints(complaints.slice(0, 5));
      
      setLoading(false);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
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
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}!</h1>
          <p className="text-muted">
            {user.rollNumber} | {user.department} | Year {user.year} | Section {user.section}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">Total</div>
            <div className="stat-info">
              <h3>{stats.totalComplaints}</h3>
              <p>Total Complaints</p>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">Pending</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card stat-progress">
            <div className="stat-icon">In Progress</div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="stat-card stat-resolved">
            <div className="stat-icon">Resolved</div>
            <div className="stat-info">
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn"
              onClick={() => navigate('/complaints/new')}
            >
              <span className="action-icon">+</span>
              <span>Post New Complaint</span>
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/complaints')}
            >
              <span className="action-icon">List</span>
              <span>View All Complaints</span>
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/my-complaints')}
            >
              <span className="action-icon">My</span>
              <span>My Complaints</span>
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/feedback')}
            >
              <span className="action-icon">Rate</span>
              <span>Feedback Polls</span>
            </button>
          </div>
        </div>

        {/* Recent Complaints */}
        {recentComplaints.length > 0 && (
          <div className="recent-complaints">
            <h2>Recent Complaints</h2>
            <div className="complaints-list">
              {recentComplaints.map((complaint) => (
                <div key={complaint._id} className="complaint-item-mini">
                  <div className="complaint-mini-header">
                    <h4>{complaint.title}</h4>
                    <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-muted text-small">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <button 
              className="btn btn-secondary mt-2"
              onClick={() => navigate('/my-complaints')}
            >
              View All My Complaints
            </button>
          </div>
        )}

        {recentComplaints.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">Empty</div>
            <h3>No Complaints Yet</h3>
            <p>Start by posting your first complaint</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => navigate('/complaints/new')}
            >
              Post Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
