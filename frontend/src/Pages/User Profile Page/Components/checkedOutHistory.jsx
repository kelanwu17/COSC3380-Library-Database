import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './checkedOutHistory.css';

function CheckedOutHistory() {
  const [books, setBooks] = useState([]);
  const [tech, setTech] = useState([]);
  const [music, setMusic] = useState([]);
  const [waitlist, setWaitlist] = useState([]);

  useEffect(() => {
    // Fetch checked-out books
    axios.get('/api/user/checkedOutBooks').then((response) => setBooks(response.data));

    // Fetch checked-out tech items
    axios.get('/api/user/checkedOutTech').then((response) => setTech(response.data));

    // Fetch checked-out music items
    axios.get('/api/user/checkedOutMusic').then((response) => setMusic(response.data));

    // Fetch waitlist items
    axios.get('/api/user/waitlistItems').then((response) => setWaitlist(response.data));
  }, []);

  return (
    <div className="checked-out-history">
      <h1>Checkout History</h1>
      
      <section className="history-section">
        <h2>Books</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Checkout Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{new Date(book.checkoutDate).toLocaleDateString()}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="history-section">
        <h2>Tech</h2>
        <table>
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Checkout Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tech.map(item => (
              <tr key={item.id}>
                <td>{item.deviceName}</td>
                <td>{new Date(item.checkoutDate).toLocaleDateString()}</td>
                <td>{new Date(item.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="history-section">
        <h2>Music</h2>
        <table>
          <thead>
            <tr>
              <th>Album</th>
              <th>Checkout Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {music.map(album => (
              <tr key={album.id}>
                <td>{album.albumName}</td>
                <td>{new Date(album.checkoutDate).toLocaleDateString()}</td>
                <td>{new Date(album.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="history-section">
        <h2>Waitlist</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Added Date</th>
            </tr>
          </thead>
          <tbody>
            {waitlist.map(item => (
              <tr key={item.id}>
                <td>{item.title || item.deviceName || item.albumName}</td>
                <td>{item.type}</td>
                <td>{new Date(item.addedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default CheckedOutHistory;
