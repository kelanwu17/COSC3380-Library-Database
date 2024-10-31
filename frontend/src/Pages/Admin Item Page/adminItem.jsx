import React, { useState } from 'react';
import ManageBooks from '../Admin Profile Page/Components/manageBooks';
import ManageTech from '../Admin Profile Page/Components/manageTech';
import ManageMusic from '../Admin Profile Page/Components/manageMusic';

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
    <div style={{ padding: '20px' }}>
      <div style={{ paddingTop: '20px' }}>
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminItem;
