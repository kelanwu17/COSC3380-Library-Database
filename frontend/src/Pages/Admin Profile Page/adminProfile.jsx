import React, { useState } from 'react';
import './adminProfile.css';
import Navbar from '../../Components/NavBar';
import ManageMembers from './Components/manageMembers';
import ManageBooks from './Components/manageBooks';
import ManageEvents from './Components/manageEvents';
import ManageMusic from './Components/manageMusic';
import ManageTech from './Components/manageTech';

function AdminProfile() {
  const [activeSection, setActiveSection] = useState('');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'manageMembers':
        return <ManageMembers />;
      case 'manageBooks':
        return <ManageBooks />;
      case 'manageEvents':
        return <ManageEvents />;
      case 'manageMusic':
        return <ManageMusic />;
      case 'manageTech':
        return <ManageTech />;
      default:
        return (
          <div className="member-info-rectangle">
            <h2>ADMIN PROFILE</h2>
            {/* Profile details */}
          </div>
        );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li onClick={() => setActiveSection('')}>Back to Profile</li>
            <li onClick={() => setActiveSection('manageMembers')}>Manage Members</li>
            <li onClick={() => setActiveSection('manageBooks')}>Manage Books</li>
            <li onClick={() => setActiveSection('manageEvents')}>Manage Events</li>
            <li onClick={() => setActiveSection('manageMusic')}>Manage Music</li>
            <li onClick={() => setActiveSection('manageTech')}>Manage Technology</li>
          </ul>
        </div>
        <div className="profile-content">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
