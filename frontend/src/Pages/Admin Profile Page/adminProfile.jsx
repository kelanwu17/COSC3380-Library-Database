import React, { useState, useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Navbar from '../../Components/NavBar';
import ManageMembers from './Components/manageMembers';
import ManageBooks from '../Admin Item Page/adminItem';
import AdminEvent from '../Admin Event Page/adminEvent';
import ManageMusic from './Components/manageMusic';
import ManageTech from './Components/manageTech';
import ManageAdmin from './Components/manageAdmin';
import AdminInfo from './Components/adminInfo';
import Reports from './Components/Reports';
import EmployeeLog from './Components/employeeLog';
import ManageLibraryCard from './Components/manageLibrarycard';


function AdminProfile() {
  const [activeSection, setActiveSection] = useState('');
  const [adminId, setAdminId] = useState(null);
  const role = sessionStorage.getItem('roles');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const storedAdminId = sessionStorage.getItem('adminId');
    if (storedAdminId) {
      setAdminId(storedAdminId);
      console.log("Stored Admin ID:", storedAdminId);
    } else {
      console.warn("No adminId found in localStorage.");
    }
  }, []);

  const handleClick = () => {
    enqueueSnackbar('You do not have access to this page.', { autoHideDuration: 900 });
  };

  const handleTechCheck = () => {
    if (role === 'technician') {
      setActiveSection('manageAdmin');
    } else {
      handleClick();
    }
  };

  const handleReportCheck = () => {
    if (role === 'technician') {
      setActiveSection('reports');
    } else {
      handleClick();
    }
  };
  const handleEmployeeLoginCheck = () => {
    if (role === 'technician') {
      setActiveSection('employeeLog');
    } else {
      handleClick();
    }
  };


  const renderActiveSection = () => {
    if (!adminId) {
      return <p>...</p>;
    }

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
      case 'manageAdmin':
        return <ManageAdmin />;
      case 'reports':
        return <Reports />;
      case 'employeeLog': // Add case for Employee Log
        return <EmployeeLog />;
      case 'manageLibraryCard': // New case for ManageLibraryCard
        return <ManageLibraryCard />;
      default:
        return <AdminInfo adminId={adminId} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <div style={{
          width: '20%',
          position: 'fixed',
          top: '60px',
          left: 0,
          padding: '20px 0',
          backgroundColor: '#f4f4f4',
          minHeight: '100vh',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li onClick={() => setActiveSection('')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: !activeSection ? '#ddd' : 'transparent', fontWeight: !activeSection ? 'bold' : 'normal' }}>Back to Profile</li>
            <li onClick={() => setActiveSection('manageMembers')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'manageMembers' ? '#ddd' : 'transparent', fontWeight: activeSection === 'manageMembers' ? 'bold' : 'normal' }}>Manage Members</li>
            <li onClick={() => setActiveSection('manageBooks')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'manageBooks' ? '#ddd' : 'transparent', fontWeight: activeSection === 'manageBooks' ? 'bold' : 'normal' }}>Manage Books</li>
            <li onClick={() => setActiveSection('manageEvents')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'manageEvents' ? '#ddd' : 'transparent', fontWeight: activeSection === 'manageEvents' ? 'bold' : 'normal' }}>Manage Events</li>
            <li onClick={() => setActiveSection('manageMusic')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'manageMusic' ? '#ddd' : 'transparent', fontWeight: activeSection === 'manageMusic' ? 'bold' : 'normal' }}>Manage Music</li>
            <li onClick={() => setActiveSection('manageTech')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'manageTech' ? '#ddd' : 'transparent', fontWeight: activeSection === 'manageTech' ? 'bold' : 'normal' }}>Manage Technology</li>
            <li onClick={handleTechCheck} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'manageAdmin' ? '#ddd' : 'transparent', fontWeight: activeSection === 'manageAdmin' ? 'bold' : 'normal' }}>Manage Admins</li>
            <li onClick={handleReportCheck} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'reports' ? '#ddd' : 'transparent', fontWeight: activeSection === 'reports' ? 'bold' : 'normal' }}>Reports</li>
            <li onClick={handleEmployeeLoginCheck} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'employeeLog' ? '#ddd' : 'transparent', fontWeight: activeSection === 'employeeLog' ? 'bold' : 'normal' }}>Employee Log</li>
            <li onClick={() => setActiveSection('manageLibraryCard')} style={{ padding: '15px 20px', cursor: 'pointer', backgroundColor: activeSection === 'manageLibraryCard' ? '#ddd' : 'transparent', fontWeight: activeSection === 'manageLibraryCard' ? 'bold' : 'normal' }}>Manage Library Cards</li>
          </ul>
        </div>
        <div style={{ flexGrow: 1, marginLeft: '20%', padding: '40px' }}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AdminProfile />
    </SnackbarProvider>
  );
}
