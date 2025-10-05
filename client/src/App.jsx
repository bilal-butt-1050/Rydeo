import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import "./styles/App.css";

import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import StudentDashboard from './pages/StudentDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token');
      }
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<Login onLogin={checkAuth} />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/user/login" />}
        />
        
        {/* Driver Routes */}
        <Route
          path="/driver/profile"
          element={user?.role === 'driver' ? <DriverDashboard /> : <Navigate to="/user/login" />}
        />
        
        {/* Student Routes */}
        <Route
          path="/student/profile"
          element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/user/login" />}
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/user/login" />} />
      </Routes>
    </Router>
  );
};

export default App;