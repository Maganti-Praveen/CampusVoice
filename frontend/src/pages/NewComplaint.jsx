// Create New Complaint
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import './Complaints.css';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Hostel', 'Mess', 'Transport', 'Academics', 'Others'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await api.post('/complaints', formData);
      toast.success('Complaint posted successfully!');
      navigate('/complaints');
    } catch (error) {
      console.error('Post complaint error:', error);
      toast.error(error.response?.data?.message || 'Failed to post complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container card">
        <h1>Post New Complaint</h1>
        <p className="text-muted mb-2">Your identity will remain anonymous in the public feed</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Brief title for your complaint"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Describe your complaint in detail..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? <div className="spinner spinner-small"></div> : 'Post Complaint'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/complaints')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
