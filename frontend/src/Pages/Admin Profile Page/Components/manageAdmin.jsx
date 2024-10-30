import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminProfile.css';

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
  const [editableAdminData, setEditableAdminData] = useState({});

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const fetchAllAdmins = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/admin/');
      setAdminsData(response.data);
      setFilteredAdmins(response.data);
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

  const handleCreateAdmin = async () => {
    try {
      const response = await axios.post(
        'https://library-database-backend.onrender.com/api/admin/createAdmin',
        newAdmin
      );
      setStatusMessage(response.data.success ? 'Admin successfully created!' : 'Failed to create admin.');
      fetchAllAdmins();
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
    } catch (err) {
      setStatusMessage('Error creating admin. Please try again.');
      console.error('Error creating admin:', err);
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleEditAdmin = (admin) => {
    setEditAdminId(admin.adminId);
    setEditableAdminData({ ...admin });
  };

  const handleUpdateAdmin = async () => {
    try {
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/admin/updateAdmin/${editAdminId}`,
        editableAdminData
      );
      alert(response.data.message || 'Admin updated successfully!');
      setEditAdminId(null);
      fetchAllAdmins();
    } catch (error) {
      alert('Failed to update admin.');
      console.error('Error:', error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      await axios.delete(`https://library-database-backend.onrender.com/api/admin/deleteAdmin/${adminId}`);
      alert('Admin successfully deleted');
      fetchAllAdmins();
    } catch (err) {
      console.error('Error deleting admin:', err);
    }
  };

  return (
    <div className="manage-admins">
      <h2>Manage Admins</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or Username"
          value={searchAdminText}
          onChange={(e) => setSearchAdminText(e.target.value)}
        />
        <button onClick={handleSearchAdmin}>Search</button>
        <button onClick={fetchAllAdmins}>Get All Admins</button>
      </div>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.adminId}>
                <td>{`${admin.firstName} ${admin.lastName}`}</td>
                <td>{admin.email}</td>
                <td>{admin.username}</td>
                <td>{admin.phone}</td>
                <td>{new Date(admin.DOB).toLocaleDateString()}</td>
                <td>{admin.roles}</td>
                <td style={{ color: admin.active === 1 ? 'green' : 'red' }}>
                  {admin.active === 1 ? 'Active' : 'Inactive'}
                </td>
                <td>
                  <button onClick={() => handleEditAdmin(admin)}>Modify</button>
                  <button onClick={() => handleDeleteAdmin(admin.adminId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-section-wrapper">
        {/* Create Admin Form */}
        <div className="form-section">
          <h3>Create Admin</h3>
          <table className="form-table">
            <tbody>
              {/* Input fields for new admin */}
              <tr><td>First Name</td><td><input type="text" value={newAdmin.firstName} onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} /></td></tr>
              <tr><td>Last Name</td><td><input type="text" value={newAdmin.lastName} onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} /></td></tr>
              <tr><td>Email</td><td><input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} /></td></tr>
              <tr><td>Username</td><td><input type="text" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} /></td></tr>
              <tr><td>Password</td><td><input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} /></td></tr>
              <tr><td>Phone</td><td><input type="text" value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })} /></td></tr>
              <tr><td>Date of Birth</td><td><input type="date" value={newAdmin.DOB} onChange={(e) => setNewAdmin({ ...newAdmin, DOB: e.target.value })} /></td></tr>
              <tr><td>Roles</td><td><input type="text" value={newAdmin.roles} onChange={(e) => setNewAdmin({ ...newAdmin, roles: e.target.value })} /></td></tr>
              <tr><td>Status</td><td><select value={newAdmin.active} onChange={(e) => setNewAdmin({ ...newAdmin, active: Number(e.target.value) })}><option value={1}>Active</option><option value={0}>Inactive</option></select></td></tr>
            </tbody>
          </table>
          <button onClick={handleCreateAdmin}>Add Admin</button>
        </div>

        {/* Edit Admin Form */}
        {editAdminId && (
          <div className="form-section">
            <h3>Edit Admin</h3>
            <table className="form-table">
              <tbody>
                {/* Input fields for editable admin */}
                <tr><td>First Name</td><td><input type="text" value={editableAdminData.firstName || ''} onChange={(e) => setEditableAdminData({ ...editableAdminData, firstName: e.target.value })} /></td></tr>
                <tr><td>Last Name</td><td><input type="text" value={editableAdminData.lastName || ''} onChange={(e) => setEditableAdminData({ ...editableAdminData, lastName: e.target.value })} /></td></tr>
                <tr><td>Email</td><td><input type="email" value={editableAdminData.email || ''} onChange={(e) => setEditableAdminData({ ...editableAdminData, email: e.target.value })} /></td></tr>
                <tr><td>Username</td><td><input type="text" value={editableAdminData.username || ''} onChange={(e) => setEditableAdminData({ ...editableAdminData, username: e.target.value })} /></td></tr>
                <tr><td>Phone</td><td><input type="text" value={editableAdminData.phone || ''} onChange={(e) => setEditableAdminData({ ...editableAdminData, phone: e.target.value })} /></td></tr>
                <tr><td>Date of Birth</td><td><input type="date" value={editableAdminData.DOB || ''} onChange={(e) => setEditableAdminData({ ...editableAdminData, DOB: e.target.value })} /></td></tr>
                <tr><td>Roles</td><td><input type="text" value={editableAdminData.roles || ''} onChange={(e) => setEditableAdminData({ ...editableAdminData, roles: e.target.value })} /></td></tr>
                <tr><td>Status</td><td><select value={editableAdminData.active || 0} onChange={(e) => setEditableAdminData({ ...editableAdminData, active: Number(e.target.value) })}><option value={1}>Active</option><option value={0}>Inactive</option></select></td></tr>
              </tbody>
            </table>
            <button onClick={handleUpdateAdmin}>Update Admin</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAdmin;
