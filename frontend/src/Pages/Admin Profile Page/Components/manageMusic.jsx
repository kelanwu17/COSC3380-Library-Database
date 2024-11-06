import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [editableData, setEditableData] = useState({
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
    if (editableData.dateReleased) {
      editableData.dateReleased = editableData.dateReleased.split('T')[0];
    }
    try {
      const response = await axios.put(
        `https://library-database-backend.onrender.com/api/music/updateMusic/${editMusicId}`,
        editableData
      );
      alert(response.data.message || 'Music updated successfully!');
      setEditMusicId(null);
      setEditableData({
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
      fetchAllMusic();
    } catch (error) {
      console.error('Error updating music:', error);
    }
  };

  const handleDeactivateMusic = async (id) => {
    try {
      const response = await axios.put(`https://library-database-backend.onrender.com/api/music/deactivateMusic/${id}`);
      alert(response.data.message || 'Music deactivated successfully.');
      fetchAllMusic();
    } catch (err) {
      console.error('Error deactivating music');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Manage Music</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by Artist or Album Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px 15px', marginRight: '5px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
        <button onClick={fetchAllMusic} style={{ padding: '8px 15px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Get All Music</button>
      </div>

      <div style={{
        overflowX: 'auto',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
        backgroundColor: '#fff',
        maxHeight: '500px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Album', 'Artist', 'Genre', 'Release Date', 'Count', 'Value', 'Status', 'Actions'].map((header, idx) => (
                <th key={idx} style={{
                  padding: '10px',
                  backgroundColor: '#455a7a',
                  color: 'white',
                  borderBottom: '1px solid #ddd',
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  textAlign: 'left'
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {musicData.map((music) => (
              <tr key={music.musicId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{music.albumName}</td>
                <td style={{ padding: '10px' }}>{music.artist}</td>
                <td style={{ padding: '10px' }}>{music.musicGenre}</td>
                <td style={{ padding: '10px' }}>{new Date(music.dateReleased).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>{music.count}</td>
                <td style={{ padding: '10px' }}>${music.monetaryValue.toFixed(2)}</td>
                <td style={{ padding: '10px' }}>{music.availabilityStatus === 1 ? 'Available' : 'Not Available'}</td>
                <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleEditMusic(music)} style={{ backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeactivateMusic(music.musicId)} style={{ backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
        {/* Create Music Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Add New Music</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {[
                { label: 'Album Name', value: newMusic.albumName, type: 'text', onChange: e => setNewMusic({ ...newMusic, albumName: e.target.value }) },
                { label: 'Artist', value: newMusic.artist, type: 'text', onChange: e => setNewMusic({ ...newMusic, artist: e.target.value }) },
                { label: 'Genre', value: newMusic.musicGenre, type: 'select', options: ['pop', 'hip-hop', 'rock', 'electronic', 'other'], onChange: e => setNewMusic({ ...newMusic, musicGenre: e.target.value }) },
                { label: 'Release Date', value: newMusic.dateReleased, type: 'date', onChange: e => setNewMusic({ ...newMusic, dateReleased: e.target.value }) },
                { label: 'Count', value: newMusic.count, type: 'number', onChange: e => setNewMusic({ ...newMusic, count: e.target.value }) },
                { label: 'Monetary Value', value: newMusic.monetaryValue, type: 'number', step: '0.01', onChange: e => setNewMusic({ ...newMusic, monetaryValue: e.target.value }) },
                { label: 'Status', value: newMusic.availabilityStatus, type: 'select', options: [{ label: 'Available', value: 1 }, { label: 'Not Available', value: 0 }], onChange: e => setNewMusic({ ...newMusic, availabilityStatus: e.target.value }) },
                { label: 'Image URL', value: newMusic.imgUrl, type: 'text', onChange: e => setNewMusic({ ...newMusic, imgUrl: e.target.value }) },
              ].map((field, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.label}</td>
                  <td>
                    {field.type === 'select' ? (
                      <select value={field.value} onChange={field.onChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}>
                        {(field.options || []).map((opt, index) => (
                          typeof opt === 'string'
                            ? <option key={index} value={opt}>{opt}</option>
                            : <option key={index} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input type={field.type} value={field.value} onChange={field.onChange} step={field.step || undefined} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleCreateMusic} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Add Music</button>
        </div>

        {/* Edit Music Form */}
        <div style={{
          padding: '15px',
          backgroundColor: '#455a7a',
          borderRadius: '10px',
          color: 'white',
          flex: 1,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Edit Music</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {[
                { label: 'Album Name', value: editableData.albumName || '', type: 'text', onChange: e => setEditableData({ ...editableData, albumName: e.target.value }) },
                { label: 'Artist', value: editableData.artist || '', type: 'text', onChange: e => setEditableData({ ...editableData, artist: e.target.value }) },
                { label: 'Genre', value: editableData.musicGenre || '', type: 'select', options: ['pop', 'hip-hop', 'rock', 'electronic', 'other'], onChange: e => setEditableData({ ...editableData, musicGenre: e.target.value }) },
                { label: 'Release Date', value: editableData.dateReleased || '', type: 'date', onChange: e => setEditableData({ ...editableData, dateReleased: e.target.value }) },
                { label: 'Count', value: editableData.count || '', type: 'number', onChange: e => setEditableData({ ...editableData, count: e.target.value }) },
                { label: 'Monetary Value', value: editableData.monetaryValue || '', type: 'number', step: '0.01', onChange: e => setEditableData({ ...editableData, monetaryValue: e.target.value }) },
                { label: 'Status', value: editableData.availabilityStatus || 0, type: 'select', options: [{ label: 'Available', value: 1 }, { label: 'Not Available', value: 0 }], onChange: e => setEditableData({ ...editableData, availabilityStatus: e.target.value }) },
                { label: 'Image URL', value: editableData.imgUrl || '', type: 'text', onChange: e => setEditableData({ ...editableData, imgUrl: e.target.value }) },
              ].map((field, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', color: 'white' }}>{field.label}</td>
                  <td>
                    {field.type === 'select' ? (
                      <select value={field.value} onChange={field.onChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}>
                        {(field.options || []).map((opt, index) => (
                          typeof opt === 'string'
                            ? <option key={index} value={opt}>{opt}</option>
                            : <option key={index} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input type={field.type} value={field.value} onChange={field.onChange} step={field.step || undefined} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpdateMusic} style={{ marginTop: '10px', backgroundColor: '#455a7a', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>Update Music</button>
        </div>
      </div>
    </div>
  );
}

export default ManageMusic;
