import React, { useEffect, useState } from 'react';
import { Grid2, Box, Paper, Typography, Button, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const EventsPage = () => {
  const [eventsData, setEventsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const navigate = useNavigate();

  // Fetching Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://library-database-backend.onrender.com/api/event');
        setEventsData(response.data); 
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Fetch Registered Events
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const userId = sessionStorage.getItem('memberId');
      if (userId) {
        try {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/eventSignUp/member/${userId}`);
          const registeredEventIds = new Set(response.data.map(event => event.eventId));
          //console.log("Fetched registered events:", registeredEventIds); // Debugging log
          setRegisteredEvents(registeredEventIds);
        } catch (error) {
          console.error('Error fetching registered events:', error);
        }
      }
    };
    fetchRegisteredEvents();
  }, []);

  // Handle Sign Up
  const handleSignUp = async (eventId) => {
    const userId = sessionStorage.getItem('memberId');
    if (!userId) {
      alert("You need to be logged in to sign up for an event.");
      return;
    }

    try {
      await axios.post('https://library-database-backend.onrender.com/api/eventSignUp/insertEventSignUp', {
        eventId: eventId,
        memberId: userId
      });
      setRegisteredEvents((prev) => new Set(prev).add(eventId));
      alert(`Successfully signed up for event with id: ${eventId}`);
    } catch (error) {
      console.error('Error signing up for event:', error);
      alert('Failed to sign up for the event. Please try again.');
    }
  };

  // Handle Unregister
const handleUnregister = async (eventId) => {
  const userId = sessionStorage.getItem('memberId');
  if (!userId) {
    alert("You need to be logged in to unregister from an event.");
    return;
  }

  try {
    // Fetch all event signups for the current user
    const response = await axios.get(`https://library-database-backend.onrender.com/api/eventSignUp/member/${userId}`);
    const userSignUps = response.data;

    // Find the eventSignUpId for the given eventId
    const eventSignUp = userSignUps.find(signUp => signUp.eventId === eventId);
    
    if (!eventSignUp) {
      alert("You are not registered for this event.");
      return;
    }

    // Use the found eventSignUpId to delete the signup
    await axios.delete(`https://library-database-backend.onrender.com/api/eventSignUp/deleteEventSignUp/${eventSignUp.eventSignUpId}`);
    
    // Update registered events state
    setRegisteredEvents((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(eventId);
      return updatedSet;
    });
    alert(`Successfully unregistered from event with id: ${eventId}`);
  } catch (error) {
    console.error('Error unregistering from event:', error);
    alert('Failed to unregister from the event. Please try again.');
  }
};


  const filteredEvents = eventsData.filter(event => 
    event.active === 1 && (
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()))
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
                    {registeredEvents.has(event.eventId) ? (
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleUnregister(event.eventId)}
                      >
                        Unregister
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
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/')}
        sx={{
          position: "absolute",
          bottom: 20, 
          left: 20, 
          zIndex: 2 
        }}
      >
        Back
      </Button>
    </Container>
  );
};

export default EventsPage;