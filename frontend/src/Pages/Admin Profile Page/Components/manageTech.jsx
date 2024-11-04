import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageTech() {
  const [techData, setTechData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [newTech, setNewTech] = useState({
    deviceName: '',
    modelNumber: '',
    count: 0,
    availabilityStatus: 1,
    monetaryValue: 0,
    lastUpdatedBy: 2,
    imgUrl: '',
  });
  const [editTechId, setEditTechId] = useState(null);
  const [editableTech, setEditableTech] = useState({
    deviceName: '',
    modelNumber: '',
    count: 0,
    availabilityStatus: 1,
    monetaryValue: 0,
    imgUrl: '',
  });

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
    } catch (error) {
      setStatusMessage(`Error creating technology: ${error.message}`);
    }
  };

  const handleEditTech = (tech) => {
    setEditTechId(tech.techId);
    setEditableTech({ ...tech });
  };

  const handleUpdateTech = async () => {
    try {
      console.log("Data being sent to server:", editableTech);
  
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/technology/updateTechnology/${editTechId}`,
        editableTech
      );
  
      console.log("Response from server:", response); // Log the response
  
      // Use status 200 as success confirmation
      if (response.status === 200) {
        setStatusMessage("Technology updated successfully!");
      } else {
        setStatusMessage(response.data.message);
      }
      
      fetchAllTech(); // Refresh the tech list
      setEditTechId(null);
      setEditableTech({
        deviceName: '',
        modelNumber: '',
        count: 0,
        availabilityStatus: 1,
        monetaryValue: 0,
        imgUrl: '',
      });
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message 
                           ? error.response.data.message 
                           : "Unknown error";
      setStatusMessage(`Failed to update technology: ${errorMessage}`);
      console.error("Error updating technology:", error);
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
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Manage Technology</h2>
      {statusMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{statusMessage}</p>}

      <div style={{
  overflowX: 'auto',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  marginBottom: '20px',
  backgroundColor: '#fff',
  maxHeight: '500px',
}}>
  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'auto', // Use 'auto' for dynamic column width
    textAlign: 'center' // Center-align all text for a cleaner look
  }}>
    <thead>
      <tr>
        {['Device Name', 'Model Number', 'Count', 'Availability Status', 'Monetary Value', 'Image', 'Actions'].map((header, idx) => (
          <th key={idx} style={{
            padding: '12px 15px', // More padding for better spacing
            backgroundColor: '#455a7a', // Darker header background
            color: 'white',
            fontWeight: 'bold',
            borderBottom: '2px solid #ddd',
            position: 'sticky',
            top: 0,
            zIndex: 2,
            textAlign: 'center'
          }}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {techData.map((tech) => (
        <tr key={tech.techId} style={{ borderBottom: '1px solid #ddd', height: '60px' }}>
          <td style={{ padding: '10px' }}>{tech.deviceName}</td>
          <td style={{ padding: '10px' }}>{tech.modelNumber}</td>
          <td style={{ padding: '10px' }}>{tech.count}</td>
          <td style={{ padding: '10px' }}>{tech.availabilityStatus === 1 ? "Available" : "Not Available"}</td>
          <td style={{ padding: '10px' }}>${parseFloat(tech.monetaryValue).toFixed(2)}</td>
          <td style={{ padding: '10px' }}>
            <img src={tech.imgUrl} alt={tech.deviceName} style={{ width: '80px', height: 'auto', borderRadius: '5px' }} />
          </td>
          <td style={{ padding: '10px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
            <button style={{
              backgroundColor: '#455a7a',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 15px',
              cursor: 'pointer'
            }} onClick={() => handleEditTech(tech)}>Edit</button>
            <button style={{
              backgroundColor: '#455a7a', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 15px',
              cursor: 'pointer'
            }} onClick={() => handleDeleteTech(tech.techId)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
        {/* Create Technology Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Create Technology</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {[
                { label: 'Device Name', value: newTech.deviceName, type: 'text', onChange: e => setNewTech({ ...newTech, deviceName: e.target.value }) },
                { label: 'Model Number', value: newTech.modelNumber, type: 'text', onChange: e => setNewTech({ ...newTech, modelNumber: e.target.value }) },
                { label: 'Count', value: newTech.count, type: 'number', onChange: e => setNewTech({ ...newTech, count: parseInt(e.target.value) }) },
                { label: 'Monetary Value', value: newTech.monetaryValue, type: 'number', onChange: e => setNewTech({ ...newTech, monetaryValue: parseInt(e.target.value) }) },
                { label: 'Image URL', value: newTech.imgUrl, type: 'text', onChange: e => setNewTech({ ...newTech, imgUrl: e.target.value }) }
              ].map((field, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.label}</td>
                  <td><input type={field.type} value={field.value} onChange={field.onChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }} /></td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '8px', color: 'white' }}>Status</td>
                <td>
                  <select value={newTech.availabilityStatus} onChange={(e) => setNewTech({ ...newTech, availabilityStatus: parseInt(e.target.value, 10) })} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}>
                    <option value={1}>Available</option>
                    <option value={0}>Not Available</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleCreateTech} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Add Technology</button>
        </div>

        {/* Edit Technology Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Edit Technology</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {[
                { label: 'Device Name', value: editableTech.deviceName || '', type: 'text', onChange: e => setEditableTech({ ...editableTech, deviceName: e.target.value }) },
                { label: 'Model Number', value: editableTech.modelNumber || '', type: 'text', onChange: e => setEditableTech({ ...editableTech, modelNumber: e.target.value }) },
                { label: 'Count', value: editableTech.count || 0, type: 'number', onChange: e => setEditableTech({ ...editableTech, count: parseInt(e.target.value) }) },
                { label: 'Monetary Value', value: editableTech.monetaryValue || 0, type: 'number', onChange: e => setEditableTech({ ...editableTech, monetaryValue: parseInt(e.target.value) }) },
                { label: 'Image URL', value: editableTech.imgUrl || '', type: 'text', onChange: e => setEditableTech({ ...editableTech, imgUrl: e.target.value }) }
              ].map((field, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.label}</td>
                  <td><input type={field.type} value={field.value} onChange={field.onChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }} /></td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '8px', color: 'white' }}>Status</td>
                <td>
                  <select value={editableTech.availabilityStatus || 0} onChange={(e) => setEditableTech({ ...editableTech, availabilityStatus: parseInt(e.target.value, 10) })} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}>
                    <option value={1}>Available</option>
                    <option value={0}>Not Available</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleUpdateTech} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Update Technology</button>
        </div>
      </div>
    </div>
  );
}

export default ManageTech;
