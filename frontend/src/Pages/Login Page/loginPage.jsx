import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loginType, setLoginType] = useState('member'); // Assuming loginType is selected based on user input
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('loggedin');

  useEffect(() => {
    if (userId) {
      setIsUserLoggedIn(true);
    }
  }, [userId]);

  useEffect(() => {
    if (isUserLoggedIn) {
      setTimeout(() => {
        navigate('/');
      }, 100); // Redirect to home after a short delay
    }
  }, [isUserLoggedIn, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
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
      sessionStorage.setItem('lastName', user.lastName);
      sessionStorage.setItem('phone', user.phone);
      
      if (loginType === 'admin') {
        sessionStorage.setItem('roles', user.roles);
        sessionStorage.setItem('adminId', user.adminId);
      }
      if (loginType === 'member') {
        sessionStorage.setItem('roles', 'member');
        sessionStorage.setItem('preferences', user.preferences);
        sessionStorage.setItem('memberId', user.memberId);
        sessionStorage.setItem('faculty', user.role);
      }
      sessionStorage.setItem('loggedin', true);
      setIsUserLoggedIn(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password. Please try again.');
      } else if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [username, password]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 p-4"
      style={{
        backgroundImage: "url('/loginpage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center bg-white bg-opacity-90 shadow-md rounded-lg p-8 space-y-8">
        <div className="flex flex-col items-center">
          <p className="text-gray-700 font-bold text-4xl">Lumina Archives</p>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center">Log In</h2>
        <p className="text-md text-gray-600 text-center mt-2">
          Don't have a member account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Create an account
          </Link>
        </p>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 text-blue-600"
            />
            <label className="text-sm text-gray-600">Show Password</label>
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
            Log In
          </button>
        </form>
        {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
