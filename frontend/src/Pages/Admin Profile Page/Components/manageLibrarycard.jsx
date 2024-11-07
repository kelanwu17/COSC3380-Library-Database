import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Paper, Grid, Box, Container } from '@mui/material';

function ManageLibraryCard() {
  const [libraryCards, setLibraryCards] = useState([]);
  const [memberNames, setMemberNames] = useState({});
  const [searchMemberId, setSearchMemberId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState({});

  // Fetch all library cards
  const fetchAllLibraryCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/libraryCard/');
      setLibraryCards(response.data);
      setError(null);

      // Fetch member names for each library card
      const memberIds = response.data.map(card => card.memberId);
      fetchMemberNames(memberIds);
    } catch (error) {
      setError('Failed to retrieve library cards');
      console.error('Error fetching library cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch member names based on member IDs
  const fetchMemberNames = async (memberIds) => {
    const names = {};
    await Promise.all(
      memberIds.map(async (memberId) => {
        try {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/member/${memberId}`);
          const { firstName = "Name not available", lastName = "" } = response.data[0] || {};
          names[memberId] = `${firstName} ${lastName}`.trim();
        } catch (error) {
          console.error(`Error fetching member name for ID ${memberId}:`, error);
          names[memberId] = "Name not available";
        }
      })
    );
    setMemberNames(names);
  };

  useEffect(() => {
    // Fetch all library cards initially
    fetchAllLibraryCards();
  }, []);

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'No Date Available';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Toggle details visibility for a specific card
  const toggleDetails = (cardId) => {
    setShowDetails((prevShowDetails) => ({
      ...prevShowDetails,
      [cardId]: !prevShowDetails[cardId],
    }));
  };

  // Filter library cards based on member ID or name
  const filteredLibraryCards = libraryCards.filter((card) => {
    const memberName = memberNames[card.memberId]?.toLowerCase() || '';
    const matchesId = searchMemberId ? card.memberId.toString().includes(searchMemberId) : true;
    const matchesName = searchName ? memberName.includes(searchName.toLowerCase()) : true;
    return matchesId && matchesName;
  });

  return (
    <Container sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Manage Library Cards
      </Typography>

      {/* Search Fields */}
      <Box sx={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <TextField
          label="Search by Member ID"
          variant="outlined"
          value={searchMemberId}
          onChange={(e) => setSearchMemberId(e.target.value)}
        />
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={fetchAllLibraryCards}>
          Search
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredLibraryCards.length > 0 ? (
        <Grid container spacing={2}>
          {filteredLibraryCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.cardId}>
              <Paper elevation={3} sx={{ padding: '16px', borderRadius: '8px' }}>
                <Typography variant="h6">Library Card ID: {card.cardId}</Typography>
                <Typography>Member ID: {card.memberId}</Typography>
                <Typography>Name: {memberNames[card.memberId] || 'Loading...'}</Typography>
                <Typography>
                  Status: 
                  <span style={{ color: card.status === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {card.status === 1 ? ' Active' : ' Inactive'}
                  </span>
                </Typography>

                {/* Button to toggle details */}
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => toggleDetails(card.cardId)}
                  sx={{ marginTop: '10px' }}
                >
                  {showDetails[card.cardId] ? 'Hide Details' : 'Show Details'}
                </Button>

                {/* Conditional rendering of issued and expired dates */}
                {showDetails[card.cardId] && (
                  <div style={{ marginTop: '10px' }}>
                    <Typography><strong>Issued Date:</strong> {formatDate(card.dateIssued)}</Typography>
                    <Typography><strong>Expired Date:</strong> {formatDate(card.dateExpired)}</Typography>
                  </div>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No library cards found.</Typography>
      )}
    </Container>
  );
}

export default ManageLibraryCard;
