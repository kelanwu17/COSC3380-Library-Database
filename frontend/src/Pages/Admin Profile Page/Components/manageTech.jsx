import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminProfile.css';

function ManageTech() {
  const [techData, setTechData] = useState([]);
  const [newTech, setNewTech] = useState({
    deviceName: '',
    modelNumber: '',
    count: 0,
    availabilityStatus: 1,
    monetaryValue: 0,
    lastUpdatedBy: 1,  // Assuming this would be set dynamically
    imgUrl: '',
  });
  const [editTechId, setEditTechId] = useState(null);
  const [editableTech, setEditableTech] = useState({});

  useEffect(() => {
    fetchAllTech();
  }, []);

  const fetchAllTech = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/technology/');
      setTechData(response.data);
    } catch (error) {
      console.error('Error fetching technology data:', error);
    }
  };

  const handleCreateTech = async () => {
    try {
      const response = await axios.post(
        'https://library-database-backend.onrender.com/api/technology/createTechnology',
        newTech
      );
      alert(response.data.message);
      fetchAllTech();
      setNewTech({
        deviceName: '',
        modelNumber: '',
        count: 0,
        availabilityStatus: 1,
        monetaryValue: 0,
        lastUpdatedBy: 1,
        imgUrl: '',
      });
    } catch (error) {
      console.error('Error creating technology:', error);
    }
  };

  const handleEditTech = (tech) => {
    setEditTechId(tech.techId);
    setEditableTech({ ...tech });
  };

  const handleUpdateTech = async () => {
    try {
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/technology/updateTechnology/${editTechId}`,
        editableTech
      );
      alert(response.data.message);
      setEditTechId(null);
      fetchAllTech();
    } catch (error) {
      console.error('Error updating technology:', error);
    }
  };

  const handleDeleteTech = async (techId) => {
    try {
      const response = await axios.delete(
        `https://library-database-backend.onrender.com/api/technology/deleteTechnology/${techId}`
      );
      alert(response.data.message);
      fetchAllTech();
    } catch (error) {
      console.error('Error deleting technology:', error);
    }
  };

  return (
    <div className="manage-tech">
      <h2>Manage Technology</h2>
      
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Model Number</th>
              <th>Count</th>
              <th>Availability Status</th>
              <th>Monetary Value</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {techData.map((tech) => (
              <tr key={tech.techId}>
                <td>{tech.deviceName}</td>
                <td>{tech.modelNumber}</td>
                <td>{tech.count}</td>
                <td>{tech.availabilityStatus === 1 ? "Available" : "Not Available"}</td>
                <td>${tech.monetaryValue}</td>
                <td><img src={tech.imgUrl} alt={tech.deviceName} style={{ width: '100px' }} /></td>
                <td>
                  <button onClick={() => handleEditTech(tech)}>Edit</button>
                  <button onClick={() => handleDeleteTech(tech.techId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>{editTechId ? "Edit Technology" : "Create Technology"}</h3>
      <div className="form-section">
        <input
          type="text"
          placeholder="Device Name"
          value={editTechId ? editableTech.deviceName : newTech.deviceName}
          onChange={(e) => {
            const value = e.target.value;
            editTechId
              ? setEditableTech((prev) => ({ ...prev, deviceName: value }))
              : setNewTech((prev) => ({ ...prev, deviceName: value }));
          }}
        />
        <input
          type="text"
          placeholder="Model Number"
          value={editTechId ? editableTech.modelNumber : newTech.modelNumber}
          onChange={(e) => {
            const value = e.target.value;
            editTechId
              ? setEditableTech((prev) => ({ ...prev, modelNumber: value }))
              : setNewTech((prev) => ({ ...prev, modelNumber: value }));
          }}
        />
        <input
          type="number"
          placeholder="Count"
          value={editTechId ? editableTech.count : newTech.count}
          onChange={(e) => {
            const value = e.target.value;
            editTechId
              ? setEditableTech((prev) => ({ ...prev, count: value }))
              : setNewTech((prev) => ({ ...prev, count: value }));
          }}
        />
        <input
          type="number"
          placeholder="Monetary Value"
          value={editTechId ? editableTech.monetaryValue : newTech.monetaryValue}
          onChange={(e) => {
            const value = e.target.value;
            editTechId
              ? setEditableTech((prev) => ({ ...prev, monetaryValue: value }))
              : setNewTech((prev) => ({ ...prev, monetaryValue: value }));
          }}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={editTechId ? editableTech.imgUrl : newTech.imgUrl}
          onChange={(e) => {
            const value = e.target.value;
            editTechId
              ? setEditableTech((prev) => ({ ...prev, imgUrl: value }))
              : setNewTech((prev) => ({ ...prev, imgUrl: value }));
          }}
        />
        <select
          value={editTechId ? editableTech.availabilityStatus : newTech.availabilityStatus}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            editTechId
              ? setEditableTech((prev) => ({ ...prev, availabilityStatus: value }))
              : setNewTech((prev) => ({ ...prev, availabilityStatus: value }));
          }}
        >
          <option value={1}>Available</option>
          <option value={0}>Not Available</option>
        </select>
        <button onClick={editTechId ? handleUpdateTech : handleCreateTech}>
          {editTechId ? "Update Technology" : "Add Technology"}
        </button>
      </div>
    </div>
  );
}

export default ManageTech;
