import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeLog() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [adminNames, setAdminNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [logId, setLogId] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');

  // Action Types and Item Types
  const actionTypes = ['Insert', 'Update', 'Delete'];
  const itemTypes = ['All', 'Book', 'Tech', 'Music', 'Admin', 'Member', 'Event'];

  useEffect(() => {
    const fetchEmployeeLogs = async () => {
      try {
        const logResponse = await axios.get('https://library-database-backend.onrender.com/api/employeeLog/');
        setLogs(logResponse.data);
        setFilteredLogs(logResponse.data);
        await fetchAdminNames();
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch employee logs.');
        setLoading(false);
      }
    };

    const fetchAdminNames = async () => {
      try {
        const adminResponse = await axios.get('https://library-database-backend.onrender.com/api/admin/');
        const names = {};
        adminResponse.data.forEach((admin) => {
          names[admin.adminId] = `${admin.firstName} ${admin.lastName}`;
        });
        setAdminNames(names);
      } catch (error) {
        console.error('Failed to fetch admin names:', error);
      }
    };

    fetchEmployeeLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by item type
    if (selectedItemType && selectedItemType !== 'All') {
      filtered = filtered.filter(log => {
        const description = log.description || '';
        const lowerCaseDescription = description.toLowerCase();

        if (selectedItemType === 'Book') {
          return lowerCaseDescription.includes('book');
        } else if (selectedItemType === 'Tech') {
          return lowerCaseDescription.includes('tech');
        } else if (selectedItemType === 'Music') {
          return lowerCaseDescription.includes('music');
        } else if (selectedItemType === 'Admin') {
          return lowerCaseDescription.includes('admin') || 
                 lowerCaseDescription.includes('created admin') ||
                 lowerCaseDescription.includes('deactivate admin') ||
                 lowerCaseDescription.includes('update admin');
        } else if (selectedItemType === 'Member') {
          return lowerCaseDescription.includes('member') ||
                 lowerCaseDescription.includes('created member') ||
                 lowerCaseDescription.includes('deactivate member') ||
                 lowerCaseDescription.includes('update member');
        } else if (selectedItemType === 'Event') {
          return lowerCaseDescription.includes('event');
        }

        return true;
      });
    }

    // Filter by admin
    if (selectedAdmin) {
      filtered = filtered.filter(log => log.adminId === parseInt(selectedAdmin, 10));
    }

    // Filter by time range
    if (startDate && endDate) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timeStamp);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });
    }

    // Filter by description keyword
    if (searchKeyword) {
      filtered = filtered.filter(log =>
        log.description && log.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by log ID
    if (logId) {
      filtered = filtered.filter(log => log.employeeLogId.toString() === logId);
    }

    // Filter by action type
    if (selectedActionType) {
      filtered = filtered.filter(log => log.description && log.description.startsWith(selectedActionType.toLowerCase()));
    }

    setFilteredLogs(filtered);
    console.log("Filtered logs:", filtered);
  }, [selectedItemType, selectedAdmin, startDate, endDate, searchKeyword, logId, selectedActionType, logs]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h1 className="text-2xl font-bold mb-4 text-black">Employee Log</h1>

      {/* Filter Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Item Type Filter */}
        <div>
          <label>Filter by Item Type:</label>
          <select
            value={selectedItemType}
            onChange={(e) => setSelectedItemType(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {itemTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Admin Filter */}
        <div>
          <label>Filter by Admin:</label>
          <select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">All Admins</option>
            {Object.keys(adminNames).map(adminId => (
              <option key={adminId} value={adminId}>
                {adminNames[adminId]}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range Filter */}
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
          <label style={{ marginLeft: '10px' }}>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        {/* Description Keyword Filter */}
        <div>
          <label>Search Description:</label>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Enter keyword"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        {/* Log ID Filter */}
        <div>
          <label>Filter by Log ID:</label>
          <input
            type="text"
            value={logId}
            onChange={(e) => setLogId(e.target.value)}
            placeholder="Enter Log ID"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        {/* Action Type Filter */}
        <div>
          <label>Filter by Action Type:</label>
          <select
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">All Actions</option>
            {actionTypes.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Log ID</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Admin ID</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Admin Name</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Timestamp</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.employeeLogId}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{log.employeeLogId}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{log.adminId}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {adminNames[log.adminId] || 'Unknown'}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{new Date(log.timeStamp).toLocaleString()}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No logs found for the selected filters.</p>
      )}
    </div>
  );
}

export default EmployeeLog;
