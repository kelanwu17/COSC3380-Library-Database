import React, { useEffect, useState } from 'react';
import { Grid2, Box, Paper, Typography, Button, Container, TextField } from '@mui/material';
import axios from "axios";

const EventsPage = () => {
  const [eventsData, setEventsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState(new Set()); // Track registered events

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

  // Fetch Registered Events
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const userId = sessionStorage.getItem('memberId'); // Get the user ID
      if (userId) {
        try {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/eventSignUp/${userId}`);
          const registeredEventIds = new Set(response.data.map(event => event.eventId)); // Assuming response data contains eventId
          setRegisteredEvents(registeredEventIds); // Store registered events in state
        } catch (error) {
          console.error('Error fetching registered events:', error);
        }
      }
    };

    fetchRegisteredEvents(); // Call the fetch function
  }, []);

  // Handle Sign Up button
  const handleSignUp = async (eventId) => {
    const userId = sessionStorage.getItem('memberId'); // Get the user ID
    if (!userId) {
      alert("You need to be logged in to sign up for an event.");
      return;
    }

    try {
      // Call the sign-up API
      await axios.post('https://library-database-backend.onrender.com/api/eventSignUp/insertEventSignUp', {
        eventId: eventId,
        memberId: userId
      });
      setRegisteredEvents((prev) => new Set(prev).add(eventId)); // Update registered events
      alert(`Successfully signed up for event with id: ${eventId}`);
    } catch (error) {
      console.error('Error signing up for event:', error);
      alert('Failed to sign up for the event. Please try again.');
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
        position: "relative" // Position relative to apply background on a pseudo-element
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
          filter: "blur(8px)", // Apply blur
          zIndex: -1, // Ensure the background stays behind the content
        }} 
      />

      <Box 
        sx={{
          background: "rgba(101, 80, 60, 0.7)", // Semi-transparent to make content more visible
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
          borderRadius: "25px",
          width: "1200px",
          height: "800px",
          zIndex: 1, // Bring the content on top of the blurred background
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
                <Grid2 xs={12} sm={6} md={4} key={event.eventId} item>
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
                    {registeredEvents.has(event.eventId) ? ( // Check if registered
                    <Button 
                    variant="contained" 
                    disabled
                  >
                    Signed up
                  </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleSignUp(event.eventId)}
                      >
                        Sign Up
                      </Button>
                    )}
                  </Paper>
                </Grid2>
              ))
            ) : (
              <Typography variant="h6" color="white">
                No events found.
              </Typography>
            )}
          </Grid2>
        </Box>
      </Box>
    </Container>
  );
};

export default EventsPage;


