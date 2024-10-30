import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserEvents({ userId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch all events that the user has signed up for
    axios.get(`https://library-database-backend.onrender.com/api/eventSignUp/member/${userId}`)
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching user events:", error));
  }, [userId]);

  return (
    <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>Your Events</h1>
      {events.length > 0 ? (
        <table style={{ width: '100%', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: '#333' }}>Event Name</th>
              <th style={{ padding: '12px', color: '#333' }}>Date</th>
              <th style={{ padding: '12px', color: '#333' }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.eventId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', color: '#555' }}>{event.name}</td>
                <td style={{ padding: '12px', color: '#555' }}>{new Date(event.date).toLocaleDateString()}</td>
                <td style={{ padding: '12px', color: '#555' }}>{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#666' }}>No events signed up for.</p>
      )}
    </div>
  );
}

export default UserEvents;
