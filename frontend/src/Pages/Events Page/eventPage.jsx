import React from 'react';
import { Grid2, 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Container, 
  TextField 
} from '@mui/material';

//Sample events i created
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
      background: "linear-gradient(to right, #816950b2, #87654163)",
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      margin: "0",
      padding: "0",
      width: "100vw",
      overflowX: "hidden"
       }}>
      
      <Box 
      sx={{
        backgroundColor: "#65503c4b",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
        borderRadius: "25px",
        width: "1200px",
        height: "800px",
        }}> {/* 4 time 8px = 32 px */}
      
        <Typography 
        variant="h3" 
        align="center" 
        gutterBottom
        color={"white"}
        paddingTop = "10px">
          Browse & Sign Up for Events
        </Typography>
        
        {/* Search bar (optional) */}
        <TextField 
          label="Search Events" 
          variant="filled" 
          sx={{ mb: 4 ,
            backgroundColor: "white",
            borderRadius: "5px",
            fontWeight: "bold",
            border: "none",
            width: "100%",
            margin: "0px 5px"
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
                <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {event.description}
                  </Typography>
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

