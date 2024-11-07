import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LibraryCard({ userId }) {
  const [libraryCard, setLibraryCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryCard = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/libraryCard/${userId}`);
        setLibraryCard(response.data);
      } catch (error) {
        console.error('Error fetching library card:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryCard();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date Available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <p>Loading library card information...</p>;
  }

  if (!libraryCard || libraryCard.length === 0) {
    return <p>No Library Card found for this member.</p>;
  }

  return (
    <div>
      {libraryCard.map(card => (
        <div key={card.cardId} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0' }}>
          <p><strong>Library Card ID:</strong> {card.cardId}</p>
          <p><strong>Member ID:</strong> {card.memberId}</p>
          <p><strong>Status:</strong> {card.status === 1 ? "Active" : "Inactive"}</p>
          <p><strong>Issued Date:</strong> {formatDate(card.dateIssued)}</p>
          <p><strong>Expired Date:</strong> {formatDate(card.dateExpired)}</p>
        </div>
      ))}
    </div>
  );
}

export default LibraryCard;
