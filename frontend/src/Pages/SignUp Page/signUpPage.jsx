import React, { useState, useEffect } from 'react'; // Combined imports for better readability
import './signUpPage.css'; // Import the CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  // State variables for user inputs
  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [DOB, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [isUserLoggedin, setIsUserLoggedIn] = useState(false);
  
  const userId = sessionStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      setIsUserLoggedIn(true);
      navigate('/'); // Redirect if the user is already logged in
    }
    console.log(DOB)
  }, [userId, navigate]); // Added navigate to dependency array

  const dataToSend = {
    username,
    password,
    firstName,
    lastName,
    email,
    phone,
    DOB,
  };
  console.log("Data being sent to the server:", dataToSend);

  async function submit(e) {
     // Check if required fields are filled out
  if (!username || !password || !firstName || !lastName || !email || !DOB || !phone) {
    alert("Please fill out all required fields.");
    return; // Stop further execution if any field is empty
  }
    e.preventDefault();
    try {
      const response = await axios.post('https://library-database-backend.onrender.com/api/member/createMember', dataToSend);
      console.log(response);
      navigate('/login')
      // Redirect or show success message here
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  const handlePhoneChange = (e) => {
    // Remove non-digit characters
    let value = e.target.value.replace(/[^0-9]/g, '');

    // Limit to 9 characters
    if (value.length > 9) {
        value = value.slice(0, 9);
    }

    setPhone(value); // Set the sanitized value
};

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
            <a href="/login" className="login-anchor">Log in</a>
          </p>
          <form onSubmit={submit}>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="First Name"
                required
                onChange={(e) => setFirst(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Last Name"
                required
                onChange={(e) => setLast(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={handlePhoneChange}
              />
              <input
                type="date"
                className="input-field"
                placeholder="DOB MM/DD/YYYY"
                required
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              required
              onChange={(e) => setUser(e.target.value)}
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="terms">
              <label>
                <input type="checkbox" required /> I agree to{' '}
                <a href="/terms" className="terms-anchor">Terms & Conditions</a>
              </label>
            </div>
            <button type="submit" className="signup-button" onClick={submit}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
