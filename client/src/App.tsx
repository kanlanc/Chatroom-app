// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import ChatRoom from './ChatRoom';
import './App.css';

/**
 * Main application component.
 * 
 * Renders different routes based on the URL.
 * Manages user authentication token.
 */
const App: React.FC = () => {
  // State to manage user authentication token
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Chatroom App</h1>
        </header>
        <main>
          <Routes>
            {/* Redirect to signup page if the URL is the root */}
            <Route path="/" element={<Navigate to="/signup" />} />
            {/* Route for signing up */}
            <Route path="/signup" element={<SignUp />} />
            {/* Route for logging in */}
            <Route
              path="/login"
              element={<Login setToken={setToken} />}
            />
            {/* Route for chatroom, redirects to login if not authenticated */}
            {token ? (
              <Route path="/chatroom" element={<ChatRoom />} />
            ) : (
              <Route path="/chatroom" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
