// Register Page Component
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    department: '',
    year: '',
    section: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.rollNumber || !formData.name || !formData.department || 
        !formData.year || !formData.section || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', {
        rollNumber: formData.rollNumber,
        name: formData.name,
        department: formData.department,
        year: parseInt(formData.year),
        section: formData.section,
        password: formData.password
      });

      // Auto-login after registration
      login(response.data.token, response.data.user);
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Student Registration</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Roll Number *</label>
            <input
              type="text"
              name="rollNumber"
              className="form-control"
              placeholder="e.g., 21CS001"
              value={formData.rollNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="EEE">EEE</option>
              <option value="AIDS">AI&DS</option>
              <option value="IOT">IOT</option>
              <option value="CYBER">Cyber Security</option>
              <option value="AIML">AI&ML</option>
              <option value="AIDS">AI&DS</option>
            </select>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Year *</label>
              <select
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="form-group">
              <label>Section *</label>
              <select
                name="section"
                className="form-control"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-large"
            disabled={loading}
          >
            {loading ? <div className="spinner spinner-small"></div> : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
