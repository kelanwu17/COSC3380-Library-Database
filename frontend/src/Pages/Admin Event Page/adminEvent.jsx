import React, { useEffect, useState } from 'react';
import { Grid2, Box, Paper, Typography, Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import axios from 'axios';

function AdminEvent() {
  const [eventsData, setEventsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);  // Track edit modal state
  const [selectedEvent, setSelectedEvent] = useState(null);  // Store the selected event for editing
  const [editFormData, setEditFormData] = useState({
    title: '',
    location: '',
    ageGroup: '',
    category: '',
    timeDate: ''
  });

  // Fetching Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://library-database-backend.onrender.com/api/event'); // API endpoint
        setEventsData(response.data); 
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); // Call the fetch function
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

// Handle Form Change
const handleFormChange = (e) => {
  setEditFormData({
    ...editFormData,
    [e.target.name]: e.target.value
  });
};

// Handle Update
const handleUpdate = async () => {
  try {
    await axios.put(`https://library-database-backend.onrender.com/api/event/updateEvent/${selectedEvent.id}`, editFormData);
    
    // Update the events list with the edited data
    const updatedEvents = eventsData.map(event =>
      event.id === selectedEvent.id ? { ...event, ...editFormData } : event
    );
    setEventsData(updatedEvents);

    setEditModalOpen(false);  // Close the modal
    alert('Event updated successfully.');
  } catch (error) {
    console.error('Error updating event:', error);
    alert('Failed to update event. Please try again.');
  }
};
  // Handler for Sign Up button
  const handleSignUp = (eventId) => {
    alert(`Signed up for event with id: ${eventId}`); 
  };

  // Handler for Delete button
  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the event with id: ${eventId}?`);
    if (confirmDelete) {
      try {
        await axios.delete(`https://library-database-backend.onrender.com/api/event/deleteEvent/${eventId}`);
        // Refresh the events list after deletion
        setEventsData(eventsData.filter(event => event.id !== eventId));
        alert(`Event with id: ${eventId} has been deleted.`);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container 
      maxWidth="false" 
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0",
        padding: "0",
        width: "100vw",
        overflowX: "hidden",
        position: "relative"
      }}
    >
      {/* Blurred background */}
      <Box 
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url("/loginpage.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          zIndex: -1,
        }} 
      />

      <Box 
        sx={{
          background: "rgba(101, 80, 60, 0.7)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
          borderRadius: "25px",
          width: "1200px",
          height: "800px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          color={"white"}
          paddingTop="10px">
          Browse & Sign Up for Events
        </Typography>
        
        {/* Search bar */}
        <TextField 
          label="Search Events" 
          variant="filled"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            mb: 4,
            backgroundColor: "white",
            borderRadius: "5px",
            fontWeight: "bold",
            width: "100%",
            margin: "0px 5px 10px 0px"
          }}
        />

        {/* Scrollable list */}
        <Box 
          sx={{ 
            height: '500px', 
            overflowY: 'scroll', 
            margin: "10px",
            marginRight: "0px"
          }}>
          <Grid2 container spacing={4}>
            {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Grid2 item xs={12} sm={6} md={4} key={event.id}>
                <Paper 
                  elevation={3} 
                  sx={{
                    p: 2,
                    width: "550px",
                    height: "auto",
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {/* Displaying event details */}
                    <Typography variant="h5" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography variant="body1">
                      Location: {event.location}
                    </Typography>
                    <Typography variant="body1">
                      Age Group: {event.ageGroup}
                    </Typography>
                    <Typography variant="body1">
                      Category: {event.category}
                    </Typography>
                    <Typography variant="body1">
                      Event Creator ID: {event.eventCreator}
                    </Typography>
                    <Typography variant="body1">
                      Event Holder ID: {event.eventHolder}
                    </Typography>
                    <Typography variant="body1">
                      Time and Date: {new Date(event.timeDate).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}> {/* Add flexbox with gap */}
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleEdit(event)}
                      sx={{width : '50%'}}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleDelete(event.id)}
                      sx = {{width: '50%'}}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid2>
            )))
          : (
            <Typography variant="h6" color="white">
              No events found.
            </Typography>
          )}
          </Grid2>
        </Box>
        {/* Edit modal or pop up screen */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <TextField label="Title" name="title" value={editFormData.title} onChange={handleFormChange} fullWidth margin="dense" />
            <TextField label="Location" name="location" value={editFormData.location} onChange={handleFormChange} fullWidth margin="dense" />
            <TextField label="Age Group" name="ageGroup" value={editFormData.ageGroup} onChange={handleFormChange} fullWidth margin="dense" />
            <TextField label="Category" name="category" value={editFormData.category} onChange={handleFormChange} fullWidth margin="dense" />
            <TextField label="Time and Date" name="timeDate" type="datetime-local" value={editFormData.timeDate} onChange={handleFormChange} fullWidth margin="dense" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)} color="secondary">Cancel</Button>
            <Button onClick={handleUpdate} color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default AdminEvent;

