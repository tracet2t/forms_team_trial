import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Todo from './Todo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown routes to login */}
      </Routes>
    </Router>
  );
}

export default App;
