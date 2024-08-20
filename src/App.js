import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Todo from './components/Todo';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/todo" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/todo" element={isAuthenticated ? <Todo onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/todo" /> : <Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
