import React from 'react';
import './NavBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          Lumina Archives
        </a>
      </div>
      <div className="navbar-center">
        <ul className="nav-links flex-row font-bold">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/Books">Browse & Borrow</a>
          </li>
          <li>
            <a href="/Music">Music</a>
          </li>
          <li>
            <a href="/Technology">Get Connected</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <a className='login-button font-bold' href='/login'>Login</a> {/* Apply the new class */}
      </div>
    </nav>
  );
};

export default Navbar;
