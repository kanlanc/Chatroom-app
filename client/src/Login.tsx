// Login.tsx
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Login component handles the user login functionality.
 * It allows users to input their username and password, authenticate them via API,
 * and redirect them to the chatroom upon successful login.
 *
 * @param {Function} setToken - Function to set the authentication token upon successful login.
 */
const Login: React.FC<{ setToken: (token: string) => void }> = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://127.0.0.1:8080';

  /**
   * Handles the login process.
   * Sends a request to the server with the provided username and password.
   * If successful, sets the authentication token and redirects to the chatroom.
   * Otherwise, displays an error message.
   */
  const handleLogin = async () => {
    try {
      // Check if username and password are not empty
      if (!username.trim() || !password.trim()) {
        alert('Username and Password can\'t be empty');
        return;
      }
      const response = await axios.post(`${serverUrl}/api/login`, { username, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token); 
      navigate('/chatroom', { state: { username } });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        }
      }
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <div className="form-group">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="signup-btn" onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

export default Login;
