import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ContinuousColorLegend } from '@mui/x-charts';

function AdminInfo({ adminId }) {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    if (!adminId) {
      console.warn("Admin ID is not available.");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/admin/${adminId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("Admin Data:", response.data);
        setAdminData(response.data[0]);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
  
    fetchAdminData();
    console.log(adminData)
    
  }, [adminId]);
  
  if (!adminId) {
    return <p>Admin ID is not available.</p>;
  }

  if (!adminData) {
    return <p>Loading admin data...</p>;
  }

  const formattedMemberSince = adminData.memberSince 
  ? new Date(adminData.memberSince).getFullYear()
  : new Date().getFullYear();
  
  console.log("Fetched Admin Data:", adminData);



  return (
    <div
      className="admin-info-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: '800px',
        margin: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', textAlign: 'left', width: '100%', }}>
        <img
          src="/profilepic.png"
          alt="Profile"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            marginRight: '30px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
        <div>
          <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
            {adminData.firstName} {adminData.lastName}
          </h3>
          <p style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>Admin ID: {adminData.adminId}</p>
          <p style={{ margin: '5px 0', fontSize: '1.2rem', color: '#333' }}>Admin since: {formattedMemberSince}</p>
          <p style={{ margin: '5px 0', fontSize: '1.2rem', color: '#333' }}>Username: {adminData.username}</p>
        </div>
      </div>

      <div style={{ width: '100%', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
        <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>
          <strong>Email:</strong> {adminData.email}
        </p>
        <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>
          <strong>Phone Number:</strong> {adminData.phone}
        </p>
        <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>
          <strong>DOB:</strong> {new Date(adminData.DOB).toLocaleDateString()}
        </p>
        <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>
          <strong>Role:</strong> {adminData.roles}
        </p>
        <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>
          <strong>Active:</strong> {adminData.active ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
}

export default AdminInfo;
