import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Auth.css';

const Login = () => {
  const [userType, setUserType] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!identifier || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        identifier,
        password,
        userType
      });

      login(response.data.token, response.data.user);
      
      toast.success('Login successful!');
      
      if (response.data.user.role === 'admin') {
        navigate('/admin/complaints');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Campus Voice</h1>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Login As</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="student"
                  checked={userType === 'student'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <span>Student</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="admin"
                  checked={userType === 'admin'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <span>Management</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>
              {userType === 'student' ? 'Roll Number' : 'Email'}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={userType === 'student' ? 'Enter roll number' : 'Enter management email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-large"
            disabled={loading}
          >
            {loading ? <div className="spinner spinner-small"></div> : 'Login'}
          </button>
        </form>

        {userType === 'student' && (
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
