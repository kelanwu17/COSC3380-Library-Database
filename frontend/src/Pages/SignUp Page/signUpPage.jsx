import React from 'react';
import './signUpPage.css'; // Import the CSS file

function SignUpPage() {
  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="image-section">
          <img
            src="/loginpage.png"
            alt="Lumina Archives"
            className="library-image"
          />
          <p className="image-caption">Lumina Archives</p>
        </div>
        <div className="form-section">
          <h2 className="signup-title">Create An Account</h2>
          <p className="login-link">
            Already have an account?{' '}
            <a href="/login" className="login-anchor">
              Log in
            </a>
          </p>
          <form>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="First Name"
                required
              />
              <input
                type="text"
                className="input-field"
                placeholder="Last Name"
                required
              />
            </div>
              
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="Phone Number"
                required
              />
              <input
                type="text"
                className="input-field"
                placeholder="DOB MM/DD/YYYY"
                required
              />
            </div>
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              required
            />
              <input
                type="text"
                className="input-field"
                placeholder="Username"
                required
              />
            <input
                type="password"
                className="input-field"
                placeholder="Password"
                required
              />
            <div className="preferences">
              <p>Preferences</p>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" /> Fiction
                </label>
                <label>
                  <input type="checkbox" /> Romance
                </label>
                <label>
                  <input type="checkbox" /> Mystery
                </label>
                <label>
                  <input type="checkbox" /> Action
                </label>
                <label>
                  <input type="checkbox" /> Horror
                </label>
                <label>
                  <input type="checkbox" /> Science
                </label>
                <label>
                  <input type="checkbox" /> Adventure
                </label>
                <label>
                  <input type="checkbox" /> History
                </label>
              </div>
            </div>
            <div className="terms">
              <label>
                <input type="checkbox" required /> I agree to{' '}
                <a href="/terms" className="terms-anchor">
                  Terms & Conditions
                </a>
              </label>
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
