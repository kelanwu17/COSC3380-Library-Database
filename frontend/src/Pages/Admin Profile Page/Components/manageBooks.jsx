import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminProfile.css';

function ManageBooks() {
  const [booksData, setBooksData] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    genre: '',
    ageCategory: '',
    count: '',
    aisle: '',
    description: '',
    author: '',
    isbn: '',
    publisher: '',
    edition: '',
    monetaryValue: '',
    imgUrl: '',
  });
  const [editBookId, setEditBookId] = useState(null);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/books/');
      setBooksData(response.data);
      setFilteredBooks(response.data);
    } catch (err) {
      console.error('Error fetching books.');
    }
  };

  const handleSearch = () => {
    const filtered = booksData.filter(
      (book) =>
        book.title.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleCreateBook = async () => {
    try {
      const response = await axios.post('https://library-database-backend.onrender.com/api/books/createBook', newBook);
      alert(response.data.message);
      fetchAllBooks();
      setNewBook({
        title: '',
        genre: '',
        ageCategory: '',
        count: '',
        aisle: '',
        description: '',
        author: '',
        isbn: '',
        publisher: '',
        edition: '',
        monetaryValue: '',
        imgUrl: '',
      });
    } catch (err) {
      console.error('Error creating book.');
    }
  };

  const handleEditBook = (book) => {
    setEditBookId(book.bookId);
    setEditableData({ ...book });
  };

  const handleUpdateBook = async () => {
    try {
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/books/updateBook/${editBookId}`,
        editableData
      );
      alert(response.data.message);
      setEditBookId(null);
      fetchAllBooks();
    } catch (err) {
      console.error('Error updating book.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await axios.delete(`https://library-database-backend.onrender.com/api/books/deleteBook/${bookId}`);
      alert(response.data.message);
      fetchAllBooks();
    } catch (err) {
      console.error('Error deleting book.');
    }
  };

  const handleInputChange = (e, field) => {
    setEditableData({ ...editableData, [field]: e.target.value });
  };

  return (
    <div className="manage-books">
      <h2>Manage Books</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Title or Author"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchAllBooks}>Get All Books</button>
      </div>

      <div className="table-container">
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Count</th>
              <th>Aisle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.count}</td>
                <td>{book.aisle}</td>
                <td>
                  <button onClick={() => handleEditBook(book)}>Modify</button>
                  <button onClick={() => handleDeleteBook(book.bookId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-section-wrapper">
        {/* Create Book Form */}
        <div className="form-section">
          <h3>Create Book</h3>
          <table className="form-table">
            <tbody>
              {Object.keys(newBook).map((field) => (
                <tr key={field}>
                  <td>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type="text"
                      value={newBook[field]}
                      onChange={(e) => setNewBook({ ...newBook, [field]: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleCreateBook}>Add Book</button>
        </div>

        {/* Edit Book Form */}
        {editBookId && (
          <div className="form-section">
            <h3>Edit Book</h3>
            <table className="form-table">
              <tbody>
                {Object.keys(editableData).map((field) => (
                  <tr key={field}>
                    <td>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                    <td>
                      <input
                        type="text"
                        value={editableData[field]}
                        onChange={(e) => handleInputChange(e, field)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleUpdateBook}>Update Book</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageBooks;
