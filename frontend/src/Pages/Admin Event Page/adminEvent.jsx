import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Navbar from '../../Components/NavBar';  // Adjust the path as needed
import './adminEvent.css';

function AdminEvent() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/eventSignUp/');
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSearch = () => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleCreateEvent = async () => {
    try {
      const response = await axios.post('https://library-database-backend.onrender.com/api/event/insertEventSignUp', newEvent);
      alert('Event created successfully');
      fetchAllEvents();
      setNewEvent({
        title: '',
        date: '',
        location: '',
        description: '',
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`https://library-database-backend.onrender.com/api/event/deleteEvent/${id}`);
      alert('Event deleted successfully');
      fetchAllEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="admin-event-page">
      {/* <Navbar />  Navbar added here */}
      <div className="admin-event">
        {/* <h2>Admin - Manage Events</h2> */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Event Title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={fetchAllEvents}>Get All Events</button>
        </div>

        <div className="table-container">
          <table className="event-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>
                    <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Create Event</h3>
        <div className="form-section">
          <table className="form-table">
            <tbody>
              <tr>
                <td>Title</td>
                <td>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Date</td>
                <td>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Location</td>
                <td>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleCreateEvent}>Add Event</button>
        </div>
      </div>
    </div>
  );
}

export default AdminEvent;
