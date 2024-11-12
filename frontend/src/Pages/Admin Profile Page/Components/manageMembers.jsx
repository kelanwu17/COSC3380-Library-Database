import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageMembers() {
  const [membersData, setMembersData] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newMember, setNewMember] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    DOB: '',
    preferences: [],
    accountStatus: 1,
    role: '',
  });
  const [editMemberId, setEditMemberId] = useState(null);
  const [editableData, setEditableData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    DOB: '',
    role: '',
  });

  // Retrieve logged-in admin ID
  const currentAdminId = localStorage.getItem('adminId'); // Ensure this has the correct admin ID

  // Define logEmployeeAction at the top level of ManageMembers
  const logEmployeeAction = async (adminId, description) => {
    try {
      const adjustedTimestamp = new Date();
      adjustedTimestamp.setHours(adjustedTimestamp.getHours() + 6);
      
      await axios.post('https://library-database-backend.onrender.com/api/employeeLog', {
        adminId,
        description,
        timeStamp: new Date().toISOString(),
      });
      console.log('Action logged:', description);
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/member/');
      setMembersData(response.data);
      setFilteredMembers(response.data);
    } catch (err) {
      console.error('Error fetching users.', err);
    }
  };

  const handleSearch = () => {
    const filtered = membersData.filter((member) => {
      const firstName = member.firstName ? member.firstName.toLowerCase() : '';
      const lastName = member.lastName ? member.lastName.toLowerCase() : '';
      const username = member.username ? member.username.toLowerCase() : '';
      const searchLower = searchText.toLowerCase();

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        username.includes(searchLower)
      );
    });
    setFilteredMembers(filtered);
  };

  const handleCreateMember = async () => {
    try {
      const response = await axios.post(
        'https://library-database-backend.onrender.com/api/member/createMember',
        { ...newMember, preferences: newMember.preferences.join(',') }
      );
      alert(response.data.message);
      fetchAllMembers();
      logEmployeeAction(currentAdminId, `Created Member: ${newMember.username}`);
      setNewMember({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        DOB: '',
        preferences: [],
        accountStatus: 1,
        role: '',
      });
      alert(`${response.data.message || 'Member created successfully!'}`);
    } catch (err) {
      console.error('Error creating member.', err);
    }
  };

  const handleEditMember = (member) => {
    setEditMemberId(member.memberId);
    setEditableData({ ...member });
  };

  const handleUpdateMember = async () => {
    try {
      let updatedData = { ...editableData };
      if (updatedData.DOB) {
        updatedData.DOB = updatedData.DOB.replace('T', ' ').replace('Z', '');
      }

      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/member/updateMember/${editMemberId}`,
        updatedData
      );
      alert(`${response.data.message || 'Member updated successfully!'}`);
      logEmployeeAction(currentAdminId, `Updated Member: ${editableData.username}`);
      setEditMemberId(null);
      fetchAllMembers();
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };

  const handleDeactivateMember = async (memberId) => {
    try {
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/member/deactivateMember/${memberId}`
      );
      alert(response.data.message || 'Member deactivated successfully!');
      fetchAllMembers();
      logEmployeeAction(currentAdminId, `Deactivated Member with ID: ${memberId}`);
    } catch (err) {
      console.error('Error deactivating member.', err);
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setNewMember((prevState) => ({
      ...prevState,
      preferences: prevState.preferences.includes(value)
        ? prevState.preferences.filter((pref) => pref !== value)
        : [...prevState.preferences, value],
    }));
  };


  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Manage Members</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by Name or Username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 15px', marginRight: '5px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
        <button onClick={fetchAllMembers} style={{ padding: '8px 15px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Get All Users</button>
      </div>

      <div style={{
        overflowX: 'auto',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
        backgroundColor: '#fff',
        maxHeight: '500px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr>
              {['Name', 'Email', 'Username', 'Phone', 'DOB', 'Status', 'Role', 'Actions'].map((header, idx) => (
                <th key={idx} style={{
                  padding: '10px',
                  backgroundColor: '#455a7a',
                  color: 'white',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  width: header === 'Email' || header === 'Username' ? '150px' : 'auto' // Limit width for Email and Username
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.memberId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{`${member.firstName} ${member.lastName}`}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{member.email}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{member.username}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.phone}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{new Date(member.DOB).toLocaleDateString()}</td>
                <td style={{ padding: '10px', color: member.accountStatus === 1 ? 'green' : 'red', whiteSpace: 'nowrap' }}>
                  {member.accountStatus === 1 ? 'Active' : 'Inactive'}
                </td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.role || 'N/A'}
                </td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <button onClick={() => handleEditMember(member)} style={{ marginRight: '5px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeactivateMember(member.memberId)} style={{ backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
        {/* Create Member Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Create Member</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {['firstName', 'lastName', 'username', 'password', 'email', 'phone', 'DOB', 'role'].map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type={field === 'phone' ? 'tel' : field === 'password' ? 'password' : field === 'DOB' ? 'date' : 'text'}
                      value={newMember[field]}
                      onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                      maxLength={field === 'phone' ? 12 : undefined} // Adjust max length for format with hyphens
                      pattern={field === 'phone' ? '^(\\d{3}-\\d{3}-\\d{4}|\\d{10})$' : undefined} // Pattern to allow 1234567890 or 123-456-7890
                      placeholder={field === 'phone' ? '123-456-7890' : ''}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleCreateMember} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Add Member</button>
        </div>

        {/* Modify Member Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Edit Member</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {['firstName', 'lastName', 'email', 'phone', 'DOB'].map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type={field === 'phone' ? 'tel' : field === 'DOB' ? 'date' : 'text'}
                      value={editableData[field] || ''}
                      onChange={(e) => setEditableData({ ...editableData, [field]: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                      maxLength={field === 'phone' ? 12 : undefined} // Adjust max length for format with hyphens
                      pattern={field === 'phone' ? '^(\\d{3}-\\d{3}-\\d{4}|\\d{10})$' : undefined} // Pattern to allow 1234567890 or 123-456-7890
                      placeholder={field === 'phone' ? '123-456-7890' : ''}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpdateMember} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Update Member</button>
        </div>
      </div>
    </div>
  );
}

export default ManageMembers;
