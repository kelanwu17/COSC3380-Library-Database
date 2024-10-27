import React, { useState, useEffect } from 'react';
import './loginPage.css'; // Import the CSS file
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginType, setLoginType] = useState('member');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('loggedin');

  // If user is already logged in, navigate to home
  useEffect(() => {
    if (userId) {
      setIsUserLoggedIn(true);
    }
  }, [userId]);

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/');
    }
  }, [isUserLoggedIn, navigate]);

  // Function to handle login
  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    
    // Validate inputs
    if (!username || !password) {
      setErrorMessage('Username and Password are required.');
      return;
    }

    const loginUrl = loginType === 'member' 
      ? 'https://library-database-backend.onrender.com/auth/login/member' 
      : 'https://library-database-backend.onrender.com/auth/login/admin';

    try {
      const response = await axios.post(loginUrl, { username, password });
      const userData = response.data;
      const user = userData[0];

      // Store session data
      sessionStorage.setItem('username', user.username);
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('firstName', user.firstName);
      sessionStorage.setItem('memberId', user.memberId);
      sessionStorage.setItem('lastName', user.lastName);
      sessionStorage.setItem('phone', user.phone);
      
      if (loginType === 'admin') {
        sessionStorage.setItem('roles', user.roles);
      }
      if (loginType === 'member') {
        sessionStorage.setItem('roles', 'member');
        sessionStorage.setItem('preferences', user.preferences);
      }
      sessionStorage.setItem('loggedin', true);
      setIsUserLoggedIn(true);
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage('Invalid username or password. Please try again.');
      }
      else if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  useEffect(() => {
    setErrorMessage('')
  }, [username, password]);
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="image-section">
          <img
            src="/loginpage.png"
            alt="Lumina Archives"
            className="library-image"
          />
          <p className="image-caption">Lumina Archives</p>
        </div>
        <div className="form-section">
          <div className="login-toggle">
            <button
              className={loginType === 'member' ? 'toggle-button active' : 'toggle-button'}
              onClick={() => setLoginType('member')}
            >
              Member Login
            </button>
            <button
              className={loginType === 'admin' ? 'toggle-button active' : 'toggle-button'}
              onClick={() => setLoginType('admin')}
            >
              Admin Login
            </button>
          </div>
          <h2 className="login-title">
            {loginType === 'member' ? 'Member Log In' : 'Admin Log In'}
          </h2>
          {loginType === 'member' && (
            <p className="signup-link">
              Don't have an account?{' '}
              <a href="/signup" className="signup-anchor">
                Create an account
              </a>
            </p>
          )}
          <form >
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button" onClick={handleLogin}>
              Log In
            </button>
            
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
