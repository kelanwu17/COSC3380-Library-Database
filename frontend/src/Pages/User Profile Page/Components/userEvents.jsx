import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserEvents({ userId }) {
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [checkIn, setCheckin] = useState({}); 
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    console.log(currentTime)
      const timerId = setInterval(() => {
        const now = new Date();
        console.log('Current Time:', now.toLocaleTimeString());
          
      }, 1000); // Update every second

      return () => clearInterval(timerId); // Cleanup on unmount
      console.log(currentTime)
  }, []);
// Check events on `events` change
useEffect(() => {
  const now = currentTime.getTime();
  const thirtyMinutes = 30 * 60 * 1000;
  const past = [];
  const upcoming = [];

  for (let i = 0; i < events.length; i++) {
    const eventStartTime = events[i].timeDate; 
    const utcDate = new Date(eventStartTime);
    const timezoneOffset = new Date().getTimezoneOffset() * 60000; 
    const localTimeAsUtc = new Date(utcDate.getTime() + timezoneOffset);
    const timeDiff = now - localTimeAsUtc.getTime();
    const isEventUnavailable = timeDiff > 0 && timeDiff < thirtyMinutes || currentTime > localTimeAsUtc -  thirtyMinutes;

    console.log(currentTime.getTime()-  thirtyMinutes, localTimeAsUtc.getTime())
    // Separate past and upcoming events based on timeDiff
    if (isEventUnavailable) {
      past.push(events[i]); // Event is in the past or too far in the future
    } else {
      upcoming.push(events[i]); // Event is upcoming
    }
  }

  setPastEvents(past);
  setUpcomingEvents(upcoming);
  console.log('past',past)
  console.log('upcoming',upcoming)
}, [events, currentTime]); // Add `currentTime` dependency to track time


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
      <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#333', marginLeft: '12px' }}>Upcoming Events</h4>
      {events.length > 0 ? (
          <table style={{ width: '100%', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '12px', width: '25%', color: '#333' }}>Event Name</th>
              <th style={{ padding: '12px', width: '15%', color: '#333' }}>Date</th>
              <th style={{ padding: '12px', width: '15%', color: '#333' }}>Time</th>
              <th style={{ padding: '12px', width: '25%', color: '#333' }}>Location</th>
              <th style={{ padding: '12px', width: '20%', color: '#333' }}>Check In</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.map(event => {
              const eventStartTime = event.timeDate; 
              const utcDate = new Date(eventStartTime);
              const timezoneOffset = new Date().getTimezoneOffset() * 60000; 
              const localTimeAsUtc = new Date(utcDate.getTime() + timezoneOffset);
              const timeDiff = currentTime - localTimeAsUtc;
              const thirtyMinutes = 30 * 60 * 1000;
              const isEventUnavailable = timeDiff < 0 || timeDiff > thirtyMinutes;
    
              return (
                <tr key={event.eventId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', color: '#555' }}>{event.eventTitle}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{localTimeAsUtc.toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{localTimeAsUtc.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
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
       <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#333', marginLeft: '12px', marginTop: '12px' }}>Past Events</h4>
      {events.length > 0 && (
        <table style={{ width: '100%', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: '#333' }}>Event Name</th>
              <th style={{ padding: '12px', color: '#333' }}>Date</th>
              <th style={{ padding: '12px', color: '#333' }}>Time</th>
              <th style={{ padding: '12px', color: '#333' }}>Location</th>
              <th style={{ padding: '5px', color: '#333' }}>Check In</th>
            </tr>
          </thead>
          <tbody>
            {pastEvents.map(event => {
              
              const eventStartTime = event.timeDate; 
              const utcDate = new Date(eventStartTime);

              const timezoneOffset = new Date().getTimezoneOffset() * 60000; 
              
              
              const localTimeAsUtc = new Date(utcDate.getTime() + timezoneOffset);
               
               const timeDiff = currentTime - localTimeAsUtc;
              
              const thirtyMinutes = 30 * 60 * 1000;
              const isEventUnavailable = timeDiff < 0 || timeDiff > thirtyMinutes;
   
              return (
                <tr key={event.eventId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', color: '#555' }}>{event.eventTitle}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{localTimeAsUtc.toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{localTimeAsUtc.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
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
        </table>)}
    </div>
  );
}

export default UserEvents;