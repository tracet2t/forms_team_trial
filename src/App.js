import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Todo from './components/Todo';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown routes to login */}
      </Routes>
    </Router>
  );
}

export default App;
