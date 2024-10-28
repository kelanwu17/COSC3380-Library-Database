import React, { useState } from 'react';
import './adminProfile.css';
import Navbar from '../../Components/NavBar';
import ManageMembers from './Components/manageMembers';
import ManageBooks from '../Admin Item Page/adminItem';
import AdminEvent from '../Admin Event Page/adminEvent';
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
        return <AdminEvent />;
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

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'manageMembers':
        return "Admin - Manage Members";
      case 'manageBooks':
        return "Admin - Manage Books";
      case 'manageEvents':
        return "Admin - Manage Events";
      case 'manageMusic':
        return "Admin - Manage Music";
      case 'manageTech':
        return "Admin - Manage Technology";
      default:
        return "Admin Profile";
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li
              onClick={() => setActiveSection('')}
              className={activeSection === '' ? 'active' : ''}
            >
              Back to Profile
            </li>
            <li
              onClick={() => setActiveSection('manageMembers')}
              className={activeSection === 'manageMembers' ? 'active' : ''}
            >
              Manage Members
            </li>
            <li
              onClick={() => setActiveSection('manageBooks')}
              className={activeSection === 'manageBooks' ? 'active' : ''}
            >
              Manage Books
            </li>
            <li
              onClick={() => setActiveSection('manageEvents')}
              className={activeSection === 'manageEvents' ? 'active' : ''}
            >
              Manage Events
            </li>
            <li
              onClick={() => setActiveSection('manageMusic')}
              className={activeSection === 'manageMusic' ? 'active' : ''}
            >
              Manage Music
            </li>
            <li
              onClick={() => setActiveSection('manageTech')}
              className={activeSection === 'manageTech' ? 'active' : ''}
            >
              Manage Technology
            </li>
          </ul>
        </div>
        <div className="profile-content">
          <h2>{getSectionTitle()}</h2> {/* Display the current section title */}
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
