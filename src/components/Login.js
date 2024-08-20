import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';  // Import the CSS file

function Login({ onLoginSuccess }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Clear previous error messages
    setErrorMessage('');

    // Validate input fields
    if (!name || !password) {
      setErrorMessage('Username and password cannot be empty');
      return;
    }

    try {
      // Send the name and password to the server
      const response = await axios.post('http://localhost:5000/api/login', { name, password });

      // Assuming the server response contains the userId and userName
      const { userId, userName } = response.data;

      // Store userId and userName in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);

      // Set authentication state on successful login
      onLoginSuccess();

      // Navigate to the TODO page
      navigate('/todo');
    } catch (error) {
      if (error.response) {
        // Handle specific error responses from the server
        if (error.response.status === 401) {
          if (error.response.data.message === 'Wrong username') {
            setErrorMessage('Username is incorrect');
          } else if (error.response.data.message === 'Wrong password') {
            setErrorMessage('Password is incorrect');
          } else {
            setErrorMessage('Wrong credentials. Please try again.');
          }
        } else {
          setErrorMessage('Login failed. Please try again.');
        }
      } else {
        setErrorMessage('Login failed. Please check your network connection.');
      }
    }
  };

  const handleRegisterNavigation = () => {
    // Navigate to the Register page on button click
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
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
