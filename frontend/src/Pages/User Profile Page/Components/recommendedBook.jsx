import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecommendedBooks({ preferences }) {
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const genres = preferences.split(',').map(genre => genre.trim());
        const booksByGenre = [];

        for (const genre of genres) {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/books/genre/${genre}`);
          booksByGenre.push(...response.data);
        }

        setRecommendedBooks(booksByGenre);
      } catch (error) {
        console.error("Error fetching recommended books by genre:", error);
      }
    };

    if (preferences) {
      fetchRecommendedBooks();
    }
  }, [preferences]);

  return (
    <div className="p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Recommended Books</h1>
      {recommendedBooks.length > 0 ? (
        <ul>
          {recommendedBooks.map((book) => (
            <li key={book.id} className="mb-2">
              <p className="font-semibold text-black">{book.title}</p>
              <p className="text-sm text-gray-300">{book.author}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300">No recommended books available.</p>
      )}
    </div>
  );
}

export default RecommendedBooks;
