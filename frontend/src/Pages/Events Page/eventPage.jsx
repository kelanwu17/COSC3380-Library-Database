import React from 'react';
import { Grid2, 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Container, 
  TextField 
} from '@mui/material';

// Sample events created
const eventsData = [
  { id: 1, title: 'Event 1', description: 'Details of Event 1' },
  { id: 2, title: 'Event 2', description: 'Details of Event 2' },
  { id: 3, title: 'Event 3', description: 'Details of Event 3' },
  // Add more events here
];

const EventsPage = () => {
  // Handler for Sign Up button
  const handleSignUp = (eventId) => {
    alert(`Signed up for event with id: ${eventId}`);
  };

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
          sx={{ mb: 4,
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
            {eventsData.map((event) => (
              <Grid2 item xs={12} sm={6} md={4} key={event.id}>
                <Paper 
                  elevation={3} 
                  sx={{
                    p: 2,
                    width: "550px",
                    height: "200px",
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 5 }}>
                      {event.description}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleSignUp(event.id)}
                  >
                    Sign Up
                  </Button>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Box>
    </Container>
  );
};

export default EventsPage;
