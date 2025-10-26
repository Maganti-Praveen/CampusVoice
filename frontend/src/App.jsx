// Main App Component with Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComplaintFeed from './pages/ComplaintFeed';
import NewComplaint from './pages/NewComplaint';
import MyComplaints from './pages/MyComplaints';
import FeedbackPolls from './pages/FeedbackPolls';
import AdminComplaints from './pages/AdminComplaints';
import AdminFeedback from './pages/AdminFeedback';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!adminOnly && user.role === 'admin') {
    return <Navigate to="/admin/complaints" replace />;
  }

  return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    return user.role === 'admin' 
      ? <Navigate to="/admin/complaints" replace />
      : <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Student Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/complaints" element={
          <ProtectedRoute>
            <ComplaintFeed />
          </ProtectedRoute>
        } />
        <Route path="/complaints/new" element={
          <ProtectedRoute>
            <NewComplaint />
          </ProtectedRoute>
        } />
        <Route path="/my-complaints" element={
          <ProtectedRoute>
            <MyComplaints />
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <FeedbackPolls />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/complaints" element={
          <ProtectedRoute adminOnly={true}>
            <AdminComplaints />
          </ProtectedRoute>
        } />
        <Route path="/admin/feedback" element={
          <ProtectedRoute adminOnly={true}>
            <AdminFeedback />
          </ProtectedRoute>
        } />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
