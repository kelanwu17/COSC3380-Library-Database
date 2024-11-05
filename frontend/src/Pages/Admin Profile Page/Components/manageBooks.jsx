import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [editableData, setEditableData] = useState({
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
      alert(response.data.message || 'Operation completed successfully.');
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
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Manage Books</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by Title or Author"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 15px', marginRight: '5px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
        <button onClick={fetchAllBooks} style={{ padding: '8px 15px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Get All Books</button>
      </div>

      <div style={{
        overflowX: 'auto',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
        backgroundColor: '#fff',
        maxHeight: '500px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto', textAlign: 'center' }}>
          <thead>
            <tr>
              {['Title', 'Author', 'Genre', 'Count', 'Aisle', 'Actions'].map((header, idx) => (
                <th key={idx} style={{
                  padding: '12px 15px',
                  backgroundColor: '#455a7a',
                  color: 'white',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd',
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  textAlign: 'center'
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.bookId} style={{ borderBottom: '1px solid #ddd', height: '60px' }}>
                <td style={{ padding: '10px' }}>{book.title}</td>
                <td style={{ padding: '10px' }}>{book.author}</td>
                <td style={{ padding: '10px' }}>{book.genre}</td>
                <td style={{ padding: '10px' }}>{book.count}</td>
                <td style={{ padding: '10px' }}>{book.aisle}</td>
                <td style={{ padding: '10px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <button onClick={() => handleEditBook(book)} style={{
                    backgroundColor: '#455a7a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 15px',
                    cursor: 'pointer'
                  }}>Edit</button>
                  <button onClick={() => handleDeleteBook(book.bookId)} style={{
                    backgroundColor: '#455a7a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 15px',
                    cursor: 'pointer'
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
        {/* Create Book Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Create Book</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {Object.keys(newBook).map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type="text"
                      value={newBook[field]}
                      onChange={(e) => setNewBook({ ...newBook, [field]: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        color: 'black' // Set input text color to black
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleCreateBook} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Add Book</button>
        </div>

        {/* Edit Book Form - Always Visible */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Edit Book</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {Object.keys(editableData).map((field) => (
                <tr key={field}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                  <td>
                    <input
                      type="text"
                      value={editableData[field]}
                      onChange={(e) => handleInputChange(e, field)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        color: 'black' // Set input text color to black
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpdateBook} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Update Book</button>
        </div>
      </div>
    </div>
  );
}

export default ManageBooks;
