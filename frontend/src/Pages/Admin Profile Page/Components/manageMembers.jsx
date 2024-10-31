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
  });
  const [editMemberId, setEditMemberId] = useState(null);
  const [editableData, setEditableData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    DOB: '',
  });

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
    const filtered = membersData.filter(
      (member) =>
        member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        member.username.toLowerCase().includes(searchText.toLowerCase())
    );
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
      });
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
      setEditMemberId(null);
      fetchAllMembers();
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const response = await axios.delete(
        `https://library-database-backend.onrender.com/api/member/deleteMember/${memberId}`
      );
      alert(response.data.message);
      fetchAllMembers();
    } catch (err) {
      console.error('Error deleting member.', err);
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
        <table style={{ width: '105%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {['Name', 'Email', 'Username', 'Phone', 'DOB', 'Roles', 'Status', 'Actions'].map((header, idx) => (
                <th key={idx} style={{
                  padding: '10px',
                  backgroundColor: '#455a7a',
                  color: 'white',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'left',
                  width: idx === 7 ? '220px' : 'auto'
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {membersData.map((member) => (
              <tr key={member.memberId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{`${member.firstName} ${member.lastName}`}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.username}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.phone}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{new Date(member.DOB).toLocaleDateString()}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.roles}</td>
                <td style={{ padding: '10px', color: member.accountStatus === 1 ? 'green' : 'red', whiteSpace: 'nowrap' }}>{member.accountStatus === 1 ? 'Active' : 'Inactive'}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  <button onClick={() => handleEditMember(member)} style={{ marginRight: '5px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Modify</button>
                  <button onClick={() => handleDeleteMember(member.memberId)} style={{ backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
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
              {['firstName', 'lastName', 'username', 'password', 'email', 'phone', 'DOB'].map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type={field === 'password' ? 'password' : field === 'DOB' ? 'date' : 'text'}
                      value={newMember[field]}
                      onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
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
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Modify Member</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {['firstName', 'lastName', 'username', 'email', 'phone', 'DOB'].map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type={field === 'DOB' ? 'date' : 'text'}
                      value={editableData[field] || ''}
                      onChange={(e) => setEditableData({ ...editableData, [field]: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
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
