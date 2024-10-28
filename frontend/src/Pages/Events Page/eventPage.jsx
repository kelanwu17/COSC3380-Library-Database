import React, { useEffect } from 'react';
import { Grid2, 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Container, 
  TextField 
} from '@mui/material';
import axios from "axios";
import { useState } from 'react';

const EventsPage = () => {
  const [eventsData, setEventsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  //Fetching Events
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

  // Handler for Sign Up button
  const handleSignUp = (eventId) => {
    alert(`Signed up for event with id: ${eventId}`); 
  };

  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by title
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) // You can add more fields to search if needed
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
          value={searchQuery} // Controlled input value
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
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
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleSignUp(event.eventId)}
                  >
                    Sign Up
                  </Button>
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
      </Box>
    </Container>
  );
};

export default EventsPage;

