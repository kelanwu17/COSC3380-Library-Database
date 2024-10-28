import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminProfile.css';

function ManageTech() {
   
  const [techData, setTechData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [newTech, setNewTech] = useState({
    deviceName: '',
    modelNumber: '',
    count: 0,
    availabilityStatus: 1,
    monetaryValue: 0,
    lastUpdatedBy: 2,  // Assuming this would be set dynamically
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
      setStatusMessage(`Error fetching technology data: ${error.message}`);
    }
  };

  const handleCreateTech = async () => {
    console.log("Attempting to create technology with data:", newTech); // Log request data
    try {
      const response = await axios.post(
        'https://library-database-backend.onrender.com/api/technology/createTechnology',
        newTech
      );
      setStatusMessage(response.data.success ? 'Technology created successfully!' : `Failed to create technology: ${response.data.message || 'Unknown error'}`);
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
    
      //console.log(newTech)

    } catch (error) {
        console.error(error)
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          setStatusMessage(`Error creating technology: ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
          setStatusMessage('No response from server. Check your network.');
        } else {
          console.error("Error", error.message);
          setStatusMessage(`Error: ${error.message}`);
        }
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
      setStatusMessage(response.data.success ? 'Technology updated successfully!' : `Failed to update technology: ${response.data.message || 'Unknown error'}`);
      setEditTechId(null);
      fetchAllTech();
    } catch (error) {
      setStatusMessage(`Error updating technology: ${error.message}`);
    }
  };

  const handleDeleteTech = async (techId) => {
    try {
      const response = await axios.delete(
        `https://library-database-backend.onrender.com/api/technology/deleteTechnology/${techId}`
      );
      setStatusMessage(response.data.success ? 'Technology deleted successfully!' : `Failed to delete technology: ${response.data.message || 'Unknown error'}`);
      fetchAllTech();
    } catch (error) {
      setStatusMessage(`Error deleting technology: ${error.message}`);
    }
  };

  return (
    <div className="manage-tech">
      <h2>Manage Technology</h2>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

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

      <div className="form-section-wrapper">
        {/* Create Technology Form */}
        <div className="form-section">
          <h3>Create Technology</h3>
          <table className="form-table">
            <tbody>
              <tr><td>Device Name</td><td><input type="text" value={newTech.deviceName} onChange={(e) => setNewTech({ ...newTech, deviceName: e.target.value })} /></td></tr>
              <tr><td>Model Number</td><td><input type="text" value={newTech.modelNumber} onChange={(e) => setNewTech({ ...newTech, modelNumber: e.target.value })} /></td></tr>
              <tr><td>Count</td><td><input type="number" value={newTech.count} onChange={(e) => setNewTech({ ...newTech, count: parseInt(e.target.value)
               })} /></td></tr>
              <tr><td>Monetary Value</td><td><input type="number" value={newTech.monetaryValue} onChange={(e) => setNewTech({ ...newTech, monetaryValue: parseInt(e.target.value) })} /></td></tr>
              <tr><td>Image URL</td><td><input type="text" value={newTech.imgUrl} onChange={(e) => setNewTech({ ...newTech, imgUrl: e.target.value })} /></td></tr>
              <tr><td>Status</td><td>
                <select value={newTech.availabilityStatus} onChange={(e) => setNewTech({ ...newTech, availabilityStatus: parseInt(e.target.value, 10) })}>
                  <option value={1}>Available</option>
                  <option value={0}>Not Available</option>
                </select>
              </td></tr>
            </tbody>
          </table>
          <button onClick={handleCreateTech}>Add Technology</button>
        </div>

        {/* Edit Technology Form */}
        {editTechId && (
          <div className="form-section">
            <h3>Edit Technology</h3>
            <table className="form-table">
              <tbody>
                <tr><td>Device Name</td><td><input type="text" value={editableTech.deviceName || ''} onChange={(e) => setEditableTech({ ...editableTech, deviceName: e.target.value })} /></td></tr>
                <tr><td>Model Number</td><td><input type="text" value={editableTech.modelNumber || ''} onChange={(e) => setEditableTech({ ...editableTech, modelNumber: e.target.value })} /></td></tr>
                <tr><td>Count</td><td><input type="number" value={editableTech.count || ''} onChange={(e) => setEditableTech({ ...editableTech, count: e.target.value })} /></td></tr>
                <tr><td>Monetary Value</td><td><input type="number" value={editableTech.monetaryValue || ''} onChange={(e) => setEditableTech({ ...editableTech, monetaryValue: e.target.value })} /></td></tr>
                <tr><td>Image URL</td><td><input type="text" value={editableTech.imgUrl || ''} onChange={(e) => setEditableTech({ ...editableTech, imgUrl: e.target.value })} /></td></tr>
                <tr><td>Status</td><td>
                  <select value={editableTech.availabilityStatus || 0} onChange={(e) => setEditableTech({ ...editableTech, availabilityStatus: parseInt(e.target.value, 10) })}>
                    <option value={1}>Available</option>
                    <option value={0}>Not Available</option>
                  </select>
                </td></tr>
              </tbody>
            </table>
            <button onClick={handleUpdateTech}>Update Technology</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTech;
