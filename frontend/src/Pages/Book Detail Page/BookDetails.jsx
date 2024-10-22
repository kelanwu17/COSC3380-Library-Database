import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar';
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
import { useParams, Link } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookId, setBookId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState([]); // Change from single string to array
  const [ageCategory, setAgeCategory] = useState('');
  const [count, setCount] = useState(0);
  const [description, setDescription] = useState('');
  const [edition, setEdition] = useState('');
  const [aisle, setAisle] = useState(0);
  const [isbn, setIsbn] = useState('');
  const [monetaryValue, setMonetaryValue] = useState(0);
  const [publisher, setPublisher] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [similarBooks, setSimilarBooks] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/books/${id}`);
        const book = response.data[0];
        
        if (book) {
          const { 
            bookId, title, author, genre, ageCategory, count, 
            description, edition, aisle, isbn, monetaryValue, publisher, imgUrl 
          } = book;

          setBookId(bookId);
          setTitle(title);
          setAuthor(author);
          setGenres(genre.split(',').map(g => g.trim())); // Assume genre comes as a comma-separated string
          setAgeCategory(ageCategory);
          setCount(count);
          setDescription(description);
          setEdition(edition);
          setAisle(aisle);
          setIsbn(isbn);
          setMonetaryValue(monetaryValue);
          setPublisher(publisher);
          setImgUrl(imgUrl);

          fetchSimilarBooks(genre);
        } else {
          throw new Error('Book not found');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        
      } finally {
        setLoading(false); 
      }
    };

    const fetchSimilarBooks = async (genre) => {
      try {
        const response = await axios.get(`https://library-database-backend.onrender.com/api/books/genre/${genre}`);
        const books = response.data.slice(0, 5); 
        setSimilarBooks(books); 
      } catch (error) {
        console.error('Error fetching similar books:', error);
        
      }
    };

    fetchBookDetails(); 
  }, [id]);

  const handleToggleDetails = () => setShowMoreDetails(!showMoreDetails);
  const handleBackClick = () => navigate('/books');
  
  const filteredSimilarBooks = similarBooks.filter(book => book.title !== title);

  return (
    <div>
      <Navbar />
      <hr className="ml-2 mr-2 border-t-2 border-black" />
      <div className="h-8">
        <button className="ml-4 mt-4 h-6 border bg-amber-900 w-32 rounded-lg text-white text-bold border-black" onClick={handleBackClick}>Back</button>
      </div>
      {loading ? ( 
        <p>Loading...</p>
      ) : (
        <div className="flex flex-row ml-6 mt-6">
          <p className="w-2/12 h-80">
            <img src={imgUrl} className="w-full h-full object-cover" alt="Book cover" />
          </p>
          <div className="ml-2 mt-2 flex flex-col">
            <p className="text-sm mt-1">Title: {title}</p>
            <p className="text-sm mt-1">Author: {author}</p>
            <p className="text-sm mt-1">
              Genres: {genres.map((g, index) => (
                <span key={index}>
                  <Link to={`/books/${g}`}>
                    <span className='text-blue-600 hover:text-purple-800'>{g}</span>
                  </Link>
                  {index < genres.length - 1 && ', '} 
                </span>
              ))}
            </p>
            {showMoreDetails ? (
              <>
                <p className="text-sm mt-1">Isbn: {isbn}</p>
                <p className="text-sm mt-1">Publisher: {publisher}</p>
                <p className="text-sm mt-1">Current Availability: {count}</p>
                <p className="text-sm mt-1">Location: Aisle {aisle}</p>
                <p className="text-sm mt-1">Summary: {description}</p>
                <button className='text-xs mt-1 font-bold' onClick={handleToggleDetails}>
                  Hide Details
                </button>
              </>
            ) : (
              <button className="text-xs mt-1 font-bold" onClick={handleToggleDetails}>
                More Details
              </button>
            )}
          </div>
          <div className="ml-auto mr-12 flex flex-col">
            <button className="border bg-amber-900 w-36 rounded-lg text-white text-bold border-black">Reserve</button>
            <button className="border bg-amber-900 w-36 rounded-lg text-white text-bold border-black mt-2">Checkout</button>
          </div>
        </div>
      )}
      
      <hr className="ml-6 mt-2 bg-black border-0" />
      <p className="ml-4">Similar Books:</p>
      <hr className="mt-2 ml-2 mr-2 border-t-2 border-black" />
      <div className="flex flex-row flex-wrap">
        {filteredSimilarBooks.length > 0 && ( 
          filteredSimilarBooks.map((book) => (
            <Link to={`/books/${book.bookId}`} key={book.bookId}> 
              <div className="flex flex-col ml-32 mt-4 hover:scale-105 transform transition-transform duration-300">
                <div className="border-black border h-60 w-48 ">
                  <img src={book.imgUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-center mt-1">{book.title}</p>
                <p className="text-xs text-center mb-4">{book.author}</p>
              </div>
            </Link>
          ))
        )}
      </div>
      <footer>Footer</footer>
    </div>
  );
}

export default BookDetails;
