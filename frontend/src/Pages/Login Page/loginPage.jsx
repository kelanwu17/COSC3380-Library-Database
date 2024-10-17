import React, { useState } from 'react';
import './loginPage.css'; // Import the CSS file

function LoginPage() {
  const [loginType, setLoginType] = useState('member'); // State to manage login type

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
              className={
                loginType === 'member' ? 'toggle-button active' : 'toggle-button'
              }
              onClick={() => setLoginType('member')}
            >
              Member Login
            </button>
            <button
              className={
                loginType === 'admin' ? 'toggle-button active' : 'toggle-button'
              }
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
          <form>
            <input
              type="text"
              className="input-field"
              placeholder={
                loginType === 'member' ? 'Username' : 'Admin Username'
              }
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              required
            />
            {loginType === 'admin' && (
              <input
                type="text"
                className="input-field"
                placeholder="Admin Code"
                required
              />
            )}
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
