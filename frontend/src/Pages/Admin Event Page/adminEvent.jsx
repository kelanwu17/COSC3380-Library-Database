import React, { useEffect, useState } from 'react';
import { Grid2, Box, Paper, Typography, Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminEvent() {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]); // Holding all events 
  const [searchQuery, setSearchQuery] = useState(''); // Stores search input
  const [editModalOpen, setEditModalOpen] = useState(false);  // Track edit modal state
  const [selectedEvent, setSelectedEvent] = useState(null);  // Store selected event for editing
  const [editFormData, setEditFormData] = useState({
    title: '',
    location: '',
    ageGroup: '',
    category: '',
    timeDate: ''
  }); // Form data for editing

  const [createModalOpen, setCreateModalOpen] = useState(false);  // Track create modal state
  const [newEventData, setNewEventData] = useState({
    title: '',
    location: '',
    ageGroup: '',
    category: '',
    eventCreator: '',  // Adjust based on actual data
    eventHolder: '',   // Adjust based on actual data
    timeDate: ''
  }); // Form data for new event


  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/event'); // API endpoint
      setEventsData(response.data); 
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents(); // Call the fetch function on component load
  }, []);

  // Handle Edit Button Click
  const handleEdit = (event) => {
    setSelectedEvent(event);  // Store the selected event data
    setEditFormData({
      title: event.title,
      location: event.location,
      ageGroup: event.ageGroup,
      category: event.category,
      timeDate: new Date(event.timeDate).toISOString().slice(0, 16)  // Format to datetime-local format
    });
    setEditModalOpen(true);  // Open the modal
  };

  // Handle Edit Form Change
  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData, //spread data to preserve existing values
      [e.target.name]: e.target.value //dynamically update field
    });
  };

  // Handle Update (Edit)
  const handleUpdate = async () => {
    try {
      await axios.put(`https://library-database-backend.onrender.com/api/event/updateEvent/${selectedEvent.eventId}`, editFormData);
      
      // Update the events list with the edited data
      const updatedEvents = eventsData.map(event =>
        event.eventId === selectedEvent.eventId ? { ...event, ...editFormData } : event
      );
      setEventsData(updatedEvents);

      setEditModalOpen(false);  // Close the modal
      alert('Event updated successfully.');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  // Handler for Delete button
  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the event with id: ${eventId}?`);
    if (confirmDelete) {
      try {
        await axios.put(`https://library-database-backend.onrender.com/api/event/disableEvent/${eventId}`);
        // Refresh the events list after deletion
        setEventsData(eventsData.filter(event => event.eventId !== eventId));
        alert(`Event with id: ${eventId} has been deleted.`);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  // Handle Create Event button click
  const handleCreateOpen = () => {
    setCreateModalOpen(true);
  };

  // Handle Create Form Change
  const handleCreateFormChange = (e) => {
    setNewEventData({
      ...newEventData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Create (Submit new event)
  const handleCreateEvent = async () => {
    try {
      await axios.post('https://library-database-backend.onrender.com/api/event/createEvent', newEventData);
      setCreateModalOpen(false);  // Close the modal
      fetchEvents();  // Refresh event list after creating a new event
      alert('Event created successfully.');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <p>Admin</p>
    </div>
  )
}

export default AdminEvent
