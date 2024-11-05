import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageAdmin() {
  const [adminsData, setAdminsData] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchAdminText, setSearchAdminText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    DOB: '',
    roles: '',
    active: 1,
  });
  const [editAdminId, setEditAdminId] = useState(null);
  const [editableAdminData, setEditableAdminData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    DOB: '',
    roles: '',
    active: 1,
  });

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const fetchAllAdmins = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/admin/');
      const formattedAdmins = response.data.map(admin => ({
        ...admin,
        DOB: admin.DOB ? new Date(admin.DOB).toISOString().split('T')[0] : '', // Ensure YYYY-MM-DD format
      }));
      setAdminsData(formattedAdmins);
      setFilteredAdmins(formattedAdmins);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };
  
  const handleSearchAdmin = () => {
    const filtered = adminsData.filter(
      (admin) =>
        admin.firstName.toLowerCase().includes(searchAdminText.toLowerCase()) ||
        admin.lastName.toLowerCase().includes(searchAdminText.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchAdminText.toLowerCase())
    );
    setFilteredAdmins(filtered);
  };
  
  const formatDateForServer = (date) => {
    return date ? new Date(date).toISOString().split('T')[0] : null; // Outputs "YYYY-MM-DD" or null
  };  
  
  const handleCreateAdmin = async () => {
    // Validate email format using regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newAdmin.email)) {
      window.alert('Invalid email format');
      return;
    }   

    // Format DOB to YYYY-MM-DD if it exists
    const formattedDOB = newAdmin.DOB ? formatDateForServer(newAdmin.DOB) : null;
    const dataToSend = { ...newAdmin, DOB: formattedDOB };
    console.log('Data being sent to server:', dataToSend); // Add this for debugging

    try {
      const response = await axios.post(
        'https://library-database-backend.onrender.com/api/admin/createAdmin',
        dataToSend,
        { headers: { 'Content-Type': 'application/json' } }
      );      
      console.log('Create Admin Response:', response);
  
      if (response.status === 200 && response.data.success) {
        window.alert('Admin successfully created!');
        fetchAllAdmins(); // Refresh the admin list
        // Reset the form fields
        setNewAdmin({
          username: '',
          password: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          DOB: '',
          roles: '',
          active: 1,
        });
      } else {
        window.alert(response.data.message || 'Unexpected response format.');
      }
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? `Error: ${err.response.data.message}`
        : 'Error creating admin. Please try again.';
      window.alert(errorMessage);
      console.error('Error creating admin:', err);
    }
  };


  

  const handleEditAdmin = (admin) => {
    setEditAdminId(admin.adminId);
    setEditableAdminData({
      ...admin,
      DOB: admin.DOB ? admin.DOB.split('T')[0] : '', // Ensure YYYY-MM-DD format
    });
  };
  
  const handleUpdateAdmin = async () => {
    const formattedDOB = formatDateForServer(editableAdminData.DOB);
    const dataToSend = { ...editableAdminData, DOB: formattedDOB };
  
    try {
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/admin/updateAdmin/${editAdminId}`,
        dataToSend
      );
  
      if (response.status === 200) {
        window.alert(response.data.message || 'Admin updated successfully!');
        setEditAdminId(null);
        fetchAllAdmins(); // Refresh the admin list
        setEditableAdminData({
          username: '',
          password: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          DOB: '',
          roles: '',
          active: 1,
        });
      } else {
        window.alert(response.data.message || 'Failed to update admin.');
      }
    } catch (error) {
      window.alert('Failed to update admin.');
      console.error('Error:', error);
    }
  };
  

  const handleDeactivateAdmin = async (adminId) => {
    try {
      const response = await axios.put(`https://library-database-backend.onrender.com/api/Admin/deactivateAdmin/${adminId}`);
      window.alert(response.data.message || 'Admin deactivated successfully!');
      fetchAllAdmins(); // Refresh the list to reflect the deactivation
    } catch (err) {
      console.error('Error deactivating admin:', err);
      window.alert('Failed to deactivate admin. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Manage Admins</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by Name or Username"
          value={searchAdminText}
          onChange={(e) => setSearchAdminText(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSearchAdmin} style={{ padding: '8px 15px', marginRight: '5px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
        <button onClick={fetchAllAdmins} style={{ padding: '8px 15px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Get All Admins</button>
      </div>

      {statusMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{statusMessage}</p>}

      <div style={{
        overflowX: 'auto', // Enables horizontal scrolling if the table is too wide
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
        backgroundColor: '#fff',
        maxWidth: '100%', // Ensure table stays within the container
        maxHeight: '500px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr>
              {['Name', 'Email', 'Username', 'Phone', 'DOB', 'Roles', 'Status', 'Actions'].map((header, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '8px',
                    backgroundColor: '#455a7a',
                    color: 'white',
                    borderBottom: '1px solid #ddd',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: header === 'Email' || header === 'Username' ? '150px' : 'auto', // Limit width for Email and Username
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.adminId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{`${admin.firstName} ${admin.lastName}`}</td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{admin.email}</td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{admin.username}</td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin.phone}</td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{admin.DOB}</td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin.roles}</td>
                <td style={{ padding: '8px', color: admin.active === 1 ? 'green' : 'red', whiteSpace: 'nowrap' }}>
                  {admin.active === 1 ? 'Active' : 'Inactive'}
                </td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEditAdmin(admin)}
                    style={{
                      marginRight: '5px',
                      backgroundColor: '#455a7a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeactivateAdmin(admin.adminId)}
                    style={{
                      backgroundColor: '#455a7a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
        {/* Create Admin Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Create Admin</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {Object.keys(newAdmin).map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type={field === 'password' ? 'password' : field === 'DOB' ? 'date' : 'text'}
                      value={newAdmin[field]}
                      onChange={(e) => setNewAdmin({ ...newAdmin, [field]: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleCreateAdmin} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Add Admin</button>
        </div>

        {/* Edit Admin Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Edit Admin</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {Object.keys(editableAdminData).map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type={field === 'password' ? 'password' : field === 'DOB' ? 'date' : 'text'}
                      value={editableAdminData[field] || ''}
                      onChange={(e) => setEditableAdminData({ ...editableAdminData, [field]: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpdateAdmin} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Update Admin</button>
        </div>
      </div>
    </div>
  );
}

export default ManageAdmin;
