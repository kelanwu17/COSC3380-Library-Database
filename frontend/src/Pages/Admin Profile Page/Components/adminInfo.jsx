import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminInfo({ adminId }) {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/admin/${adminId}`, {
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
  }, [adminId]);

  if (!adminData) {
    return <p>Loading profile...</p>; // Loading state while data is being fetched
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
      <div className="bg-gray-100 rounded-lg shadow-lg p-8 max-w-lg w-full text-gray-800">
        <div className="flex items-center mb-6">
          <img
            src={adminData.profilePicture || 'path-to-placeholder.jpg'}
            alt="Admin Profile"
            className="w-32 h-32 rounded-full shadow-md object-cover mr-6"
          />
          <div className="flex flex-col">
            <h3 className="text-3xl font-semibold">{adminData.firstName} {adminData.lastName}</h3>
            <p className="text-lg text-gray-500">{adminData.role}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-4 space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {adminData.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Phone:</span> {adminData.phone}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Date of Birth:</span> {new Date(adminData.DOB).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminInfo;
