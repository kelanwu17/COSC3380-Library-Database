import React, { useState } from 'react';
import './adminProfile.css'; // Import the CSS file

function AdminProfile() {
  // State to manage which section is active for the admin
  const [activeSection, setActiveSection] = useState('manageUsers'); // Default to "manageUsers"

  // Function to render content based on active admin section
  const renderContent = () => {
    switch (activeSection) {
      case 'manageUsers':
        return <p>Here you can manage users...</p>;
      case 'manageEvents':
        return <p>Here you can manage events...</p>;
      case 'manageBooks':
        return <p>Here you can manage books...</p>;
      case 'manageMusic':
        return <p>Here you can manage music...</p>;
      case 'manageTech':
        return <p>Here you can manage technology...</p>;
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-details">
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li onClick={() => setActiveSection('manageUsers')}>MANAGE USERS</li>
            <li onClick={() => setActiveSection('manageEvents')}>MANAGE EVENTS</li>
            <li onClick={() => setActiveSection('manageBooks')}>MANAGE BOOKS</li>
            <li onClick={() => setActiveSection('manageMusic')}>MANAGE MUSIC</li>
            <li onClick={() => setActiveSection('manageTech')}>MANAGE TECH</li> {/* New Tech Management Option */}
          </ul>

          {/* Notification Inbox in Sidebar */}
          <div className="notification-sidebar">
            <h3 className="notification-title">Notifications</h3>
            <ul className="notification-list">
              <li className="notification-item">
                <p><strong>New User Registered:</strong> John Doe registered as a member.</p>
                <span>Oct 21, 2024</span>
              </li>
              <li className="notification-item">
                <p><strong>Event Created:</strong> Book Club event created for Nov 1, 2024.</p>
                <span>Oct 20, 2024</span>
              </li>
              <li className="notification-item">
                <p><strong>Alert:</strong> System update required by the end of this week.</p>
                <span>Oct 18, 2024</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="profile-content">
          {/* Admin Info Rectangle with Profile Picture and Information */}
          <div className="member-info-rectangle">
            <img
              src="/adminprofilepic.png"
              alt="Admin Profile"
              className="profile-image"
            />
            <div className="profile-info">
              <h2>ADMIN NAME</h2>
              <p><strong>Admin since:</strong> '20</p>
              <p><strong>Email:</strong> admin@example.com</p>
              <p><strong>Phone Number:</strong> (555) 555-1234</p>
            </div>

            {/* Fines and Holds Positioned Inside Admin Info Rectangle */}
            <div className="profile-footer">
              <div className="fines">
                <p><strong>Total Users:</strong> 1234</p>
              </div>
              <div className="holds">
                <p><strong>Total Events:</strong> 45</p>
              </div>
            </div>
          </div>

          {/* Dynamic content displayed based on sidebar selection */}
          <div className="section-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;