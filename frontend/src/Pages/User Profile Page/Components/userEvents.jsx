import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserEvents({ userId }) {
  const [events, setEvents] = useState([]);
  const [checkIn, setCheckin] = useState({}); 
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
      const timerId = setInterval(() => {
        const now = new Date();
        console.log('Current Time:', now.toLocaleTimeString());
          
      }, 1000); // Update every second

      return () => clearInterval(timerId); // Cleanup on unmount
      console.log(currentTime)
  }, []);

  async function checkInEvent(eventSignUpId) {
    try {
      const datatosend = {
        checkIn: '1'
      };
      
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/eventSignUp/updateEventSignUp/${eventSignUpId}`,
        datatosend
      );

      setCheckin((prevCheckIn) => ({ ...prevCheckIn, [eventSignUpId]: true }));
      console.log(response);
      alert("You have checked in for this event.");
      
    } catch (error) {
      console.error("Error checking in:", error);
    }
  }

  async function checkOutEvent(eventSignUpId) {
    try {
      const datatosend = {
        checkIn: '0'
      };
      
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/eventSignUp/updateEventSignUp/${eventSignUpId}`,
        datatosend
      );

      setCheckin((prevCheckIn) => ({ ...prevCheckIn, [eventSignUpId]: false }));
      console.log(response);
      alert("You have cancelled checked in for this event.");
      
    } catch (error) {
      console.error("Error checking in:", error);
    }
  }

  useEffect(() => {
    axios.get(`https://library-database-backend.onrender.com/api/eventSignUp/member/${userId}`)
      .then((response) => {
        setEvents(response.data);
        console.log(response.data);
        const initialCheckIn = {};
        response.data.forEach(event => {
          if (event.checkIn === 1) {
            initialCheckIn[event.eventSignUpId] = true; 
          }
        });
        setCheckin(initialCheckIn); 
      })
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
              <th style={{ padding: '5px', color: '#333' }}>Check In</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => {
              
              const eventStartTime = (event.timeDate);
              
              const utcDate = new Date(eventStartTime);
              const timeDiff = currentTime - utcDate;
              // Get the local time zone offset in minutes
              const timezoneOffset = utcDate.getTimezoneOffset() 
              const localTimeAsUtc = new Date(utcDate.getTime() - timezoneOffset * 60000);
              const thirtyMinutes = 30 * 60 * 1000;
              const isEventUnavailable = timeDiff > thirtyMinutes || currentTime < localTimeAsUtc; 
              
              return (
                <tr key={event.eventId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', color: '#555' }}>{event.eventTitle}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{localTimeAsUtc.toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{event.location}</td>
                  <td style={{ padding: '12px', color: '#555' }}>
                    {isEventUnavailable ? (
                      <button className='bg-gray-500 border border-black font-bold text-white' disabled>
                        Unavailable
                      </button>
                    ) : !checkIn[event.eventSignUpId] ? (
                      <button 
                        onClick={() => checkInEvent(event.eventSignUpId)} 
                        className='bg-green-500 border border-black font-bold text-white'
                      >
                        Check in
                      </button>
                    ) : (
                      <button 
                        onClick={() => checkOutEvent(event.eventSignUpId)} 
                        className='bg-red-500 border border-black font-bold text-white'>
                        Cancel Check in
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#666' }}>No events signed up for.</p>
      )}
    </div>
  );
}

export default UserEvents;
