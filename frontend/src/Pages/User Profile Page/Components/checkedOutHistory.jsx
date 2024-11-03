import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CheckedOutHistory({ userId }) {
  const [books, setBooks] = useState([]);
  const [tech, setTech] = useState([]);
  const [music, setMusic] = useState([]);
  const [waitlist, setWaitlist] = useState([]);

  useEffect(() => {
    axios.get(`https://library-database-backend.onrender.com/api/checkoutbook/${userId}`)
      .then((response) => {
        console.log("Books data:", response.data);
        setBooks(response.data);
      })
      .catch((error) => console.error("Error fetching checked-out books:", error));
  
    axios.get(`https://library-database-backend.onrender.com/api/checkoutTech/${userId}`)
      .then((response) => {
        console.log("Tech data:", response.data);
        setTech(response.data);
      })
      .catch((error) => console.error("Error fetching checked-out tech items:", error));
  
    axios.get(`https://library-database-backend.onrender.com/api/checkoutmusic/${userId}`)
      .then((response) => {
        console.log("Music data:", response.data);
        setMusic(response.data);
      })
      .catch((error) => console.error("Error fetching checked-out music items:", error));
  }, [userId]);
  

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Checkout History</h1>
      
      {/* Container with scroll feature */}
      <div className="overflow-y-auto max-h-96">

        {/* Books Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Books</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="p-3 text-gray-800">Title</th>
                <th className="p-3 text-gray-800">Checkout Date</th>
                <th className="p-3 text-gray-800">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.checkedOutBookHistoryId} className="border-b">
                  <td className="p-3 text-gray-700">{book.title}</td>
                  <td className="p-3 text-gray-700">{new Date(book.timeStampCheckedOut).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-700">{new Date(book.timeStampDue).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Tech Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Tech</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="p-3 text-gray-800">Device Name</th>
                <th className="p-3 text-gray-800">Checkout Date</th>
                <th className="p-3 text-gray-800">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tech.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 text-gray-700">{item.deviceName}</td>
                  <td className="p-3 text-gray-700">{new Date(item.checkoutDate).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-700">{new Date(item.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Music Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Music</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="p-3 text-gray-800">Album</th>
                <th className="p-3 text-gray-800">Checkout Date</th>
                <th className="p-3 text-gray-800">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {music.map(album => (
                <tr key={album.id} className="border-b">
                  <td className="p-3 text-gray-700">{album.albumName}</td>
                  <td className="p-3 text-gray-700">{new Date(album.checkoutDate).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-700">{new Date(album.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

     

      </div>
    </div>
  );
}

export default CheckedOutHistory;