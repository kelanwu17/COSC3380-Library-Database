import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecommendedBooks({ preferences, userId }) {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [selectedBookGenres, setSelectedBookGenres] = useState([]);
  const bookGenres = ['romance', 'adventure', 'mystery', 'history', 'horror', 'action'];

  // Sync preferences prop with selectedBookGenres on mount or when preferences change
  useEffect(() => {
    setSelectedBookGenres(preferences ? preferences.split(',').map(genre => genre.trim()) : []);
  }, [preferences]);

  // Fetch recommended books based on selected genres
  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      const genresToFetch = selectedBookGenres.length > 0 ? selectedBookGenres : ["fiction"];
      const booksByGenre = [];

      for (const genre of genresToFetch) {
        try {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/books/genre/${genre}`);
          if (response.data && Array.isArray(response.data)) {
            booksByGenre.push(...response.data);
          }
        } catch (error) {
          console.error(`Error fetching books for genre "${genre}":`, error);
        }
      }

      setRecommendedBooks(booksByGenre);
    };

    fetchRecommendedBooks();
  }, [selectedBookGenres]);

  // Handle checkbox changes for book genres
  const handleBookGenreChange = (event) => {
    const { value, checked } = event.target;
    setSelectedBookGenres(prevGenres =>
      checked ? [...prevGenres, value] : prevGenres.filter(genre => genre !== value)
    );
  };

  // Save updated book preferences to the backend
  const saveBookPreferences = async () => {
    if (!userId) {
      console.error("Error: userId is not defined.");
      alert("User ID is missing. Please make sure you're logged in.");
      return;
    }

    try {
      await axios.put(`https://library-database-backend.onrender.com/api/member/updateMemberPref/${userId}`, {
        preferences: selectedBookGenres.join(', ')
      });
      alert("Book preferences saved successfully.");
    } catch (error) {
      console.error("Error saving book preferences:", error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Recommended Books</h1>

      <div style={{ marginBottom: '20px' }}>
        <h3>Select Book Genres</h3>
        {bookGenres.map(genre => (
          <label key={genre} style={{ display: 'block' }}>
            <input
              type="checkbox"
              value={genre}
              checked={selectedBookGenres.includes(genre)}
              onChange={handleBookGenreChange}
            />
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </label>
        ))}
        <button onClick={saveBookPreferences} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save Book Preferences
        </button>
      </div>

      {recommendedBooks.length > 0 ? (
        <ul>
          {recommendedBooks.map((book) => (
            <li key={book.id} className="mb-2">
              <p className="font-semibold text-black">{book.title}</p>
              <p className="text-sm text-gray-500">{book.author}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No recommended books available.</p>
      )}
    </div>
  );
}

export default RecommendedBooks;
