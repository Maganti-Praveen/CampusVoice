import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Campus Voice
        </Link>
        
        <div className="navbar-menu">
          {isAdmin ? (
            <>
              <Link to="/admin/complaints" className="nav-link">Complaints</Link>
              <Link to="/admin/feedback" className="nav-link">Feedback Polls</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/complaints" className="nav-link">All Complaints</Link>
              <Link to="/my-complaints" className="nav-link">My Complaints</Link>
              <Link to="/feedback" className="nav-link">Feedback</Link>
            </>
          )}
          
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
