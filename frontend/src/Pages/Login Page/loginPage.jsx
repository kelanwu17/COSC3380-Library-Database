import React, { useState } from 'react';
import './loginPage.css'; // Import the CSS file
import axios from 'axios';
import {useNavigate, Link, Navigate} from "react-router-dom"
import { useEffect } from 'react';
function LoginPage() {
  // State variables for username, password, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [loginType, setLoginType] = useState('member'); // State to manage login type
  const navigate = useNavigate();
  const [isUserLoggedin, setIsUserLoggedIn] = useState(false)
  const userId = sessionStorage.getItem('username'); 
  if(isUserLoggedin)
  {
    navigate('/')
  }
  useEffect(() => {

    if (userId) {
      setIsUserLoggedIn(true)
    } 
}, []);
  // Function to handle member login
  const memberLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setErrorMessage(""); // Clear previous error
    
    // Validate inputs
    if (!username && !password) {
      setErrorMessage("Username and Password are required.");
      return;
    }
    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    // Make API call for login
    try {
      const response = await axios.post('https://library-database-backend.onrender.com/auth/login/member', {
        username, 
        password,
      });
      const userData = response.data;
      console.log(response.data); 
      const user = userData[0];
      sessionStorage.setItem('username', user.username); 
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('firstName', user.firstName); 
    sessionStorage.setItem('lastName', user.lastName);
    sessionStorage.setItem('phone', user.phone); 
    sessionStorage.setItem('preferences', user.preference); 
    navigate('/'); 
    
      
    } catch (error) {
     
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); 
      } else {
        setErrorMessage("An unexpected error occurred."); 
      }
    }
  };

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
          <form onSubmit={memberLogin}> {/* Bind the form submission to the memberLogin function */}
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              value={username} // Controlled component
              onChange={(e) => setUsername(e.target.value)} // Update username state
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password} // Controlled component
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message if present */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
