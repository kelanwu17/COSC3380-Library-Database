import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminInfo.css';

function AdminInfo() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('https://library-database-backend.onrender.com/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is stored and used here
          },
        });
        setAdminData(response.data); // Assuming response data contains the admin profile info
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  if (!adminData) {
    return <p>Loading profile...</p>; // Loading state while data is being fetched
  }

  return (
    <div className="admin-info">
      <div className="profile-picture">
        <img src={adminData.profilePicture || 'path-to-placeholder.jpg'} alt="Admin Profile" />
      </div>
      <div className="profile-details">
        <h3>{adminData.firstName} {adminData.lastName}</h3>
        <p><strong>Email:</strong> {adminData.email}</p>
        <p><strong>Phone:</strong> {adminData.phone}</p>
        <p><strong>Date of Birth:</strong> {new Date(adminData.DOB).toLocaleDateString()}</p>
        <p><strong>Role:</strong> {adminData.role}</p>
      </div>
    </div>
  );
}

export default AdminInfo;
