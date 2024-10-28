import React, { useState } from 'react';
import './adminItem.css'; // CSS for styling the admin item page
import ManageBooks from '../Admin Profile Page/Components/manageBooks';
import ManageTech from '../Admin Profile Page/Components/manageTech';
import ManageMusic from './Admin Profile Page/Components/manageMusic';

function AdminItem() {
  const [activeSection, setActiveSection] = useState('books');

  const renderSection = () => {
    switch (activeSection) {
      case 'books':
        return <ManageBooks />;
      case 'tech':
        return <ManageTech />;
      case 'music':
        return <ManageMusic />;
      default:
        return <ManageBooks />;
    }
  };

  return (
    <div className="admin-item">
      <div className="tab-container">
        <button 
          className={activeSection === 'books' ? 'active' : ''}
          onClick={() => setActiveSection('books')}
        >
          Books
        </button>
        <button 
          className={activeSection === 'tech' ? 'active' : ''}
          onClick={() => setActiveSection('tech')}
        >
          Technology
        </button>
        <button 
          className={activeSection === 'music' ? 'active' : ''}
          onClick={() => setActiveSection('music')}
        >
          Music
        </button>
      </div>
      <div className="content-container">
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminItem;
