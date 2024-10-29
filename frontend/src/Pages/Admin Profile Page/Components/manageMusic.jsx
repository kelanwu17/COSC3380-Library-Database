import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../adminProfile.css';

function ManageMusic() {
  const [musicData, setMusicData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newMusic, setNewMusic] = useState({
    musicGenre: '',
    artist: '',
    dateReleased: '',
    count: 0,
    albumName: '',
    monetaryValue: 0.0,
    availabilityStatus: 1,
    lastUpdatedBy: 1,
    imgUrl: '',
  });
  const [editMusicId, setEditMusicId] = useState(null);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    fetchAllMusic();
  }, []);

  const fetchAllMusic = async () => {
    try {
      const response = await axios.get('https://library-database-backend.onrender.com/api/music/');
      setMusicData(response.data);
    } catch (err) {
      console.error('Error fetching music data');
    }
  };

  const handleSearch = () => {
    const filtered = musicData.filter(
      (music) =>
        music.artist.toLowerCase().includes(searchText.toLowerCase()) ||
        music.albumName.toLowerCase().includes(searchText.toLowerCase())
    );
    setMusicData(filtered);
  };

  const handleCreateMusic = async () => {
    try {
      const response = await axios.post(
        'https://library-database-backend.onrender.com/api/music/createMusic',
        newMusic
      );
      alert(response.data.message);
      fetchAllMusic();
      setNewMusic({
        musicGenre: '',
        artist: '',
        dateReleased: '',
        count: 0,
        albumName: '',
        monetaryValue: 0.0,
        availabilityStatus: 1,
        lastUpdatedBy: 1,
        imgUrl: '',
      });
    } catch (err) {
      console.error('Error creating music');
    }
  };

  const handleEditMusic = (music) => {
    setEditMusicId(music.musicId);
    setEditableData({ ...music });
  };

  const handleUpdateMusic = async () => {
    try {
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/music/updateMusic/${editMusicId}`,
        editableData
      );
      alert(response.data.message);
      setEditMusicId(null);
      fetchAllMusic();
    } catch (err) {
      console.error('Error updating music');
    }
  };

  const handleDeleteMusic = async (id) => {
    try {
      const response = await axios.delete(`https://library-database-backend.onrender.com/api/music/deleteMusic/${id}`);
      alert(response.data.message);
      fetchAllMusic();
    } catch (err) {
      console.error('Error deleting music');
    }
  };

  return (
    <div className="manage-music">
      <h2>Manage Music</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Artist or Album Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchAllMusic}>Get All Music</button>
      </div>

      <div className="table-container">
        <table className="music-table">
          <thead>
            <tr>
              <th>Album</th>
              <th>Artist</th>
              <th>Genre</th>
              <th>Release Date</th>
              <th>Count</th>
              <th>Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {musicData.map((music) => (
              <tr key={music.musicId}>
                <td>{music.albumName}</td>
                <td>{music.artist}</td>
                <td>{music.musicGenre}</td>
                <td>{new Date(music.dateReleased).toLocaleDateString()}</td>
                <td>{music.count}</td>
                <td>${music.monetaryValue}</td>
                <td>{music.availabilityStatus === 1 ? 'Available' : 'Not Available'}</td>
                <td>
                  <button onClick={() => handleEditMusic(music)}>Edit</button>
                  <button onClick={() => handleDeleteMusic(music.musicId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Add New Music</h3>
      <div className="form-section">
        <table className="form-table">
          <tbody>
            <tr>
              <td>Album Name</td>
              <td><input type="text" value={newMusic.albumName} onChange={(e) => setNewMusic({ ...newMusic, albumName: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Artist</td>
              <td><input type="text" value={newMusic.artist} onChange={(e) => setNewMusic({ ...newMusic, artist: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>
                <select value={newMusic.musicGenre} onChange={(e) => setNewMusic({ ...newMusic, musicGenre: e.target.value })}>
                  <option value="">Select Genre</option>
                  <option value="pop">Pop</option>
                  <option value="hip-hop">Hip-Hop</option>
                  <option value="rock">Rock</option>
                  <option value="electronic">Electronic</option>
                  <option value="other">Other</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Release Date</td>
              <td><input type="date" value={newMusic.dateReleased} onChange={(e) => setNewMusic({ ...newMusic, dateReleased: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Count</td>
              <td><input type="number" value={newMusic.count} onChange={(e) => setNewMusic({ ...newMusic, count: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Monetary Value</td>
              <td><input type="number" step="0.01" value={newMusic.monetaryValue} onChange={(e) => setNewMusic({ ...newMusic, monetaryValue: e.target.value })} /></td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <select value={newMusic.availabilityStatus} onChange={(e) => setNewMusic({ ...newMusic, availabilityStatus: e.target.value })}>
                  <option value={1}>Available</option>
                  <option value={0}>Not Available</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Image URL</td>
              <td><input type="text" value={newMusic.imgUrl} onChange={(e) => setNewMusic({ ...newMusic, imgUrl: e.target.value })} /></td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleCreateMusic}>Add Music</button>
      </div>
    </div>
  );
}

export default ManageMusic;
