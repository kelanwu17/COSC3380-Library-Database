import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminProfile.css';

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
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/member/');
      setMembersData(response.data);
      setFilteredMembers(response.data);
    } catch (err) {
      console.error('Error fetching users.');
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

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setNewMember((prevState) => ({
      ...prevState,
      preferences: prevState.preferences.includes(value)
        ? prevState.preferences.filter((pref) => pref !== value)
        : [...prevState.preferences, value],
    }));
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
      console.error('Error creating member.');
    }
  };

  return (
    <div className="manage-members">
      <h2>Manage Users</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or Username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchAllMembers}>Get All Users</button>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Preferences</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.memberId}>
                <td>{`${member.firstName} ${member.lastName}`}</td>
                <td>{member.email}</td>
                <td>{member.username}</td>
                <td>{member.phone}</td>
                <td>{new Date(member.DOB).toLocaleDateString()}</td>
                <td>{member.preferences}</td>
                <td>{member.accountStatus === 1 ? "Active" : "Not Active"}</td>
                <td>
                  {/* Modify and Delete buttons would go here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Create Member</h3>
      <div className="form-section">
        <table className="form-table">
          <tbody>
            <tr>
              <td>First Name</td>
              <td><input type="text" value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td><input type="text" value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Username</td>
              <td><input type="text" value={newMember.username} onChange={(e) => setNewMember({ ...newMember, username: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Password</td>
              <td><input type="password" value={newMember.password} onChange={(e) => setNewMember({ ...newMember, password: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Email</td>
              <td><input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Phone</td>
              <td><input type="text" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td><input type="date" value={newMember.DOB} onChange={(e) => setNewMember({ ...newMember, DOB: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Preferences</td>
              <td>
                <div className="preferences">
                  <p>Preferences</p>
                  <div className="checkbox-group">
                    {['Fiction', 'Romance', 'Mystery', 'Action', 'Horror', 'Science', 'Adventure', 'History'].map((pref) => (
                      <label key={pref}>
                        <input 
                          type="checkbox" 
                          value={pref} 
                          onChange={handleCheckboxChange} 
                          checked={newMember.preferences.includes(pref)} 
                        /> {pref}
                      </label>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Account Status</td>
              <td>
                <select value={newMember.accountStatus} onChange={(e) => setNewMember({ ...newMember, accountStatus: e.target.value })}>
                  <option value={1}>Active</option>
                  <option value={0}>Not Active</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleCreateMember}>Add Member</button>
      </div>
    </div>
  );
}

export default ManageMembers;
