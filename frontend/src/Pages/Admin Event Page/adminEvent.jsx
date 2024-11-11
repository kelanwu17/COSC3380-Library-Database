import React, { useEffect, useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000080', // Your custom primary color 
    },
    secondary: {
      main: '#B0C4DE', // Your custom secondary color
    },
  },
});

function AdminEvent() {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    location: '',
    ageGroup: '',
    category: '',
    timeDate: ''
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    location: '',
    ageGroup: '',
    category: '',
    eventCreator: '',
    eventHolder: '',
    timeDate: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/event');
      setEventsData(response.data); 
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setEditFormData({
      title: event.title,
      location: event.location,
      ageGroup: event.ageGroup,
      category: event.category,
      timeDate: event.timeDate
        ? new Date(event.timeDate).toISOString().slice(0, 16) // Format suitable for datetime-local input
        : '' // Default to empty string if no date
    });

    setEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://library-database-backend.onrender.com/api/event/updateEvent/${selectedEvent.eventId}`, editFormData);
      const updatedEvents = eventsData.map(event =>
        event.eventId === selectedEvent.eventId ? { ...event, ...editFormData } : event
      );
      setEventsData(updatedEvents);
      setEditModalOpen(false);
      alert('Event updated successfully.');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the event with id: ${eventId}?`);
    if (confirmDelete) {
      try {
        await axios.put(`https://library-database-backend.onrender.com/api/event/disableEvent/${eventId}`);
        setEventsData(eventsData.filter(event => event.eventId !== eventId));
        alert(`Event with id: ${eventId} has been deleted.`);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleCreateOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateFormChange = (e) => {
    setNewEventData({
      ...newEventData,
      [e.target.name]: e.target.value
    });
  };

  const formatEventTime = (timeDate) => {
    if (!timeDate) return 'Date Invalid';
    const utcDate = new Date(timeDate);
    return utcDate.toLocaleString(); // This will convert to the local time and format accordingly
  };

  
  const handleCreateEvent = async () => {
    try {
      const formattedTimeDate = newEventData.timeDate 
      ? new Date(newEventData.timeDate).toISOString().split('T')[0] + " " + new Date(newEventData.timeDate).toISOString().split('T')[1].slice(0, 5)
      : '';

    // Create new event data with formatted time
    const eventToCreate = {
      ...newEventData,
      timeDate: formattedTimeDate
    };
      await axios.post('https://library-database-backend.onrender.com/api/event/createEvent', newEventData);
      setCreateModalOpen(false);
      fetchEvents();
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
    <ThemeProvider theme={theme}>
    <Container 
      maxWidth="lg" 
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/')} // Redirect to the home page
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>

      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom
        color="primary"
      >
        Browse & Sign Up for Events
      </Typography>

      <TextField 
        label="Search Events" 
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3, width: "100%", maxWidth: "600px" }}
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreateOpen}
        sx={{ mb: 4 }}
      >
        Create New Event
      </Button>

      <Box 
        sx={{ 
          height: '500px', 
          width: "100%",
          maxWidth: "1200px",
          overflowY: 'scroll',
        }}
      >
        <Grid container spacing={2}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                <Paper 
                  elevation={3} 
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: "100%"
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography variant="body2">
                      Location: {event.location}
                    </Typography>
                    <Typography variant="body2">
                      Age Group: {event.ageGroup}
                    </Typography>
                    <Typography variant="body2">
                      Category: {event.category}
                    </Typography>
                    <Typography variant="body2">
                      Event Creator ID: {event.eventCreator}
                    </Typography>
                    <Typography variant="body2">
                      Event Holder ID: {event.eventHolder}
                    </Typography>
                    <Typography variant="body2">
                      Time and Date: {event.timeDate ? formatEventTime(event.timeDate) : 'Date Invalid'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleEdit(event)}
                      sx={{ flexGrow: 1 }}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleDelete(event.eventId)}
                      sx={{ flexGrow: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No events found.</Typography>
          )}
        </Grid>
      </Box>

      {/* Edit Event Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={editFormData.title}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={editFormData.location}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Age Group</InputLabel>
            <Select
              name="ageGroup"
              value={editFormData.ageGroup}
              onChange={handleFormChange}
            >
              <MenuItem value="kid">Kid</MenuItem>
              <MenuItem value="teen">Teen</MenuItem>
              <MenuItem value="adult">Adult</MenuItem>
              <MenuItem value="elder">Elder</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Category"
            name="category"
            value={editFormData.category}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Time and Date"
            name="timeDate"
            value={editFormData.timeDate}
            onChange={handleFormChange}
            fullWidth
            type="datetime-local"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={newEventData.title}
            onChange={handleCreateFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={newEventData.location}
            onChange={handleCreateFormChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Age Group</InputLabel>
            <Select
              name="ageGroup"
              value={newEventData.ageGroup}
              onChange={handleCreateFormChange}
            >
              <MenuItem value="kid">Kid</MenuItem>
              <MenuItem value="teen">Teen</MenuItem>
              <MenuItem value="adult">Adult</MenuItem>
              <MenuItem value="elder">Elder</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Category"
            name="category"
            value={newEventData.category}
            onChange={handleCreateFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Creator ID"
            name="eventCreator"
            value={newEventData.eventCreator}
            onChange={handleCreateFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Event Holder ID"
            name="eventHolder"
            value={newEventData.eventHolder}
            onChange={handleCreateFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Time and Date"
            name="timeDate"
            value={newEventData.timeDate}
            onChange={handleCreateFormChange}
            fullWidth
            type="datetime-local"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </ThemeProvider>
  );
}

export default AdminEvent;
