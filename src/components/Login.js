import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';  // Import the CSS file

function Login({ onLoginSuccess }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send the name and password to the server
      await axios.post('http://localhost:5000/api/login', { name, password });
      // Set authentication state on successful login
      onLoginSuccess();
      // Navigate to the TODO page
      navigate('/todo');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegisterNavigation = () => {
    // Navigate to the Register page on button click
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <div>
        <input
          type="text"
          value={name}
          placeholder="User Name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegisterNavigation} style={{ marginTop: '10px' }}>
        Register
      </button>
    </div>
  );
}

export default Login;
