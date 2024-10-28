import React, { useEffect, useState } from 'react';
import { Grid2, Box, Paper, Typography, Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import axios from 'axios';

function AdminEvent() {
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

        {/* Create Event button */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateOpen}
          sx={{ mb: 4 }}
        >
          Create New Event
        </Button>

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
              <Grid2 item xs={12} sm={6} md={4} key={event.eventId}>
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
                  <Box sx={{ display: 'flex', gap: 2 }}>
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
                      onClick={() => handleDelete(event.eventId)}
                      sx={{width : '50%'}}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid2>
            ))
            ) : (
              <Typography variant="body1">No events found.</Typography>
            )}
          </Grid2>
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
            <Select
              label="Age Group"
              name="ageGroup"
              value={editFormData.ageGroup}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Age Group
              </MenuItem>
              <MenuItem value="kid">Kid</MenuItem>
              <MenuItem value="teen">Teen</MenuItem>
              <MenuItem value="adult">Adult</MenuItem>
              <MenuItem value="elder">Elder</MenuItem>
            </Select>
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
                label="Age Group"
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
              label=""
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
      </Box>
    </Container>
  );
}

export default AdminEvent;


