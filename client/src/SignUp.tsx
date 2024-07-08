// SignUp.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import './SignUp.css';

/**
 * Component for user signup.
 * Allows users to create a new account by providing a username and password.
 */
const SignUp: React.FC = () => {
  // State to manage username and password input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://127.0.0.1:8080';

  /**
   * Handles the sign-up process.
   * Sends a request to the server to create a new user account.
   * Displays alerts for success or error messages.
   */
  const handleSignUp = async () => {
    try {
      // Check if username and password are not empty
      if (!username.trim() || !password.trim()) {
        alert('Username and Password can\'t be empty');
        return;
      }
      // Send a POST request to the server to create a new account
      await axios.post(`${serverUrl}/api/signup`, { username, password });
      // Display success message and redirect to login page
      alert('Signup was successful! Please log in to your account to enter the chatroom.');
      navigate('/login');
    } catch (error) {
      // Handle error, display error message
      if (error instanceof AxiosError) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        }
      }
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="form-group">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default SignUp;
