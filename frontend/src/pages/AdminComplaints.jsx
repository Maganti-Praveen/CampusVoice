import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import './Admin.css';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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

  const handleUpdateStatus = async (complaintId) => {
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await api.put(`/complaints/${complaintId}/status`, {
        status: selectedStatus,
        adminResponse: responseText
      });
      toast.success('Complaint updated successfully');
      setEditingComplaint(null);
      setResponseText('');
      setSelectedStatus('');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/complaints/${complaintId}`);
      toast.success('Complaint deleted successfully');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  const startEditing = (complaint) => {
    setEditingComplaint(complaint._id);
    setSelectedStatus(complaint.status);
    setResponseText(complaint.adminResponse || '');
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
          <h1>Manage Complaints</h1>
          <p className="text-muted">View and manage all student complaints</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <h3>{complaints.length}</h3>
          <p>Total</p>
        </div>
        <div className="admin-stat-card">
          <h3>{complaints.filter(c => c.status === 'Pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="admin-stat-card">
          <h3>{complaints.filter(c => c.status === 'In Progress').length}</h3>
          <p>In Progress</p>
        </div>
        <div className="admin-stat-card">
          <h3>{complaints.filter(c => c.status === 'Resolved').length}</h3>
          <p>Resolved</p>
        </div>
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
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="complaints-list">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="admin-complaint-card card">
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

              {/* Complaint Content */}
              <h3 className="complaint-title">{complaint.title}</h3>
              <p className="complaint-description">{complaint.description}</p>

              {/* Current Management Response */}
              {complaint.adminResponse && (
                <div className="admin-response">
                  <strong>Current Response:</strong>
                  <p>{complaint.adminResponse}</p>
                </div>
              )}

              {/* Stats */}
              <div className="complaint-stats">
                <span>Agrees: {complaint.agrees?.length || 0}</span>
                <span>Disagrees: {complaint.disagrees?.length || 0}</span>
                <span>Comments: {complaint.comments?.length || 0}</span>
              </div>

              {/* Management Actions */}
              {editingComplaint === complaint._id ? (
                <div className="admin-edit-form">
                  <div className="form-group">
                    <label>Update Status:</label>
                    <select
                      className="form-control"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Management Response:</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter your response to the student..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows="4"
                    />
                  </div>

                  <div className="flex gap-1">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleUpdateStatus(complaint._id)}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingComplaint(null);
                        setResponseText('');
                        setSelectedStatus('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-actions">
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => startEditing(complaint)}
                  >
                    Update Status
                  </button>
                  <button 
                    className="btn btn-danger btn-small"
                    onClick={() => handleDeleteComplaint(complaint._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
